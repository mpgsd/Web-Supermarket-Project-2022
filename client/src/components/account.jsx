import React, { useState } from 'react';
import './main.css';

function handleUsername(user, newuser, userID) {
	var data = {
		username: user,
		newusername: newuser,
		userID: userID,
	};
	fetch('http://localhost:8000/changename', {
		// Enter your IP address here
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
}
function handlePassword(pass, newpass, userID) {
	var data = {
		password: pass,
		newpassword: newpass,
		userID: userID,
	};
	fetch('http://localhost:8000/changepassword', {
		// Enter your IP address here
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
}

function Account(props) {
	const [username, setUsername] = useState('');
	const [new_username, setNewUsername] = useState('');
	const [password, setPassword] = useState('');
	const [new_password, setNewPassword] = useState('');

	return (
		<div className='Account'>
			<h2>Change your username</h2>
			<input
				type='text'
				required
				placeholder='Current Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type='text'
				required
				placeholder='New Username'
				value={new_username}
				onChange={(e) => setNewUsername(e.target.value)}
			/>
			<button
				onClick={() => {
					handleUsername(username, new_username, props.userID);
				}}
				type='submit'>
				Submit
			</button>

			<h2>Change your Password</h2>
			<input
				type='password'
				required
				placeholder='Current Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input
				type='password'
				required
				placeholder='New Password'
				value={new_password}
				onChange={(e) => setNewPassword(e.target.value)}
			/>
			<button
				onClick={() => {
					handlePassword(password, new_password, props.userID);
				}}
				type='submit'>
				Submit
			</button>
		</div>
	);
}
export default Account;
