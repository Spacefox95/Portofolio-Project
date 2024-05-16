"""
Create a Base Utilisateur object"""
from sqlalchemy import Column, String, DateTime, Integer
from datetime import datetime
from api import db

class Utilisateur(db.Model):
  id = Column(Integer, primary_key=True)
  firstname = Column(String(50), nullable=False)
  lastname = Column(String(50), nullable=False)
  role = Column(String(50), nullable=False)
  email = Column(String(50), nullable=False, unique=True)
  password = Column(String(100), nullable=False)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
