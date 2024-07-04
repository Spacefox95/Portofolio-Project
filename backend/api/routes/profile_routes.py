from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from api import bcrypt, db
from models.User import Utilisateur
from decorators import roles_required

profile_routes = Blueprint('profile_routes', __name__)

@profile_routes.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user_email = get_jwt_identity().get('email')
        if not current_user_email:
            return jsonify({'error': 'Missing email in JWT token'}), 400
        
        user = Utilisateur.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'email': user.email
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profile_routes.route('/profile', methods=['PUT'])
@jwt_required()
@roles_required('superuser', 'collaborateur')
def update_profile():
    try:
        current_user_email = get_jwt_identity().get('email')
        if not current_user_email:
            return jsonify({'error': 'Missing email in JWT token'}), 400
        
        user = Utilisateur.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update user information
        data = request.get_json()
        user.firstname = data.get('firstname', user.firstname)
        user.lastname = data.get('lastname', user.lastname)
        user.email = data.get('email', user.email)
        db.session.commit()

        return jsonify({
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'role': user.role
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
