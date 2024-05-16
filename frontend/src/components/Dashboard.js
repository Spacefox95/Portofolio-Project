import React from "react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
	if (!localStorage.getItem('token')) {
		return <Navigate to="/login" />;
	}

	const handleLogout = () => {
		localStorage.removeItem('token');
		return <Navigate to="/login" />;
	};

	const handleEmployeeList = () => {
		return <Navigate to="/employee-list" />
	};

	const handleViewProfile = () => {
		return <Navigate to="/profile" />
	}

	const handleEditProfile = () => {
	};

	const handleViewMessage = () => {
	};

	const handleViewCalendar = () => {
	};

	const handleViewDocument = () => {
	};

	const handleViewTask = () => {
	};

	return (
		<div>
			<h1>Cartotrac Intranet</h1>
			<button onClick={handleLogout}>Déconnexion</button>
			<div>
				<button onClick={handleEmployeeList}>Liste des employés</button>
				<button onClick={handleViewProfile}>Voir le profil</button>
				<button onClick={handleEditProfile}>Modifier le profil</button>
				<button onClick={handleViewMessage}>Voir les messages</button>
				<button onClick={handleViewCalendar}>Voir le calendrier</button>
				<button onClick={handleViewDocument}>Voir les documents</button>
				<button onClick={handleViewTask}>Voir les tâches</button>
			</div>
		</div>
	);
};

export default Dashboard;