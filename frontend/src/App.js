import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import Login from "./components/Login";

function App() {
	const [isAuthenticated, setIsAutenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsAutenticated(true);
		}
	}, []);

	const handleLogin = () => {
		setIsAutenticated(true);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setIsAutenticated(false);
	};

	return (
		<Router>
			<div>
				<h1>Cartotrac Intranet</h1>
				{isAuthenticated && <button onClick={handleLogout}>Déconnexion</button>}
				<Routes>
					<Route path="/login" element={isAuthenticated ? <Navigate to ="/" /> : <Login onLogin={handleLogin} />} />
					<Route path="/" element={isAuthenticated ? (
							<>
								<AddEmployee />
								<EmployeeList />
							</>
						) : (
							<Navigate to="/login" />
						)} />
					</Routes>
			</div>
		</Router >
	);
}

export default App;