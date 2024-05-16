from flask import	Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///intranet.db'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

class Employee(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  firstname = db.Column(db.String(50), nullable=False)
  lastname = db.Column(db.String(50), nullable=False)
  role = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(50), nullable=False, unique=True)
  password = db.Column(db.String(100), nullable=False)

@app.route('/register', methods=['POST'])
def register():
  data = request.json
  hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
  new_employee = Employee(
    firstname = data['firstname'],
    lastname = data['lastname'],
    role = data['role'],
    email = data['email'],
    password = hashed_password
  )
  db.session.add(new_employee)
  db.session.commit()
  return jsonify({'message': 'Enregistrement réussi'}), 201

@app.route('/login', methods=['POST'])
def login():
  data = request.json
  employee = Employee.query.filter_by(email=data['email']).first()
  if employee and bcrypt.check_password_hash(employee.password, data['password']):
    access_token = create_access_token(identity={'id': employee.id, 'email': employee.email})
    return jsonify(access_token=access_token)
  return jsonify({'message': 'Accréditation non valide'}), 401


@app.route('/employees', methods=['GET'])
@jwt_required()
def get_employees():
  employees = Employee.query.all()
  return jsonify([{
    'id' : emp.id,
    'firstname': emp.firstname,
    'lastname': emp.lastname,
    'role': emp.role,
    'email': emp.email
  } for emp in employees])

@app.route('/employees', methods=['POST'])
@jwt_required()
def add_employee():
   data = request.json
   try:
    new_employee = Employee(
        firstname=data['firstname'],
        lastname= data['lastname'],
        role=data['role'],
        email=data['email']
  )
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({'message': 'Un nouvel employé a bien été ajouté'})
   except Exception as e:
     db.session.rollback()
     return jsonify({'error': str(e)}, 500)

@app.route('/employees/<int:id>', methods=['PUT'])
@jwt_required()
def update_employee(id):
  data = request.json
  employee = Employee.query.get(id)
  if not employee:
    return jsonify({'error': 'Employé non trouvé'}), 404
  try:
    employee.firstname = data.get('firstname', employee.firstname)
    employee.lastname = data.get('lastname', employee.lastname)
    employee.role = data.get('role', employee.role)
    employee.email = data.get('email', employee.email)
    db.session.commit()
    return jsonify({'message': 'Les informations de l\'employé ont bien été mises à jour'})
  except Exception as e:
    db.session.rollback()
    return jsonify({'error': str(e)}, 500)

@app.route('/employees/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_employee(id):
  employee = Employee.query.get(id)
  if employee is None:
    return jsonify({'error': 'L\'employé n\'a pas été trouvé'}), 404
  db.session.delete(employee)
  db.session.commit()
  return jsonify({'message': 'L\'employé a bien été supprimé'})

if __name__ == '__main__':
  with app.app_context():
    db.create_all()
  app.run(debug=True)
