import React, { useState, useEffect } from 'react';
import Index from '../components/Index';
import UpcomingEvents from '../components/UpcomingEvents';
import UploadDocuments from '../components/UploadDocuments';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import '../style/dashboard.css';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const [message, setMessage] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchFiles();
        fetchTasks();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/upload');
            setFileList(response.data);
        } catch (err) {
            console.error('Error fetching files', err);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Les documents ont bien été enregistrés');
            setUploadedFileId(response.data.file_id);
            fetchFiles(); // Refresh the file list after upload
        } catch (err) {
            console.error('Error uploading file', err);
            setMessage('Une erreur lors de l\'enregistrement des documents est survenue');
        }
    };

    const deleteDoc = async (fileId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/upload/${fileId}`);
            if (response.status === 200) {
                setFileList(fileList.filter(file => file._id !== fileId));
                console.log('Le fichier a bien été supprimé');
            } else {
                console.error('Echec de la suppression du fichier');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier', error);
        }
    };

    const downloadDoc = async (fileId, filename) => {
        try {
            const response = await axios.get(`http://localhost:5000/upload/${fileId}`, {
                responseType: 'blob' // Ensure response is treated as a blob
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches', error);
        }
    };

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

    const handleEditTask = (task) => {
        setTitle(task.title);
        setStartDate(task.start_date);
        setEndDate(task.end_date);
        setDescription(task.description);
        setIsEditing(true);
        setCurrentTaskId(task.id);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTitle('');
        setStartDate('');
        setEndDate('');
        setDescription('');
    };

    return (
        <div className="dashboard-container">
            <Index />
            <div className="content-container">
                <div className="main-content-container">
                    <div className="task-content">
                        <h1>Tâches en cours</h1>
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
                        {isEditing && (
                            <div className="task-form">
                                <h2>Modifier la tâche</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleAddOrEditTask(); }}>
                                    <input
                                        type="text"
                                        placeholder="Titre"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="date"
                                        placeholder="Date de commencement"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="date"
                                        placeholder="Date de fin"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                    <button type="submit" className="btn">Modifier la tâche</button>
                                    <button type="button" onClick={handleCancelEdit} className="btn">Annuler</button>
                                </form>
                            </div>
                        )}
                    </div>
                    <div className="discord-events-container">
                        <div className="discord-container">
                            <iframe src="https://discord.com/widget?id=695650077657661451&theme=dark" 
                            allowtransparency="true" 
                            frameBorder="0" 
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
                            </iframe>
                        </div>
                        <div className="events-container">
                            <UpcomingEvents />
                        </div>
                    </div>
                    <div className="documents-container">
                        <h1>Importer un document</h1>
                        <form onSubmit={handleSubmit}>
                            <input style = {{ color: 'black' }} type="file" accept="application/pdf" onChange={handleFileChange} required />
                            <button type="submit">Enregistrer</button>
                        </form>
                        {uploadedFileId && (
                            <p>
                                <a href={`http://localhost:5000/upload/${uploadedFileId}`} target="_blank" rel="noopener noreferrer">Voir le document uploadé</a>
                                <button type="button" onClick={() => deleteDoc(uploadedFileId)} className='btn'>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                                </button>
                                <button type="button" onClick={() => downloadDoc(uploadedFileId, 'document.pdf')} className='btn'>
                                    <FontAwesomeIcon icon={faDownload} /> Télécharger
                                </button>
                            </p>
                        )}
                        {message && <p>{message}</p>}
                        <h2>Liste des fichiers</h2>
                        <ul>
                            {fileList.map(file => (
                                <li key={file._id}>
                                    <a href={`http://localhost:5000/upload/${file._id}`} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                                    <button type="button" onClick={() => deleteDoc(file._id)} className='btn'>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                                    </button>
                                    <button type="button" onClick={() => downloadDoc(file._id, file.filename)} className='btn'>
                                        <FontAwesomeIcon icon={faDownload} /> Télécharger
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
