// Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPowerOff, FaHelicopter } from 'react-icons/fa';
import '../style/header.css';

const Header = () => {
    const navigate = useNavigate();

    if (!localStorage.getItem('token')) {
        navigate('/login');
    }

		const backToDashboard = () => {
			navigate('/');
		}

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="drone-icon" onClick={backToDashboard}><FaHelicopter size={30} /></div>
            <h1>Cartotrac</h1>
            <div className="logout-icon" onClick={handleLogout}><FaPowerOff size={30} /></div>
        </header>
    );
};

export default Header;
