import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateEmployee from '../components/UpdateEmployee';
import AddEmployee from '../components/AddEmployee';
import Header from '../components/Header';
import Index from '../components/Index';
import { useNavigate } from 'react-router-dom';
import '../style/Userslist.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Pas de token trouvé, redirection vers l\'authentification...');
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5000/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Il y a une erreur avec les utilisateurs !', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log(response.data.message);
        fetchUsers();
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      });
  };

  const handleUpdate = () => {
    fetchUsers();
    setSelectedUser(null);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <Index />
        <div className="main-content">
          <h1>Répertoire des utilisateurs</h1>
          <div className="user-list-container">
            <ul className='user-list'>
              {users.map(emp => (
                <li key={emp.id} className="user-item">
                  <div>
                    {selectedUser && selectedUser.id === emp.id ? (
                      <UpdateEmployee user={selectedUser} onUpdate={handleUpdate} />
                    ) : (
                      <>
                        <div>{emp.firstname} {emp.lastname} - {emp.role}</div>
                        <div>{emp.email}</div>
                        <div>
                          <button onClick={() => setSelectedUser(emp)} className='btn'>Modifier</button>
                          <button onClick={() => handleDelete(emp.id)} className='btn'>Supprimer cet utilisateur</button>
                        </div>
                      </>
                    )}
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
            <div className="add-user-container">
              {showAddForm ? (
                <AddEmployee
                  onAdd={() => {
                    fetchUsers();
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : (
                <button onClick={() => setShowAddForm(true)} className='btn'>Ajouter un utilisateur</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
