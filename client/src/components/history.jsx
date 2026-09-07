import React, { useEffect, useState } from 'react';
import JSONViewer from 'react-json-viewer';

import './main.css';
import like from '../components/sidebar/assets/like.png';
import dislike from '../components/sidebar/assets/dislike.png';

function History(props) {
	const [Likes, setLikes] = useState('');
	const [Dislikes, setDislikes] = useState('');
	const [UserData, setUserData] = useState('');
	const [Offers, setOffers] = useState('');

	const getLikes = async () => {
		const response = await fetch(
			'http://localhost:8000/getLikes?id=' + props.userID,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)
			.then((response) => response.json())
			.then((json) => {
				like = [];
				dislike = [];
				for (let i = 0; i < json.length; i++) {
					json[i].date = new Date(json[i].date).toLocaleDateString();
					if (json[i].dislike === 0) {
						dislike.push(json[i]);
						json[i].Shop = JSON.parse(json[i].tag).name;
						delete json[i].dislike;
						delete json[i].tag;
					} else {
						like.push(json[i]);
						json[i].Shop = JSON.parse(json[i].tag).name;
						delete json[i].dislike;
						delete json[i].tag;
					}
				}
				setLikes(like);
				setDislikes(dislike);
			});
		return response;
	};

	useEffect(() => {
		getLikes();
	}, []);
	const getUserData = async () => {
		const response = await fetch(
			'http://localhost:8000/getUserData?id=' + props.userID,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)
			.then((response) => response.json())
			.then((json) => {
				setUserData(json[0]);
			});
		return response;
	};

	useEffect(() => {
		getUserData();
	}, []);

	const getOffers = async () => {
		const response = await fetch(
			'http://localhost:8000/getoffers?id=' + props.userID,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)
			.then((response) => response.json())
			.then((json) => {
				setOffers(json);
				for (let i = 0; i < json.length; i++) {
					json[i].Shop = JSON.parse(json[i].tag).name;
					delete json[i].tag;
				}
			});
		return response;
	};

	useEffect(() => {
		getOffers();
	}, []);

	return (
		<div className='History'>
			<h2>You have {Offers.length} offers.</h2>
			<h5>{Offers.length > 0 && <JSONViewer json={Offers} />}</h5>
			<h2>
				You have {Likes.length} likes.
				{/* <img
					src={like}
					alt='like'
				/> */}
			</h2>
			<h5>{Likes.length > 0 && <JSONViewer json={Likes} />}</h5>
			<h2>
				You have {Dislikes.length} dislikes.
				{/* <img
					src={dislike}
					alt='dislike'
				/> */}
			</h2>
			<h5>{Dislikes.length > 0 && <JSONViewer json={Dislikes} />}</h5>
			<h2>Score:{UserData.score} </h2>
			<h2>Score of the month:{UserData.monthscore} </h2>
			<h2>Tokens of the previous month:{UserData.token} </h2>
			<h2>Total Tokens:{UserData.totaltoken} </h2>
		</div>
	);
}
export default History;
