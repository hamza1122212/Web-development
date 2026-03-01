"""
Markivo – Flask Backend
Handles routing, contact form, login, signup
Connected to MySQL via PyMySQL
"""

import os
import re
import pymysql
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'markivo-dev-secret-key-change-in-production')

# ──────────────────────────────────────────
# MySQL Database Connection
# ──────────────────────────────────────────
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',           # Update with your MySQL password
    'database': 'markivo_db',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}


def get_db():
    """Get a MySQL database connection"""
    return pymysql.connect(**DB_CONFIG)


# ──────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


def validate_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)


def sanitize(text):
    """Basic HTML sanitization"""
    return text.replace('<', '&lt;').replace('>', '&gt;').strip()


# ──────────────────────────────────────────
# Page Routes
# ──────────────────────────────────────────
@app.route('/')
def home():
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/services')
def services():
    return render_template('services.html')


@app.route('/packages')
def packages():
    return render_template('packages.html')


@app.route('/blogs')
def blogs():
    return render_template('blogs.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = sanitize(request.form.get('name', ''))
        email = sanitize(request.form.get('email', ''))
        phone = sanitize(request.form.get('phone', ''))
        message = sanitize(request.form.get('message', ''))

        # Validate
        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': 'Please fill in all required fields.'}), 400

        if not validate_email(email):
            return jsonify({'status': 'error', 'message': 'Please enter a valid email address.'}), 400

        # Save to MySQL
        try:
            conn = get_db()
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO contacts (name, email, phone, message) VALUES (%s, %s, %s, %s)",
                    (name, email, phone, message)
                )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"DB Error: {e}")
            return jsonify({'status': 'error', 'message': 'Server error. Please try again.'}), 500

        return jsonify({'status': 'success', 'message': 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'})

    return render_template('contact.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = sanitize(request.form.get('email', ''))
        password = request.form.get('password', '')

        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Please fill in all fields.'}), 400

        # Lookup user in MySQL
        try:
            conn = get_db()
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                user = cursor.fetchone()
            conn.close()
        except Exception as e:
            print(f"DB Error: {e}")
            return jsonify({'status': 'error', 'message': 'Server error. Please try again.'}), 500

        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'status': 'error', 'message': 'Invalid email or password.'}), 401

        session['user'] = {'name': user['name'], 'email': user['email']}
        return jsonify({'status': 'success', 'message': f'Welcome back, {user["name"]}! Redirecting...'})

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = sanitize(request.form.get('name', ''))
        email = sanitize(request.form.get('email', ''))
        password = request.form.get('password', '')
        confirm = request.form.get('confirm_password', '')

        # Validate
        if not name or not email or not password or not confirm:
            return jsonify({'status': 'error', 'message': 'Please fill in all fields.'}), 400

        if not validate_email(email):
            return jsonify({'status': 'error', 'message': 'Please enter a valid email address.'}), 400

        if len(password) < 8:
            return jsonify({'status': 'error', 'message': 'Password must be at least 8 characters long.'}), 400

        if password != confirm:
            return jsonify({'status': 'error', 'message': 'Passwords do not match.'}), 400

        # Check if user exists in MySQL
        try:
            conn = get_db()
            with conn.cursor() as cursor:
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                existing = cursor.fetchone()

            if existing:
                conn.close()
                return jsonify({'status': 'error', 'message': 'An account with this email already exists.'}), 409

            # Create user
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                    (name, email, generate_password_hash(password))
                )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"DB Error: {e}")
            return jsonify({'status': 'error', 'message': 'Server error. Please try again.'}), 500

        return jsonify({'status': 'success', 'message': 'Account created successfully! Redirecting to login...'})

    return render_template('signup.html')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


# ──────────────────────────────────────────
# Run
# ──────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
