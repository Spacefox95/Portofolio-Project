import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
	const [employees, setEmployees] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:5000/employees')
		.then(response => {
			setEmployees(response.data);
		})
		.catch(error => {
			console.error('Il y a une erreur avec les employés!', error);
		});
	}, []);
	return (
		<div>
			<h1>Répertoire des employés</h1>
			<ul>
				{employees.map(emp => (
					<li key={emp.id}>{emp.name} - {emp.role} - {emp.email}</li>
				))}
			</ul>
		</div>
	);
};

export default EmployeeList;