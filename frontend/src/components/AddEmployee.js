import React, { useState } from 'react';
import axios from 'axios';

function AddEmployee() {
	const [name, setName] = useState('');
	const [role, setRole] = useState('');
	const [email, setEmail] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!name || !role || !email) {
			console.error('Tous les champs doivent être remplis');
			return;
		}
		axios.post('http://127.0.0.1:5000/employees', {
			name: name,
			role: role,
			email: email
		})
		.then(response => {
			console.log('Employé ajouté:', response.data);
			setName('');
			setRole('');
			setEmail('');
		})
		.catch(error => {
			console.error('Il y a eu une erreur lors de l ajout d un employé!', error);
		});
	};
	return (
		<div>
			<h1>Ajout Employé</h1>
			<form onSubmit={handleSubmit}>
				<input
				type='text'
				value={name}
				onChange={e => setName(e.target.value)}
				placeholder='Name'
				required
				/>
				<input
				type='text'
				value={role}
				onChange={e => setRole(e.target.value)}
				placeholder='Role'
				required
				/>
				<input
				type='text'
				value={email}
				onChange={e => setEmail(e.target.value)}
				placeholder="Email"
				required
				/>
				<button type='submit'>Ajouter</button>
			</form>
		</div>
	);
}

export default AddEmployee;