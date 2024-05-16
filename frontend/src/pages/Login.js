import React, { useState } from "react";
import axios from "axios";
import {  useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:5000/login', { email, password });
			localStorage.setItem('token', response.data.access_token);
			onLogin();
			navigate('/');
		} catch (err) {
			setError('Accréditation non valide');
		}
};

return (
	<div>
		<header><h1>Cartotrac</h1>
		</header>
		<div className="container">
			<div className="form-container">
		<h1>Login</h1>
		{error && <p style={{ color: 'red'}}>{error}</p>}
		<form onSubmit={handleSubmit}>
			<div style={{ width: '100%'  }}>
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			</div>
			<div style={{ width: '100%'  }}>
				<label>Mot de passe</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			</div>
			<button type="submit">Login</button>
		</form>
		</div>
		</div>
		<footer>
			<p>Mentions légales</p>
		</footer>
	</div>
	);
};

export default Login;