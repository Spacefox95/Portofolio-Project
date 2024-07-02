// Login.jsx
// Page de connexion
// Cette page contient une identification par adresse mail et le mot de passe associé

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../style/Login.module.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Affiche le formulaire d'enregistrement
    // Si les logs sont valides, redirige vers le dashboard. Sinon, reste sur la page et affiche le message d'erreur
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', 
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            localStorage.setItem('token', response.data.access_token);
            onLogin();
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <h1>Cartotrac</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h1>Connexion</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ width: '100%' }}>
                            <label>E-mail</label><br />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Mot de passe</label><br />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Se connecter</button>
                    </form>
                </div>
            </div>
            <footer className={styles.footer}>
                <p>Mentions légales</p>
            </footer>
        </div>
    );
};

export default Login;
