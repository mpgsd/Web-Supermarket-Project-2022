import React, { useState } from 'react';
import 'react-router-dom';
import './Signup.css';
import ReactLogo from './bg.svg';

function LoginRegister(props) {
	//render() {
	const [state, setState] = useState('login');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	var regExpPassword =
		/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&*])(?=.{8,})/;

	function handleButton(name) {
		setState(name);
		// console.log(state)
	}

	function handleLogin(user, pass) {
		var data = {
			username: user,
			password: pass,
		};

		// Send data to the backend via POST
		fetch('http://localhost:8000/login', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		})
			.then((response) => response.json())
			.then((json) => {
				if (typeof json.admin !== 'undefined') {
					if (json.admin === 0) {
						props.onLogin('user', json.userID);
					} else if (json.admin === 1) {
						props.onLogin('admin', json.userID);
					}
				}
			});
	}

	function handleRegister(user, email, pass) {
		var data = {
			username: user,
			password: pass,
			email: email,
		};
		setEmail('');
		setPassword('');
		setUsername('');
		// Send data to the backend via POST
		console.log(data);
		if (regExpPassword.test(pass)) {
			fetch('http://localhost:8000/register', {
				// Enter your IP address here
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data), // body data type must match "Content-Type" header
			}).then(() => setState('login'));
		}
	}
	return (
		<div>
			<title>Signup</title>
			<link
				rel='stylesheet'
				href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,0'
			/>
			<link
				rel='stylesheet'
				href='styles.css'
			/>
			<img
				src={ReactLogo}
				alt='clouds'
			/>
			{state === 'register' && (
				<div className='signup'>
					<h2>Sign Up</h2>
					<h3>It's quick &amp; simple</h3>
					<div className='form'>
						<div className='textbox'>
							<input
								type='text'
								required
								placeholder='Username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<span className='material-symbols-outlined'>
								{' '}
								account_circle{' '}
							</span>
						</div>
						<div className='textbox'>
							<input
								type='text'
								required
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<span className='material-symbols-outlined'> email </span>
						</div>

						<div className='textbox'>
							<input
								type='password'
								required
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<span className='material-symbols-outlined'> key </span>
						</div>

						<button
							onClick={() => {
								handleRegister(username, email, password);
							}}
							type='submit'>
							Submit
							<span className='material-symbols-outlined'> arrow_forward </span>
						</button>

						<p>
							Signed up already?
							<button
								onClick={() => {
									handleButton('login');
								}}
								type='button'
								className='ch-login-btn'>
								{' '}
								Login{' '}
							</button>
						</p>
					</div>
				</div>
			)}

			{state === 'login' && (
				<div className='login'>
					<h2>Login</h2>
					<div className='form'>
						<div className='textbox'>
							<input
								type='text'
								required
								placeholder='Username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<span className='material-symbols-outlined'></span>
						</div>

						<div className='textbox'>
							<input
								type='password'
								required
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<span className='material-symbols-outlined'> key </span>
						</div>

						<button
							onClick={() => {
								handleLogin(username, password);
							}}
							type='submit'>
							Submit
							<span className='material-symbols-outlined'> arrow_forward </span>
						</button>

						<p>
							Not a Member?
							<button
								onClick={() => {
									handleButton('register');
								}}
								type='button'
								className='ch-login-btn'>
								{' '}
								Sign up{' '}
							</button>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default LoginRegister;
