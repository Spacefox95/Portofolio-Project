from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from api import bcrypt, db
from models.User import Utilisateur

login_routes = Blueprint('login_routes', __name__)

@login_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = Utilisateur.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'email': user.email, 'role': user.role})
        return jsonify(access_token=access_token), 200

    return jsonify(error='Invalid credentials'), 401
