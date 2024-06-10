from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

upload_routes = Blueprint('upload_routes', __name__)

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
	os.makedirs(UPLOAD_FOLDER)

def allowed_files(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_routes.route('/upload', methods=['POST'])
def upload_file():
	if 'file' not in request.files:
		return jsonify({"error": "Pas de fichier"}), 400
	file = request.files['file']
	if file.filename == '':
		return jsonify({"error": "Pas de fichier sélectionné"}), 400
	if file and allowed_files(file.filename):
		filename = secure_filename(file.filename)
		file.save(os.path.join(UPLOAD_FOLDER, filename))
		return jsonify({'message': "Le fichier a bien été enregistré"}), 200
	else:
		return jsonify({"error": "Ce type de fichier n'est pas autorisé"}), 400