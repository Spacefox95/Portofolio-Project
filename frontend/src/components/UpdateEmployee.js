import React, { useState } from "react";
import axios from "axios";

function UpdateEmploye({ employee, onUpdate }) {
	const [firstname, setFirstName] = useState(employee.firstname);
	const [lastname, setLastName] = useState(employee.lastname);
	const [role, setRole] = useState(employee.role);
	const [email, setEmail] = useState(employee.email);

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.put(`http://localhost:5000/employees/${employee.id}`, {
			firstname,
			lastname,
			role,
			email
		})
			.then(response => {
				onUpdate();
				alert('Les informations de l\'employé ont bien été mises à jour');
			})
			.catch(error => {
				console.error('Il y a eu une erreur lors de la mise à jour de l\'employé', error);
			});
	};
	return (
		<div>
			<h2>Mettre à jour les informations de l'employé</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={firstname}
					onChange={e => setFirstName(e.target.value)}
					placeholder="Prénom"
					required
				/>
				<input
				type="text"
				value={lastname}
				onChange={e => setLastName(e.target.value)}
				placeholder="Nom"
				required
				/>
				<input
				type="text"
				value={role}
				onChange={e => setRole(e.target.value)}
				placeholder="Rôle"
				required
				/>
				<input
				type="text"
				value={email}
				onChange={e => setEmail(e.target.value)}
				placeholder="E-mail"
				required
				/>
				<button type="submit">Mettre à jour</button>
			</form>
		</div>
	)
}

export default UpdateEmploye;