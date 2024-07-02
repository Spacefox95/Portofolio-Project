// Header pour les différentes pages de l'Intranet :
// Ce header comprend 2 boutons :
// un logo d'hélicoptère qui renvoie vers le Dashboard
// un logo de déconnexion

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPowerOff, FaHelicopter } from 'react-icons/fa';
import '../style/header.css';

const Header = () => {
    const navigate = useNavigate();

    if (!localStorage.getItem('token')) {
        navigate('/login');
    }

    // Retourne vers le Dashboard
    const backToDashboard = () => {
        navigate('/');
    }

    // Retourne vers la page de connexion
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
