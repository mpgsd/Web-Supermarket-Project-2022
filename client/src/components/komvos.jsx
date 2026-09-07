import React, { Component } from 'react';
import Sidebar from './sidebar/sidebar';
import Map from './map';
import SubmitAnOffer from './Submit_an_offer';
import LoginRegister from '../components/login/Signup';
import Account from './account';
import History from './history';
import Evaluation from './EvaluationOfOffer';
class Komvos extends Component {
	state = {
		chosen: 'Map',
	};

	handleButton = (name) => {
		this.setState({ chosen: name, shopID: 0 });
		if (name === 'Logout') {
			this.props.onLogout('login');
		}
	};

	render() {
		return (
			<div key='as'>
				<Sidebar onButton={this.handleButton} />
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
				{/* {this.state.chosen === 'Home' && (
					<SubmitAnOffer userID={this.props.state.userID} />
				)}
				{this.state.chosen === 'Tokens' && (
					<SubmitAnOffer userID={this.props.state.userID} />
				)} */}
				{this.state.chosen === 'change password/username' && (
					<Account userID={this.props.state.userID} />
				)}
				{this.state.chosen === 'history' && (
					<History userID={this.props.state.userID} />
				)}
				{/* {this.state.chosen === 'Accounts' && (
					<Map userID={this.props.state.userID} />
				)} */}
				{this.state.chosen === 'Logout' && <LoginRegister />}
			</div>
		);
	}
}

export default Komvos;
