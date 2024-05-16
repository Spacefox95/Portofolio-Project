import React, { useState } from 'react';
import axios from 'axios';

function AddEmployee() {
	const [firstname, setFirstName] = useState('');
	const [lastname, setLastName] = useState('');
	const [role, setRole] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		try {
			const response = await axios.post('http://localhost:5000/employees', {
				firstname, lastname, role, email, password
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setFirstName('');
			setLastName('');
			setRole('');
			setEmail('');
			setPassword('');
			onAdd();
			console.log('Employé ajouté:', response.data);
		} catch (error) {
			console.error('Il y a eu une erreur lors de l\'ajout d\'un employé!', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Ajouter un employé</h1>
			<div>
				<label>Prénom</label>
				<input
					type='text'
					value={firstname}
					onChange={e => setFirstName(e.target.value)}
					placeholder='Prénom'
					required
				/>
			</div>
			<div>
				<label>Nom</label>
				<input
					type='text'
					value={lastname}
					onChange={e => setLastName(e.target.value)}
					placeholder='Nom'
					required
				/>
			</div>
			<div>
				<label>Rôle</label>
				<input
					type='text'
					value={role}
					onChange={e => setRole(e.target.value)}
					placeholder='Rôle'
					required
				/>
			</div>
			<div>
				<label>Email</label>
				<input
					type='text'
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="E-mail"
					required
				/>
			</div>
			<div>
				<label>Mot de passe</label>
				<input
				type='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				placeholder='Mot de passe'
				required
				/>
			</div>
			<button type='submit'>Ajouter</button>
		</form>
	);
};

export default AddEmployee;