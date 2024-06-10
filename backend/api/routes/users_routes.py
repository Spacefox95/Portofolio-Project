from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from api import db, bcrypt
from models.User import Utilisateur

users_routes = Blueprint('users_routes', __name__)

@users_routes.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = Utilisateur.query.all()
    return jsonify([{
        'id': emp.id,
        'firstname': emp.firstname,
        'lastname': emp.lastname,
        'role': emp.role,
        'email': emp.email
    } for emp in users])

@users_routes.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    data = request.json

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    role = data.get('role')
    email = data.get('email')
    password = data.get('password')

    if not all([firstname, lastname, role, email, password]):
        return jsonify({"message": "Tous les champs sont requis"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        new_user = Utilisateur(
            firstname=firstname,
            lastname=lastname,
            role=role,
            email=email,
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Un nouvel utilisateur a bien été ajouté'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}, 500)

@users_routes.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    data = request.json
    employee = Utilisateur.query.get(id)
    if not employee:
        return jsonify({'error': 'Utilisateur non trouvé non trouvé'}), 404
    try:
        employee.firstname = data.get('firstname', employee.firstname)
        employee.lastname = data.get('lastname', employee.lastname)
        employee.role = data.get('role', employee.role)
        employee.email = data.get('email', employee.email)
        employee.password = data.get('password', employee.password)
        db.session.commit()
        return jsonify({'message': 'Les informations de l\'utilisateur ont bien été mises à jour'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}, 500)

@users_routes.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    employee = Utilisateur.query.get(id)
    if employee is None:
        return jsonify({'error': 'L\'utilisateur n\'a pas été trouvé'}), 404
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'L\'utilisateur a bien été supprimé'})
