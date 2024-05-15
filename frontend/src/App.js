import React from "react";
import './App.css';
import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";

function App() {
	return (
		<div>
			<h1>Cartotrac Intranet</h1>
			<AddEmployee />
			<EmployeeList />
			</div>
	);
}

export default App;