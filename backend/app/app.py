from flask import Flask, redirect, url_for, session
from authlib.integrations.flask_client import OAuth
import os

app = Flask(__name__)
app.secret_key = 'cf2d9bcdafb3b927d6bce3f14923adfd'  # Replace with a secure secret key

app.config['SESSION_COOKIE_NAME'] = 'google-login-session'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # True if using HTTPS


# OAuth Setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='546321550328-irn32cst0j6fo9hvgj443t7lak20ulhf.apps.googleusercontent.com',       # ⬅️ Paste your actual client ID here
    client_secret='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',  # ⬅️ Paste your actual client secret
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    refresh_token_url=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    userinfo_endpoint='https://www.googleapis.com/oauth2/v1/userinfo',
    client_kwargs={'scope': 'openid email profile'},
    redirect_uri='http://localhost:5000/auth',
    metadata_url='https://accounts.google.com/.well-known/openid-configuration',  # Use OpenID metadata URL
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs'  # Add jwks_uri manually
)

# Home Route
@app.route('/')
def index():
    email = dict(session).get('email', None)
    if email:
        return f'✅ You are logged in as {email} <br><a href="/logout">Logout</a>'
    return '<a href="/login">Login with Google</a>'

# Login Route
@app.route('/login')
def login():
    redirect_uri = url_for('auth', _external=True)
    return google.authorize_redirect(redirect_uri)

# Redirect URI Handler
@app.route('/auth')
def auth():
    try:
        token = google.authorize_access_token()
        print(f"Token: {token}")  # Debug the token received
        resp = google.get('userinfo')
        user = resp.json()
        print(f"User info: {user}")  # Debug user info response
        session['email'] = user['email']
        session['name'] = user.get('name')
        return redirect(url_for('home_page'))
    except Exception as e:
        print(f"Authentication error: {e}")
        return f"Authentication error: {e}"
    '''
    token = google.authorize_access_token()
    resp = google.get('userinfo')        # ✅ Fetch user profile
    user = resp.json()                   # ✅ Extract it as JSON
    session['email'] = user['email']
    session['name'] = user.get('name')   # ✅ Store email in session (or other fields)
    return redirect(url_for('home_page'))             # ✅ Redirect to home or dashboard
    '''

@app.route('/home')
def home_page():
    return 'Welcome to the Home Page!'


# Logout Route
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
