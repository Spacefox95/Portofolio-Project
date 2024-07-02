// UpdateEmployee.js
// Modifie les informations d'utilisateur

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function UpdateEmployee({ user, onUpdate }) {
  const [firstname, setFirstName] = useState(user.firstname);
  const [lastname, setLastName] = useState(user.lastname);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState(null);
  const formRef = useRef(null); // Create a ref for the form

  // Reset form fields when user changes
  useEffect(() => {
    setFirstName(user.firstname);
    setLastName(user.lastname);
    setRole(user.role);
    setEmail(user.email);
    setError(null);
  }, [user]);

  // Affiche le formulaire avec les informations associées à l'utilisateur choisi
  // et enregistre les modifications
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Pas de token trouvé, reloggez-vous');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/users/${user.id}`, {
        firstname,
        lastname,
        role,
        email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      alert('Les informations de l\'utilisateur ont bien été mises à jour');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      setError('Il y a eu une erreur lors de la mise à jour de l\'utilisateur');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Mettre à jour les informations de l'utilisateur</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='form-container'>
        <label htmlFor="userFirstname">Prénom</label>
        <input
          type="text"
          value={firstname}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
        />
        <label htmlFor="userLastname">Nom</label>
        <input
          type="text"
          value={lastname}
          onChange={e => setLastName(e.target.value)}
          placeholder="Nom"
          required
        />
        <label htmlFor="userRole">Rôle</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <option value="superuser">Administrateur</option>
          <option value="collaborateur">Collaborateur</option>
          <option value="invite">Invité</option>
        </select>
        <label htmlFor="userEmail">E-mail</label>
        <input
          type="email"
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
