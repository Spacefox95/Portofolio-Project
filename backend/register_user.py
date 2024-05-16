from api import create_app, db, bcrypt
from models.User import Utilisateur

def add_user(firstname, lastname, role, email, password):
   app = create_app()
   with app.app_context():
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = Utilisateur(
      firstname=firstname,
      lastname=lastname,
      role=role,
      email=email,
      password=hashed_password
      )
    try:
      db.session.add(new_user)
      db.session.commit()
      print("L'utilisateur {} a bien été enregistré".format(email))
    except Exception as e:
      db.session.rollback()
      print("Error: {}".format(str(e)))

if __name__ == '__main__':
  add_user('Nathan', 'Raynal', 'admin', 'nathan.raynal@gmail.com', '1234')
