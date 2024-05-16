import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./pages/Profile";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const handleLogin = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setIsAuthenticated(false);
	};

	return (
		<Router>
				<div>
						<h1>Cartotrac Intranet</h1>
						{isAuthenticated && <button onClick={handleLogout}>Déconnexion</button>}
						<Routes>
								<Route path="/login" element={isAuthenticated ? <Navigate to ="/" /> : <Login onLogin={handleLogin} />} />
								<Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} /> {/* This route is adjusted */}
								<Route path="/profile" element={<Profile />} />
								<Route path="/employee-list" element={<EmployeeList />} />
								<Route path="/add-employee" element={<AddEmployee />} />
						</Routes>
				</div>
		</Router >
);
}

export default App;