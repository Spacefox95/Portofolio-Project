from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from bson import Binary, ObjectId
import io

upload_routes = Blueprint('upload_routes', __name__)

@upload_routes.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_data = file.read()
    db = current_app.config['MONGO_DB']

    file_id = db.files.insert_one({
        "filename": filename,
        "data": Binary(file_data),
        "content_type": file.content_type
    }).inserted_id

    return jsonify({"message": "File successfully uploaded", "file_id": str(file_id)}), 201

@upload_routes.route('/upload/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    db = current_app.config['MONGO_DB']
    result = db.files.delete_one({"_id": ObjectId(file_id)})

    if result.deleted_count == 1:
        return jsonify({"message": "File successfully deleted"}), 200
    else:
        return jsonify({"error": "File not found"}), 404

@upload_routes.route('/upload', methods=['GET'])
def list_files():
    db = current_app.config['MONGO_DB']
    files = db.files.find()
    file_list = [{"_id": str(file["_id"]), "filename": file["filename"]} for file in files]
    return jsonify(file_list), 200

@upload_routes.route('/upload/<file_id>', methods=['GET'])
def get_file(file_id):
    db = current_app.config['MONGO_DB']
    file = db.files.find_one({"_id": ObjectId(file_id)})

    if file:
        return send_file(
            io.BytesIO(file['data']),
            mimetype=file['content_type'],
            as_attachment=False,
            download_name=file['filename']
        )
    else:
        return jsonify({'error': 'File not found'}), 404
