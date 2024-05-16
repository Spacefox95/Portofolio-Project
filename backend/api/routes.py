from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from api import bcrypt, db
from models.User import Utilisateur
from flask import current_app as app

@app.route('/register', methods=['POST'])
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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    employee = Utilisateur.query.filter_by(email=data['email']).first()
    if employee and bcrypt.check_password_hash(employee.password, data['password']):
        access_token = create_access_token(identity={'id': employee.id, 'email': employee.email})
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Accréditation non valide'}), 401

@app.route('/users', methods=['GET'])
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

@app.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    data = request.json
    try:
        new_user = Utilisateur(
            firstname=data['firstname'],
            lastname=data['lastname'],
            role=data['role'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Un nouvel employé a bien été ajouté'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}, 500)

@app.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    data = request.json
    employee = Utilisateur.query.get(id)
    if not employee:
        return jsonify({'error': 'Employé non trouvé'}), 404
    try:
        employee.firstname = data.get('firstname', employee.firstname)
        employee.lastname = data.get('lastname', employee.lastname)
        employee.role = data.get('role', employee.role)
        employee.email = data.get('email', employee.email)
        employee.password = data.get('password', employee.password)
        db.session.commit()
        return jsonify({'message': 'Les informations de l\'employé ont bien été mises à jour'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}, 500)

@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    employee = Utilisateur.query.get(id)
    if employee is None:
        return jsonify({'error': 'L\'employé n\'a pas été trouvé'}), 404
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'L\'employé a bien été supprimé'})
