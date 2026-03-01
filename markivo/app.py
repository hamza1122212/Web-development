from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'markivo_secret_key_neon_glow'


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
 
    posts = [
        {"title": "SEO Trends 2024", "desc": "AI is changing search forever...", "img": "seo.jpg"},
        {"title": "High-Converting Websites", "desc": "The psychology of color in UI...", "img": "web.jpg"},
        {"title": "Branding 101", "desc": "Why your logo is not your brand...", "img": "brand.jpg"},
        {"title": "Social Media Growth", "desc": "Viral strategies for TikTok & Reels...", "img": "social.jpg"},
        {"title": "Paid Ads ROI", "desc": "Stop burning cash on Facebook Ads...", "img": "ads.jpg"},
        {"title": "Conversion Optimization", "desc": "Simple tweaks to double sales...", "img": "cro.jpg"}
    ]
    return render_template('blogs.html', posts=posts)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        

        flash("Login functionality would be connected here.", "info")
        return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    return render_template('signup.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = 'markivo_secret_key_neon_glow'
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        
        if password != confirm_password:
            flash("Passwords do not match!", "error")
            return redirect(url_for('signup'))

        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        
        """
        conn = mysql.connector.connect(user='root', password='', host='127.0.0.1', database='markivo_db')
        cursor = conn.cursor()
        query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, email, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        """
        
        print(f"User Created: {username}, Hashed Pass: {hashed_password}") 
        flash("Account created successfully! Please login.", "success")
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password_candidate = request.form.get('password')

       
        
        flash("Login successful!", "success")
        return redirect(url_for('home'))

    return render_template('login.html')