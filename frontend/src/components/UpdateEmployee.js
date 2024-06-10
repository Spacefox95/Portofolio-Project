import React, { useState } from "react";
import axios from "axios";

function UpdateEmployee({ user, onUpdate }) {
  const [firstname, setFirstName] = useState(user.firstname);
  const [lastname, setLastName] = useState(user.lastname);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Pas de token trouvé, reloggez vous');
      return;
    }
    axios.put(`http://localhost:5000/users/${user.id}`, {
      firstname,
      lastname,
      role,
      email
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      onUpdate();
      alert('Les informations de l\'utilisateur ont bien été mises à jour');
    })
    .catch(error => {
      setError('Il y a eu une erreur lors de la mise à jour de l\'utilisateur');
      console.error(error);
    });
  };

  return (
    <div>
      <h2>Mettre à jour les informations de l'utilisateur</h2>
      <form onSubmit={handleSubmit} className='form-container'>
      <label for="userFirstname">Prénom</label>
        <input
          type="text"
          value={firstname}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
        />
        <label for="userLastname">Nom</label>
        <input
          type="text"
          value={lastname}
          onChange={e => setLastName(e.target.value)}
          placeholder="Nom"
          required
        />
        <label for="userRole">Rôle</label>
        <input
          type="text"
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="Rôle"
          required
        />
        <label for="userEmail">E-mail</label>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <button type="submit" className="btn">Mettre à jour</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default UpdateEmployee;
