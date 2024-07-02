from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import get_jwt_identity
from models.User import Utilisateur

def roles_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            user = Utilisateur.query.filter_by(email=current_user['email']).first()
            if user is None or user.role not in roles:
                return jsonify({'error': 'Unauthorized access'}), 403
            g.user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator
