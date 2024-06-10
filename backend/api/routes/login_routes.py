from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token
from api import bcrypt, db
from models.User import Utilisateur

login_routes = Blueprint('login_routes', __name__)

@login_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    employee = Utilisateur.query.filter_by(email=data['email']).first()
    if not employee:
        return jsonify({'error': 'Adresse email inconnue'}), 401
    if not bcrypt.check_password_hash(employee.password, data['password']):
        return jsonify({'error': 'Mot de passe erroné'}), 401
    access_token = create_access_token(identity={'id': employee.id, 'email': employee.email})
    return jsonify(access_token=access_token)
