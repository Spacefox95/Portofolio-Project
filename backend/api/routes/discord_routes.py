from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.User import Utilisateur
import webbrowser

discord_routes = Blueprint('discord_routes', __name__)

@discord_routes.route('/discord', methods=['GET'])
@jwt_required()
def discord():
	webbrowser.open('https://discord.com/api/guilds/695650077657661451/widget.json')