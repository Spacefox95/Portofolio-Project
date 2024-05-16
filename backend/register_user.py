import requests

url = 'http://localhost:5000/register'
user_data = {
	'firstname': 'Nathan',
	'lastname': 'Raynal',
	'role': 'Admin',
	'email': 'nathan.raynal@gmail.com',
	'password': '1234'
}
response = requests.post(url, json=user_data)

if response.status_code == 201:
	print('Enregistrement réussi')
else:
	print('Echec de l\'enregistrement', response.json())