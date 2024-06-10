import React, { useState, useEffect } from "react";
import axios from "axios";
import Index from "../components/Index";
import Header from "../components/Header";
import '../style/footer.css';
import '../style/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-container">
            <h1>Profil de l'utilisateur</h1>
                <Index />
                <div className="profile-info">
                    {user ? (
                        <div>
                            <p>Prénom : {user.firstname}</p>
                            <p>Nom : {user.lastname}</p>
                            <p>Rôle : {user.role}</p>
                            <p>Email : {user.email}</p>
                        </div>
                    ) : (
                        <p>Chargement des informations utilisateur...</p>
                    )}
                </div>
            </div>
            <footer>
                <p>Mentions légales</p>
            </footer>
        </div>
    );
};

export default Profile;
