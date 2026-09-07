import React, { useState, useEffect } from 'react';
import JSONViewer from 'react-json-viewer';

const Leaderboard = () => {
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		// Fetch data from your database API
		// Replace this with your own API endpoint
		fetch('http://localhost:8000/userscore?offset=' + offset, {
			// Enter your IP address here
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				setLeaderboardData(data);
				console.log(offset);
			})
			.catch((error) => console.log(error));
	}, [offset]);

	//  {/*<div id="jsonViewer" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><!-- Your JSON viewer content goes here --></div>/*}

	return (
		<div
			id='viewer'
			style={{
				float: 'right',
				height: '100vh',
			}}>
			<JSONViewer json={leaderboardData} />
			<button
				style={{
					boxSizing: 'border-box',
					width: '50%',
					padding: '5px',
					border: 'solid #5B6DCD 3px',
				}}
				onClick={() => {
					if (offset !== 0) {
						setOffset(offset - 10);
					}
				}}>
				<b>Previews</b>
			</button>
			<button
				style={{
					boxSizing: 'border-box',
					width: '50%',
					padding: '5px',
					border: 'solid #5B6DCD 3px',
				}}
				onClick={() => {
					if (leaderboardData.length === 10) {
						setOffset(offset + 10);
					}
				}}>
				<b> Next</b>
			</button>
			{/* <h1>Leaderboard</h1>
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{leaderboardData.map((user) => (
						<tr key={user.userID}>
							{/* <td>{index + 1}</td> */
			/* <td>{user.username}</td>
							<td>{user.score}</td>
						</tr>
					))}
				</tbody>
			</table> */}
		</div>
	);
};

export default Leaderboard;
