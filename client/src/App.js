import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css';
import Komvos from './components/komvos';
import LoginRegister from './components/login/Signup';
import './components/sidebar/sidebar.css';
import Admin from './components/admin';

class App extends Component {
	state = { state: 'login', userID: 0 };

	render() {
		return (
			<div className='App'>
				{this.state.state === 'login' && (
					<LoginRegister
						onLogin={(stateValue, userValue) => {
							this.setState({ state: stateValue, userID: userValue });
						}}
						state={this.state}
					/>
				)}
				{this.state.state === 'user' && (
					<Komvos
						onLogout={(stateValue) => {
							this.setState({ state: stateValue });
						}}
						state={this.state}
					/>
				)}
				{this.state.state === 'admin' && (
					<Admin
						state={this.state}
						onLogout={(stateValue) => {
							this.setState({ state: stateValue });
						}}
					/>
				)}
			</div>
		);
	}
}

export default App;
