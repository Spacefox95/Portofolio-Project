// tasks.jsx
// Cette page affiche les tâches à réaliser par les utilisateurs de l'intranet
// Les tâches sont enregistrées dans une database SQLite

import React, { useState, useEffect } from 'react';
import Index from "../components/Index";
import '../style/tasks.css';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    // Récupère les tâches
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches', error);
      }
    };
    fetchTasks();
  }, []);

  // Modifie la tâche associée
  const handleAddOrEditTask = async () => {
    if (title && startDate && endDate && description) {
      const taskData = {
        title,
        start_date: startDate,
        end_date: endDate,
        description
      };

      try {
        if (isEditing) {
          await axios.put(`http://localhost:5000/tasks/${currentTaskId}`, taskData);
          setTasks(tasks.map(task => task.id === currentTaskId ? { ...task, ...taskData } : task));
          setIsEditing(false);
          setCurrentTaskId(null);
        } else {
          const response = await axios.post('http://localhost:5000/tasks', taskData);
          setTasks([...tasks, { ...taskData, id: response.data.id }]);
        }
        setTitle('');
        setStartDate('');
        setEndDate('');
        setDescription('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche', error);
      }
    } else {
      alert('Veuillez renseigner les informations');
    }
  };

  // Enregistre les modifications
  const handleEditTask = (task) => {
    setTitle(task.title);
    setStartDate(task.start_date);
    setEndDate(task.end_date);
    setDescription(task.description);
    setIsEditing(true);
    setCurrentTaskId(task.id);
  };

  // Supprime la tâche
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  return (
    <div>
      <div className="task-page">
        <Index />
        <div className="main-content">
          <h1>Tâches</h1>
          <div className="task-manager">
            <div className="task-form">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nom de la tâche"
                required
              />

              <label htmlFor="startDate">Date de commencement</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />

              <label htmlFor="endDate">Date de fin</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description de la tâche"
                required
              />

              <button onClick={handleAddOrEditTask} className="btn">
                {isEditing ? 'Modifier la tâche' : 'Ajouter une tâche'}
              </button>
            </div>

            <h2>Tâches en cours :</h2>
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className="task-item">
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Date de commencement: {task.start_date}</p>
                    <p>Date de fin: {task.end_date}</p>
                  </div>
                  <button onClick={() => handleEditTask(task)} className="btn">Modifier la tâche</button>
                  <button onClick={() => handleDeleteTask(task.id)} className="btn">Supprimer la tâche</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
