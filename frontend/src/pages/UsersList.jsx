// UsersList.jsx
// Cette page affiche la liste des utilisateurs
// Elle comprend également des boutons pour modifier, ajouter ou supprimer des utilisateurs
// Cette page intéragit différement en fonction du rôle de l'utilisateur

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UpdateEmployee from '../components/UpdateEmployee';
import AddEmployee from '../components/AddEmployee';
import Index from '../components/Index';
import '../style/Userslist.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const addFormRef = useRef(null);
  const updateFormRef = useRef(null);

  // Récupère le rôle de l'utilisateur
  const fetchUserRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Pas de token trouvé, redirection vers l\'authentification...');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  // Récupère la liste des utilisateurs
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Pas de token trouvé, redirection vers l\'authentification...');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Il y a une erreur avec les utilisateurs !', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, []);

  // Supprimer l'utilisateur associé à l'id
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.message);
      handleAuthError(error);
    }
  };

  // Met à jour les informations de l'utilisateur
  const handleUpdate = () => {
    fetchUsers();
    setSelectedUser(null);
  };

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate('/login');
    }
  };

  // Permet la modification des données d'un utilisateur
  // Ajout d'un scroll vers le formulaire mais ne fonctionne pas pour l'instant
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setTimeout(() => {
      if (updateFormRef.current) {
        updateFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  // Formulaire pour ajouter un utilisateur
  // Ajout d'un scroll vers le formulaire quand il s'affiche
  const handleAddUserClick = () => {
    setShowAddForm(true);
    setTimeout(() => {
      if (addFormRef.current) {
        addFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  return (
    <div>
      <div className="container">
        <Index />
        <div className="main-content">
          <h1>Répertoire des utilisateurs</h1>
          <div className="user-list-container">
            <ul className='user-list'>
              {users.map(emp => (
                <li key={emp.id} className="user-item">
                  <div>
                    <div>{emp.firstname} {emp.lastname} - {emp.role}</div>
                    <div>{emp.email}</div>
                    {userRole === 'superuser' && (
                      <div>
                        <button onClick={() => handleEditUser(emp)} className='btn'>Modifier</button>
                        <button onClick={() => handleDelete(emp.id)} className='btn'>Supprimer cet utilisateur</button>
                      </div>
                    )}
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
            {selectedUser && (
              <UpdateEmployee
                key={selectedUser.id}
                user={selectedUser}
                onUpdate={handleUpdate}
                ref={updateFormRef}
              />
            )}
            {userRole === 'superuser' && (
              <div className="add-user-container" ref={addFormRef} >
                {showAddForm ? (
                  <AddEmployee
                    onAdd={() => {
                      fetchUsers();
                      setShowAddForm(false);
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                ) : (
                  <button onClick={handleAddUserClick} className='btn'>Ajouter un utilisateur</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
