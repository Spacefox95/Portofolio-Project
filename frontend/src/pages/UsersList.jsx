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

  // Fetch the current user's role
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
      setUserRole(response.data.role); // Assumes the response contains the role of the current user
    } catch (error) {
      console.error('Error fetching user role:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  // Fetch the list of users
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
    fetchUserRole(); // Fetch the role of the current user
    fetchUsers(); // Fetch the list of users
  }, []);

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

  const handleUpdate = () => {
    fetchUsers(); // Fetch the updated user list
    setSelectedUser(null); // Clear selectedUser to close the update form
  };

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate('/login');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setTimeout(() => {
      if (updateFormRef.current) {
        updateFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0); // Ensure the form is visible before scrolling
  };

  const handleAddUserClick = () => {
    setShowAddForm(true);
    setTimeout(() => {
      if (addFormRef.current) {
        addFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0); // Ensure the form is visible before scrolling
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
                key={selectedUser.id} // Add key prop to force re-render on user change
                user={selectedUser}
                onUpdate={handleUpdate}
                ref={updateFormRef} // Ref added here
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
