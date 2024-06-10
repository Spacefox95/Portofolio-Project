from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_session import Session
from flask_cors import CORS
import os

# Initialize the database
db = SQLAlchemy()

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

# Initialize JWT for handling JSON Web Tokens
jwt = JWTManager()

# Create a function to create the Flask application
def create_app():
    app = Flask(__name__)
    
    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///intranet.db'
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
    app.config['SESSION_TYPE'] = 'filesystem'
    
    # Initialize Flask-Session
    Session(app)
    
    # Initialize CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Initialize the extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes.login_routes import login_routes
    from .routes.register_routes import register_routes
    from .routes.users_routes import users_routes
    from .routes.profile_routes import profile_routes
    from .GCalendar.upcomingevents import calendar_routes
    from .routes.upload_routes import upload_routes
    
    app.register_blueprint(login_routes)
    app.register_blueprint(register_routes)
    app.register_blueprint(users_routes)
    app.register_blueprint(profile_routes)
    app.register_blueprint(calendar_routes)
    app.register_blueprint(upload_routes)
    
    return app
