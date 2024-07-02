// UploadDocuments.js
// Sauvegarde des documents PDF dans une database Mongod

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from '../style/UploadDoc.module.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faDownload } from "@fortawesome/free-solid-svg-icons";

const UploadDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/upload');
      setFileList(response.data);
    } catch (err) {
      console.error('Error fetching files', err)
    }
  };

  // Sélectionne le fichier dans la database
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Variable d'attente d'intégration de documents
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

  // Supprime le fichier sélectionné de la database
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
      console.error('Erreur lors de la suppression du fichier', error)
    }
  };

  // Enregistre un dossier dans la database
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

  return (
        <div className={styles.container}>
          <h1 style={{"color":"white"}}>Importer un document</h1>
          <form onSubmit={handleSubmit}>
            <input style={{"color":"white"}} type="file" accept="application/pdf" onChange={handleFileChange} required />
            <button type="submit">Enregistrer</button>
          </form>
          {uploadedFileId && (
            <p>
              <a style={{"color":"white"}} href={`http://localhost:5000/upload/${uploadedFileId}`} target="_blank" rel="noopener noreferrer">Voir le document uploadé</a>
              <button type="button" onClick={() => deleteDoc(uploadedFileId)} className='btn'>
                <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
              </button>
              <button type="button" onClick={() => downloadDoc(uploadedFileId, 'document.pdf')} className='btn'>
                <FontAwesomeIcon icon={faDownload} /> Télécharger
              </button>
            </p>
          )}
          {message && <p style={{"color":"white"}}>{message}</p>}
          <h2 style={{"color":"white"}}>Liste des fichiers</h2>
          <ul>
            {fileList.map(file => (
              <li style={{"color":"white"}} key={file._id}>
                <a style={{"color":"white"}} href={`http://localhost:5000/upload/${file._id}`} target="_blank" rel="noopener noreferrer">{file.filename}</a>
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
  );
};

export default UploadDocuments;
