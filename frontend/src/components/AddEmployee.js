import React, { useState } from 'react';
import axios from 'axios';

function AddEmployee({ onAdd, onCancel }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [role, setRole] = useState('superuser');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/users', {
        firstname, lastname, role, email, password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFirstName('');
      setLastName('');
      setRole('superuser');
      setEmail('');
      setPassword('');
      onAdd();
    } catch (error) {
      setError('Il y a eu une erreur lors de l\'ajout d\'un utilisateur');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <h2>Ajouter un employé</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="userFirstname">Prénom</label>
        <input
          type='text'
          value={firstname}
          onChange={e => setFirstName(e.target.value)}
          placeholder='Prénom'
          required
        />
      </div>
      <div>
        <label htmlFor="userLastname">Nom</label>
        <input
          type='text'
          value={lastname}
          onChange={e => setLastName(e.target.value)}
          placeholder='Nom'
          required
        />
      </div>
      <div>
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
      </div>
      <div>
        <label htmlFor="userEmail">E-mail</label>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='E-mail'
          required
        />
      </div>
      <div>
        <label htmlFor="userPassword">Mot de passe</label>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Mot de passe'
          required
        />
      </div>
      <button type='submit' className='btn'>Ajouter un utilisateur</button>
      <button type='button' onClick={onCancel} className='btn'>Annuler</button>
    </form>
  );
}

export default AddEmployee;