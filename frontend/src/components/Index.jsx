// Index.jsx
// Page type de l'intranet. Cette page comprend :
// - une barre de navigation vers :
//      - la liste des utilisateurs
//      - le profil de l'utilisateur
//      - un lien vers la messagerie discord
//      - un lien vers le calendrier
//      - les documents sauvegardés
//      - les tâches en cours
// - la mise en page type de chaque page via le CSS

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaUsers, FaUser, FaDiscord, FaCalendarAlt, FaFileAlt, FaTasks } from 'react-icons/fa';
import '../style/index.css';

const Index = ({ children }) => {
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
        window.open('https://discord.gg/fuaTgPyt', '_blank');
    };

    const handleViewCalendar = () => {
        window.open('https://calendar.google.com/calendar/u/0/r');
    };

    const handleViewDocument = () => {
        navigate('/upload');
    };

    const handleViewTask = () => {
        navigate('/tasks');
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="sidebar">
                    <div className="sidebar-icon" title="Liste des utilisateurs" onClick={handleEmployeeList}><h5>Liste des utilisateurs</h5><FaUsers size={30} /></div>
                    <div className="sidebar-icon" title="Mon profil" onClick={handleViewProfile}><h5>Mon profil</h5><FaUser size={30} /></div>
                    <div className="sidebar-icon" title="Messages" onClick={handleViewMessage}><h5>Messages</h5><FaDiscord size={30} /></div>
                    <div className="sidebar-icon" title="Calendrier" onClick={handleViewCalendar}><h5>Calendrier</h5><FaCalendarAlt size={30} /></div>
                    <div className="sidebar-icon" title="Mes documents" onClick={handleViewDocument}><h5>Mes documents</h5><FaFileAlt size={30} /></div>
                    <div className="sidebar-icon" title="Mes tâches" onClick={handleViewTask}><h5>Mes tâches</h5><FaTasks size={30} /></div>
                </div>
                <div className="main-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Index;
