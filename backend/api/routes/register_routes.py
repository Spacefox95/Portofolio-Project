from flask import Blueprint, jsonify, request
from api import bcrypt, db
from models.User import Utilisateur

register_routes = Blueprint('register_routes', __name__)

@register_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = Utilisateur(
        firstname=data['firstname'],
        lastname=data['lastname'],
        role=data['role'],
        email=data['email'],
        password=hashed_password
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Enregistrement réussi'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
