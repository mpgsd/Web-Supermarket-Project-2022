import * as React from 'react';
import 'react-router-dom';
import lock from './assets/icon-lock.svg';
import MapIcon from './assets/icon-map.svg';
import admin from './assets/icons8-admin-48.png';

function SidebarAdmin(props) {
	//render() {

	return (
		<div>
			<meta charSet='UTF-8' />
			<meta
				httpEquiv='X-UA-Compatible'
				content='IE=edge'
			/>
			<meta
				name='viewport'
				content='width=device-width, initial-scale=1.0'
			/>
			<title>Sidebar 1</title>
			<link
				rel='preconnect'
				href='https://fonts.googleapis.com'
			/>
			<link
				rel='preconnect'
				href='https://fonts.gstatic.com'
				crossOrigin
			/>
			<link
				href='https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap'
				rel='stylesheet'
			/>
			<link
				rel='stylesheet'
				href='./styles.css'
			/>
			<nav className='sidebar'>
				<div className='sidebar-inner'>
					<nav
						className='sidebar-menu'
						id='nav'>
						<button
							type='button'
							onClick={() => props.onButton('Map')}
							className='has-border'>
							<img
								src={MapIcon}
								alt=''
							/>
							<span>Map</span>
						</button>

						<button
							type='button'
							onClick={() => props.onButton('Edit data')}>
							<img
								src={admin}
								alt=''
							/>
							<span>Edit Data</span>
						</button>
						<button
							type='button'
							onClick={() => props.onButton('Leaderboard')}>
							<img
								src={admin}
								alt=''
							/>
							<span>Leaderboard</span>
						</button>
						<button
							type='button'
							onClick={() => props.onButton('Statistics')}>
							<img
								src={admin}
								alt=''
							/>
							<span>Offers</span>
						</button>
						<button
							type='button'
							onClick={() => props.onButton('Statistics2')}>
							<img
								src={admin}
								alt=''
							/>
							<span>Discount</span>
						</button>

						<button
							type='button'
							onClick={() => props.onButton('Logout')}>
							<img
								src={lock}
								alt=''
							/>
							<span>Log out</span>
						</button>
					</nav>
				</div>
			</nav>
		</div>
	);
}

export default SidebarAdmin;
