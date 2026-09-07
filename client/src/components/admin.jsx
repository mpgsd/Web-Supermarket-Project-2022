import React, { Component } from 'react';
import Map from './mapAdmin';
import LoginRegister from '../components/login/Signup';
import SidebarAdmin from './sidebar/sidebarAdmin';
import Leaderboard from './Leaderboard';
import EditShopData from './EditShopData';
import Statistics from './Statistics';
import Statistics2 from './Statistics2';
import Evaluation from './EvaluationOfOffer';
import SubmitAnOffer from './Submit_an_offer';
class Admin extends Component {
	state = {
		chosen: 'Map',
	};

	handleButton = (name) => {
		this.setState({ chosen: name });
		if (name === 'Logout') {
			this.props.onLogout('login');
		}
	};

	render() {
		return (
			<div key='as'>
				<SidebarAdmin onButton={this.handleButton} />
				{this.state.chosen === 'Map' && (
					<Map
						handleSubmit={(state, ID) => {
							this.setState({ chosen: state, shopID: ID });
						}}
						userID={this.props.state.userID}
					/>
				)}
				{this.state.chosen === 'Evaluation' && (
					<Evaluation
						userID={this.props.state.userID}
						offers={this.state.shopID}
					/>
				)}
				{this.state.chosen === 'Submit_An_Offer' && (
					<SubmitAnOffer
						userID={this.props.state.userID}
						shopID={this.state.shopID}
					/>
				)}
				{this.state.chosen === 'Logout' && <LoginRegister />}
				{this.state.chosen === 'Edit data' && <EditShopData />}
				{this.state.chosen === 'Leaderboard' && <Leaderboard />}
				{this.state.chosen === 'Statistics' && <Statistics />}
				{this.state.chosen === 'Statistics2' && <Statistics2 />}
			</div>
		);
	}
}

export default Admin;
