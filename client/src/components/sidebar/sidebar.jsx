import * as React from 'react';
import 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import accounts from './assets/icon-accounts.svg';
import lock from './assets/icon-lock.svg';
import MapIcon from './assets/icon-map.svg';
import upload from './assets/icon-upload.svg';

function Sidebar(props) {
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
							onClick={() => props.onButton('Submit_An_Offer')}>
							<img
								src={upload}
								alt=''
							/>
							<span>Submit an offer</span>
						</button>

						<PopupState
							variant='popover'
							popupId='demo-popup-menu'>
							{(popupState) => (
								<React.Fragment>
									<button
										type='button'
										variant='contained'
										{...bindTrigger(popupState)}>
										<img
											src={accounts}
											alt='icon-accounts'
										/>
										<span>Account</span>
									</button>
									<Menu {...bindMenu(popupState)}>
										<MenuItem
											onClick={() =>
												props.onButton('change password/username')
											}>
											Change Password or Username
										</MenuItem>
										<MenuItem onClick={() => props.onButton('history')}>
											User History
										</MenuItem>
									</Menu>
								</React.Fragment>
							)}
						</PopupState>

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

export default Sidebar;
