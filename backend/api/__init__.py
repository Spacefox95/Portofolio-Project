from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
import os

bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

def create_app():
	app = Flask(__name__)
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///intranet.db'
	app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

	bcrypt.init_app(app)
	jwt.init_app(app)
	db.init_app(app)
	CORS(app)

	with app.app_context():
		from api import routes
		db.create_all()
	
	return app