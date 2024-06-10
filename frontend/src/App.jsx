import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UsersList from "./pages/UsersList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadDoc from "./pages/UploadDoc";

const PrivateRoute = ({ element }) => {
	const token = localStorage.getItem('token');
	return token ? element : <Navigate to="/login" />;
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
					<Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
					<Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
					<Route path="/users" element={<PrivateRoute element={<UsersList />} />} />
					<Route path="/upload" element={<PrivateRoute element={<UploadDoc />} />} />
				</Routes>
		</Router >
	);
}

export default App;

