import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateEmploye from './UpdateEmployee';

const EmployeeList = () => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);

	useEffect(() => {
		fetchEmployees();
	}, []);

	const fetchEmployees = () => {
		const token = localStorage.getItem('token');
		axios.get('http://localhost:5000/employees', {
			headers: { Authorization: `Bearer ${token}` }
		})
		.then(response => {
			console.log(response.data);
			setEmployees(response.data);
		})
		.catch(error => {
			console.error('Il y a une erreur avec les employés !', error);
		});
	};

const handleDelete = (id) => {
	const token = localStorage.getItem('token');
	axios.delete(`http://localhost:5000/employees/${id}`, {
		headers: {Authorization: `Bearer ${token}` }
	})
	.then(response => {
		console.log(response.data.message);
		fetchEmployees();
	})
	.catch(error => {
		console.error('Erreur lors de la suppresssion de l\'employé', error);
	});
};

	return (
		<div>
			<h1>Répertoire des employés</h1>
			<ul>
				{employees.map(emp => (
					<li key={emp.id}>{emp.firstname} {emp.lastname} - {emp.role} - {emp.email}
					<button onClick={() => handleDelete(emp.id)} style={{ marginLeft: '10px' }}>Supprimer cet employé</button>
					<button onClick={() => setSelectedEmployee(emp)}>Modifier</button>
					</li>
				))}
			</ul>
			{selectedEmployee && (
				<UpdateEmploye employee={selectedEmployee} onUpdate={() => {
					fetchEmployees();
					setSelectedEmployee(null);
				}} />
			)}
		</div>
	);
};

export default EmployeeList;