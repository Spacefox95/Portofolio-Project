import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UsersList from "./pages/UsersList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadDoc from "./pages/UploadDoc";
import TaskManager from "./pages/tasks";
import axiosv, { all } from "axios";
import axios from "axios";

const getUserRole = async () => {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			const response = await axios.get('http://localhost:5000/profile', {
				headers: { Authorization: `Bearer ${token}`}
			});
			return response.data.role;
		} catch (error) {
			console.error("Failed to fetch user role", error);
		}
	}
	return null;
};

const PrivateRoute = ({ element, allowerRoles }) => {
	const token = localStorage.getItem('token');
	const [userRole, setUserRole] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchrole = async () => {
			const role = await getUserRole();
			setUserRole(role);
			setLoading(false);
		};
		fetchrole();
	}, []);
	if (loading) {
		return <div>Chargement...</div>;
	}

	if (!token || !allowerRoles.includes(userRole)) {
		return <Navigate to="/login" />;
	}
	return element;
};

function App() {
	const [isLoggedIn, setIsloggedIn] = useState(false);

	const handleLogin = () => {
		setIsloggedIn(true);
		return <Navigate to="/" />
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsloggedIn(false);
		return <Navigate to="/login" />;
	};
	
	return (
		<Router>
				<Routes>
				<Route path="/login" element={<Login onLogin={handleLogin}/>} />
					<Route path="/" element={<PrivateRoute element={<Dashboard />} allowerRoles={['superuser', 'collaborateur']}/>} />
					<Route path="/profile" element={<PrivateRoute element={<Profile />} allowerRoles={['superuser', 'collaborateur']}/>} />
					<Route path="/users" element={<PrivateRoute element={<UsersList />} allowerRoles={['superuser', 'collaborateur']}/>} />
					<Route path="/upload" element={<PrivateRoute element={<UploadDoc />} allowerRoles={['superuser', 'collaborateur']}/>} />
					<Route path="/tasks" element={<PrivateRoute element={<TaskManager />} allowerRoles={['superuser', 'collaborateur']}/>} />
				</Routes>
		</Router >
	);
}

export default App;

