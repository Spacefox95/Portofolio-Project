import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUSer = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:5000/profile', {
					headers: { Authorization: `Bearer ${token}`}
				});
				setUser(response.data);
			} catch (error) {
				console.error('Erreur lors de la récupération des données utilisateur', error);
			}
		};

		fetchUSer();
	}, []);

	return (
		<div>
			<h2>Profil de l'utilisateur</h2>
			{user && (
				<div>
					<p><strong>Nom d'utilisateur:</strong> {user.username}</p>
					<p><strong>Email:</strong> {user.email}</p>
					</div>
			)}
		</div>
	);
};

export default Profile;