import React, { useState} from "react";
import axios from "axios";
import styles from '../style/UploadDoc.module.css'

const UploadDoc = () => {
	const [selectedFile, setSelectFile] = useState(null);
	const [message, setMessage] = useState('');

	const handleFileChange = (event) => {
		setSelectFile(event.target.files[0]);
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
		} catch (err) {
			console.error(err);
			setMessage('Une erreur lors de l\'enregistrement des documents est survenue');
		}
	};

	return (
		<div className={styles.container}>
			<h1>Importer un document</h1>
			<form onSubmit={handleSubmit}>
				<input type="file" accept="application/pdf" onChange={handleFileChange} required />
				<button type="submit">Enregistrer</button>
			</form>
			{message && <p>{message}</p>}
			</div>
	);
};

export default UploadDoc;