from flask import	Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Column, String, DateTime, Integer

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///intranet.db'
db = SQLAlchemy(app)
CORS(app)

class Employee(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False)
  role = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(50), nullable=False, unique=True)

@app.route('/employees', methods=['GET'])
def get_employees():
  employees = Employee.query.all()
  return jsonify([{
    'id' : emp.id,
    'name': emp.name,
    'role': emp.role,
    'email': emp.email
  } for emp in employees])

@app.route('/employee', methods=['POST'])
def add_employee():
   data = request.json
   try:
    new_employee = Employee(
        name=data['name'],
        role=data['role'],
        email=data['email']
  )
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({'message': 'Un nouvel employé a bien été ajouté'})
   except Exception as e:
     db.session.rollback()
     return jsonify({'error': str(e)}, 500)

if __name__ == '__main__':
  with app.app_context():
    db.create_all()
  app.run(debug=True)
