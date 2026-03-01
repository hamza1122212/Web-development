"""
Gaming Desktop – Flask Backend Application
Premium Gaming Accessories eCommerce Store
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import os

# ============================================
# App Configuration
# ============================================
app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'

# ============================================
# In-memory store (replace with MySQL in production)
# ============================================
users_db = {}
contact_messages = []

# ============================================
# Page Routes
# ============================================

@app.route('/')
def home():
    """Render the home page."""
    return render_template('home.html')

@app.route('/about')
def about():
    """Render the about page."""
    return render_template('about.html')

@app.route('/products')
def products():
    """Render the products page."""
    return render_template('products.html')

@app.route('/packages')
def packages():
    """Render the packages page."""
    return render_template('packages.html')

@app.route('/blogs')
def blogs():
    """Render the blogs page."""
    return render_template('blogs.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Handle contact page and form submission."""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        # Server-side validation
        if not all([name, email, subject, message]):
            flash('All fields are required.', 'error')
            return redirect(url_for('contact'))

        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address.', 'error')
            return redirect(url_for('contact'))

        # Store message (in production, save to MySQL via PHP/direct connection)
        contact_messages.append({
            'name': name,
            'email': email,
            'subject': subject,
            'message': message
        })

        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')

# ============================================
# Authentication Routes
# ============================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        # Server-side validation
        if not email or not password:
            flash('Please fill in all fields.', 'error')
            return redirect(url_for('login'))

        # Check user credentials
        user = users_db.get(email)
        if user and check_password_hash(user['password'], password):
            session['user_id'] = email
            session['user_name'] = user['name']
            flash(f'Welcome back, {user["name"]}!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password.', 'error')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Handle user registration."""
    if request.method == 'POST':
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()

        # Server-side validation
        if not all([first_name, last_name, email, password, confirm_password]):
            flash('All fields are required.', 'error')
            return redirect(url_for('signup'))

        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address.', 'error')
            return redirect(url_for('signup'))

        if len(password) < 8:
            flash('Password must be at least 8 characters.', 'error')
            return redirect(url_for('signup'))

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('signup'))

        if email in users_db:
            flash('An account with this email already exists.', 'error')
            return redirect(url_for('signup'))

        # Create user with hashed password
        users_db[email] = {
            'name': f'{first_name} {last_name}',
            'email': email,
            'password': generate_password_hash(password)
        }

        flash('Account created successfully! Please sign in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/logout')
def logout():
    """Log user out and clear session."""
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('home'))

# ============================================
# Cart API Routes
# ============================================

@app.route('/api/cart', methods=['GET'])
def get_cart():
    """Get current cart contents from session."""
    cart = session.get('cart', [])
    return jsonify({'cart': cart, 'total': sum(item['price'] * item['qty'] for item in cart)})

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to session cart."""
    data = request.get_json()
    if not data or 'name' not in data or 'price' not in data:
        return jsonify({'error': 'Invalid data'}), 400

    cart = session.get('cart', [])
    existing = next((item for item in cart if item['name'] == data['name']), None)

    if existing:
        existing['qty'] += 1
    else:
        cart.append({
            'name': data['name'],
            'price': float(data['price']),
            'qty': 1,
            'emoji': data.get('emoji', '🎮')
        })

    session['cart'] = cart
    return jsonify({'success': True, 'cart_count': sum(item['qty'] for item in cart)})

@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    """Remove item from session cart by index."""
    data = request.get_json()
    index = data.get('index', -1)
    cart = session.get('cart', [])

    if 0 <= index < len(cart):
        cart.pop(index)
        session['cart'] = cart
        return jsonify({'success': True})

    return jsonify({'error': 'Invalid index'}), 400

# ============================================
# Run Application
# ============================================

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
