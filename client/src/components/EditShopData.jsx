import React from 'react';
import { useState } from 'react';

function EditShopData() {
	const [file, setFile] = useState();

	function handleFile(event) {
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function (event) {
			console.log(event.target.result);
			setFile(event.target.result);
		};

		reader.readAsText(file);
	}

	function handleUpload() {
		console.log(file);
		const response = fetch('http://localhost:8000/uploadshop', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ file: file }), // body data type must match "Content-Type" header
		});
		return response;
	}
	function handleDelete() {
		console.log(file);
		const response = fetch('http://localhost:8000/dshop', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ file: file }), // body data type must match "Content-Type" header
		});
		return response;
	}
	const [file1, setFile1] = useState();

	function handleFile1(event) {
		var file1 = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function (event) {
			console.log(event.target.result);
			setFile1(event.target.result);
		};

		reader.readAsText(file1);
	}

	function handleUpload1() {
		console.log(file1);
		const response = fetch('http://localhost:8000/uploadproduct', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ file: file1 }), // body data type must match "Content-Type" header
		});
		return response;
	}
	function handleDelete1() {
		console.log(file1);
		const response = fetch('http://localhost:8000/dproduct', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ file: file1 }), // body data type must match "Content-Type" header
		});
		return response;
	}
	return (
		<div style={{ margin: '25% ', width: '80%' }}>
			<div>
				<h2>Upload your file to Edit Shops</h2>

				<input
					type='file'
					name='file'
					onChange={handleFile}
				/>
				<button onClick={handleUpload}>Insert</button>
				<button onClick={handleDelete}>Delete</button>
			</div>
			<div>
				<h2>Upload your file to Edit Products</h2>

				<input
					type='file'
					name='file'
					onChange={handleFile1}
				/>
				<button onClick={handleUpload1}>Insert</button>
				<button onClick={handleDelete1}>Delete</button>
			</div>
		</div>
	);
}
export default EditShopData;
