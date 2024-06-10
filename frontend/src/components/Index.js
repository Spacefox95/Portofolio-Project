import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/index.css';
import { FaUsers, FaUser, FaDiscord, FaCalendarAlt, FaFileAlt, FaTasks } from 'react-icons/fa';


const Index = () => {
	const navigate = useNavigate();

	if (!localStorage.getItem('token')) {
		navigate('/login');
	}

	const handleEmployeeList = () => {
		navigate('/users');
	};

	const handleViewProfile = () => {
		navigate('/profile');
	};

	const handleViewMessage = () => {
		window.open('https://discord.gg/3K3qSbtm', '_blank');
	};

	const handleViewCalendar = () => {
		window.open('https://calendar.google.com/calendar/u/0/r');
	};

	const handleViewDocument = () => {
		navigate('/upload');
	};

	const handleViewTask = () => {
		// Add functionality for viewing tasks
	};

	return (
		<div>
			<div className="container">
				<div className="sidebar">
					<div className="sidebar-icon" title='Liste des utilisateurs' onClick={handleEmployeeList}><FaUsers size={30} /></div>
					<div className="sidebar-icon" title='Mon profile' onClick={handleViewProfile}><FaUser size={30} /></div>
					<div className="sidebar-icon" title='Messages' onClick={handleViewMessage}><FaDiscord size={30} /></div>
					<div className="sidebar-icon" title='Calendrier' onClick={handleViewCalendar}><FaCalendarAlt size={30} /></div>
					<div className="sidebar-icon" title='Mes documents' onClick={handleViewDocument}><FaFileAlt size={30} /></div>
					<div className="sidebar-icon" title='Mes tâches' onClick={handleViewTask}><FaTasks size={30} /></div>
				</div>
				<div className="main-content">
                {/* Main content */}
            </div>
			</div>
		</div>
	);
};

export default Index;
