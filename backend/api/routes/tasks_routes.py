from flask import Blueprint, request, jsonify
from models.tasks import Task
from api import db
from datetime import datetime

tasks_routes = Blueprint('tasks_routes', __name__)

@tasks_routes.route('/tasks', methods=['GET'])
def get_tasks():
	tasks = Task.query.all()
	task_list = [{"id": task.id,
							 "title": task.title,
							 "start_date": task.start_date.strftime('%Y-%m-%d'),
							 "end_date": task.end_date.strftime('%Y-%m-%d'),
							 "description": task.description}
							 for task in tasks]
	return jsonify(task_list), 200

@tasks_routes.route('/tasks', methods=['POST'])
def create_task():
	data = request.get_json()
	try:
		start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d')
		end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
	except (TypeError, ValueError) as e:
		return jsonify({"error": "Invalid date format"}), 400

	new_task = Task(
		title=data.get('title'),
		start_date=start_date,
		end_date=end_date,
		description=data.get('description')
	)
	db.session.add(new_task)
	db.session.commit()
	return jsonify({"message": "La tâche a bien été créée"}), 201

@tasks_routes.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
	task = Task.query.get_or_404(task_id)
	task_data = {"id": task.id,
							"title": task.title,
							"start_date": task.start_date.strftime('%Y-%m-%d'),
							"end_date": task.end_date.strftime('%Y-%m-%d'),
							"description": task.description}
	return jsonify(task_data), 200

@tasks_routes.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
	task = Task.query.get_or_404(task_id)
	data = request.get_json()
	try:
		start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d')
		end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
	except (TypeError, ValueError) as e:
		return jsonify({"error": "Invalid date format"}), 400

	task.title = data.get("title")
	task.start_date = start_date
	task.end_date = end_date
	task.description = data.get('description')
	db.session.commit()
	return jsonify({"message": "La tâche a bien été mise à jour"}), 200

@tasks_routes.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
	task = Task.query.get_or_404(task_id)
	db.session.delete(task)
	db.session.commit()
	return jsonify({"message": "La tâche a bien été supprimée"})
