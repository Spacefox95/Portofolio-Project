from flask import Blueprint, jsonify, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from api import bcrypt, db
from models.User import Utilisateur
from decorators import roles_required

profile_routes = Blueprint('profile_routes', __name__)

@profile_routes.route('/profile', methods=['GET', 'OPTIONS'])
@jwt_required()
def profile():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    current_user = get_jwt_identity()
    user = Utilisateur.query.filter_by(email=current_user['email']).first()
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    return jsonify({
        'id': user.id,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'role': user.role,
        'email': user.email
    })

@profile_routes.route('/profile', methods=['PUT'])
@jwt_required()
@roles_required('superuser')
def update_profile():
    user = g.user
    data = request.json
    try:
        user.firstname = data.get('firstname', user.firstname)
        user.lastname = data.get('lastname', user.lastname)
        user.role = data.get('role', user.role)
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        db.session.commit()
        return jsonify({'message': 'Les informations de l\'utilisateur ont bien été mises à jour'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
