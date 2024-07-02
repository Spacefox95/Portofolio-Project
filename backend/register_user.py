# register_user.py
from api import create_app, db, bcrypt
from models.User import Utilisateur, SuperUser, Collaborateur, Invite

def add_user(firstname, lastname, role, email, password):
    app = create_app()
    with app.app_context():
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        if role == 'superuser':
            new_user = SuperUser(
                firstname=firstname,
                lastname=lastname,
                role=role,
                email=email,
                password=hashed_password
            )
        elif role == 'collaborateur':
            new_user = Collaborateur(
                firstname=firstname,
                lastname=lastname,
                role=role,
                email=email,
                password=hashed_password
            )
        elif role == 'invite':
            new_user = Invite(
                firstname=firstname,
                lastname=lastname,
                role=role,
                email=email,
                password=hashed_password
            )
        else:
            print("Invalid role")
            return
        
        try:
            db.session.add(new_user)
            db.session.commit()
            print("L'utilisateur {} a bien été enregistré".format(email))
        except Exception as e:
            db.session.rollback()
            print("Error: {}".format(str(e)))

if __name__ == '__main__':
    add_user('Nathan', 'Raynal', 'superuser', 'nathan.raynal@gmail.com', '1234')
