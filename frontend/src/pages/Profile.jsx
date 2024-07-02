// Profile.jsx
// PAge pour afficher les information de l'utilisateur
import axios from 'axios';
import React, { useState, useEffect } from "react";
import Index from "../components/Index";
import '../style/footer.css';
import '../style/Profile.css';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/profile');
                setUser(response.data);
                setFirstname(response.data.firstname);
                setLastname(response.data.lastname);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur', error);
            }
        };

        fetchUser();
    }, []);

    // Autorise la modification des informations
    const handleEdit = () => {
        setEditMode(true);
    };

    // Variable pour récupérer les données et les sauvegarder
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/profile', {
                firstname,
                lastname,
                email
            });
            const response = await axios.get('/profile');
            setUser(response.data);
            setEditMode(false);
            setError(null);
        } catch (error) {
            setError('Erreur lors de la mise à jour du profil');
            console.error('Erreur lors de la mise à jour du profil', error);
        }
    };

    // Annule les modifications
    const handleCancel = () => {
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setEmail(user.email);
        setEditMode(false);
        setError(null);
    };

    return (
        <div className="profile-page">
            <Index />
            <div className="profile-container">
                <h1>Profil de l'utilisateur</h1>
                <div className="profile-info">
                    {user ? (
                        <>
                            {!editMode ? (
                                <div>
                                    <p>Prénom : {user.firstname}</p>
                                    <p>Nom : {user.lastname}</p>
                                    <p>Rôle : {user.role}</p>
                                    <p>Email : {user.email}</p>
                                    <button onClick={handleEdit} className='btn'>Modifier</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label>Prénom:</label>
                                        <input
                                            type="text"
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Nom:</label>
                                        <input
                                            type="text"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='btn-group'>
                                        <button type="submit" className='btn'>Enregistrer</button>
                                        <button type="button" onClick={handleCancel} className='btn'>Annuler</button>
                                    </div>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                </form>
                            )}
                        </>
                    ) : (
                        <p>Chargement des informations utilisateur...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
