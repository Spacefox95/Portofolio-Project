# models/User.py
from sqlalchemy import Column, String, DateTime, Integer
from datetime import datetime
from api import db

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    id = Column(Integer, primary_key=True)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    role = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __mapper_args__ = {
        'polymorphic_identity': 'utilisateur',
        'polymorphic_on': role
    }

class SuperUser(Utilisateur):
    __mapper_args__ = {
        'polymorphic_identity': 'superuser',
    }

class Collaborateur(Utilisateur):
    __mapper_args__ = {
        'polymorphic_identity': 'collaborateur',
    }

class Invite(Utilisateur):
    __mapper_args__ = {
        'polymorphic_identity': 'invite',
    }
