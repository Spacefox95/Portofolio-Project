import React, { useState } from "react";
import axios from "axios";
import { useHistory, useNavigate } from 'react-router-dom';

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
			history.push('/');
		} catch (err) {
			setError('Accréditation non valide');
		}
};

return (
	<div>
		<h2>Login</h2>
		<form onSubmit={handleSubmit}>
			<div>
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			</div>
			<div>
				<label>Mot de passe</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			</div>
			<button type="submit">Login</button>
		</form>
		{error && <p>{error}</p>}
	</div>
	);
};

export default Login;