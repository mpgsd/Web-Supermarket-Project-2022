import React, { useState, useEffect } from 'react';
import './main.css';
import Select from 'react-select';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Circle,
	useMapEvents,
	useMap,
} from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import icons from './red.png';
import blue from './blue.png';

function LocationMarker() {
	const [position, setPosition] = useState(null);
	const map = useMapEvents({
		click() {
			map.locate();
		},
		locationfound(e) {
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});
	// const redIcon = L.icon({
	// 	iconUrl: icons,
	// 	iconSize: [36, 41],
	// 	iconAnchor: [12, 41],
	// 	popupAnchor: [1, -34],
	// 	shadowSize: [41, 41],
	// 	shadowAnchor: [12, 41],
	// });

	const blueIcon = L.icon({
		iconUrl: blue,
		iconSize: [36, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		shadowAnchor: [12, 41],
	});

	return position === null ? null : (
		<Marker
			position={position}
			icon={blueIcon}>
			<Circle
				center={position}
				radius={1000}
				color={'red'}
			/>
			<Popup>You are here</Popup>
		</Marker>
	);
}

const Search = (props) => {
	const map = useMap(); // access to leaflet map

	const { provider, searchUrl } = props;

	useEffect(() => {
		const searchControl = new GeoSearchControl({
			provider,
			url: searchUrl,
		});

		map.addControl(searchControl); // this is how you add a control in vanilla leaflet
		return () => map.removeControl(searchControl);
	}, [props]);

	return null; // don't want anything to show up from this comp
};

function Map(props) {
	const [Shops, setShopData] = useState(['']);
	const [CShops, setCShopData] = useState(0);
	const [category, setValueC] = useState('');
	const [Ccat, setCcat] = useState('');
	const [offer, setOffer] = useState({});

	const redIcon = L.icon({
		iconUrl: icons,
		iconSize: [36, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		shadowAnchor: [12, 41],
	});

	const blueIcon = L.icon({
		iconUrl: blue,
		iconSize: [36, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		shadowAnchor: [12, 41],
	});

	const getShops = async () => {
		const response = await fetch('http://localhost:8000/shopoffer', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((json) => {
				setShopData(json);
				setCShopData(json);
			});
		return response;
	};

	useEffect(() => {
		getShops();
	}, []);

	const handleChange = (e) => {
		setCcat(e.category);
	};

	const getcategoryData = async () => {
		const response = await fetch('http://localhost:8000/category', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}).then((response) =>
			response.json().then((json) => {
				let category = [{ category: 'All', label: 'All' }];
				for (let i = 0; i < json.length; i++) {
					let json1 = {
						category: json[i]['category'],
						label: json[i]['category'],
					};
					category.push(json1);
				}
				setValueC(category);
			})
		);
		return response;
	};

	useEffect(() => {
		getcategoryData();
	}, []);

	const handleSubmit = async (data) => {
		console.log(data);
		if (data !== '') {
			let cat;
			if (data === 'All') {
				setCShopData(Shops);
			} else {
				if (data === 'Ποτά - Αναψυκτικά') {
					cat = 1;
				} else if (data === 'Τρόφιμα') {
					cat = 2;
				} else if (data === 'Για κατοικίδια') {
					cat = 3;
				} else if (data === 'Προσωπική φροντίδα') {
					cat = 4;
				}
				console.log('fetch');
				const response = await fetch(
					'http://localhost:8000/shopoffer/cat?id=' + cat,
					{
						// Enter your IP address here
						method: 'GET',
						headers: { 'Content-Type': 'application/json' },
					}
				)
					.then((response) => {
						response.json();
					})
					.then((json) => {
						if (typeof json !== 'undefined') {
							setCShopData(json);
							console.log(json);
						} else {
							setCShopData(0);
						}
					});
				return response;
			}
		}
	};

	const handlePin = async (Shops) => {
		let offers = {};
		if (typeof Shops !== 'undefined') {
			await Promise.all(
				Shops.map(async (shop) => {
					const response = await fetch(
						'http://localhost:8000/shopoffer/pin?id=' + shop.shopID,
						{
							method: 'GET',
							headers: { 'Content-Type': 'application/json' },
						}
					);
					const json = await response.json();
					var off = [];
					for (let i = 0; i < json.length; i++) {
						const data = {
							ID: json[i].offerID,
							Product: json[i].name,
							Price: json[i].price,
							Date: new Date(json[i].date).toLocaleDateString(),
							Likes: json[i].likes,
							Dislikes: json[i].dislikes,
							Exists: json[i].exist,
							ProductID: json[i].productID,
						};
						off.push(data);
					}
					offers[shop.shopID] = off;
				})
			);
			setOffer(offers);
		}
	};

	useEffect(() => {
		handlePin(Shops);
	}, [Shops]);

	const position = [38.251585, 21.737741];
	const circleOptions = { color: 'red', fillColor: '#f03', fillOpacity: 0.5 };
	const circleCenter = [38.251585, 21.737741];
	const circleRadius = 1000; // in meters

	return (
		<div>
			<div>
				<MapContainer
					center={[38.251585, 21.737741]}
					zoom={13}
					scrollWheelZoom={false}
					bounds={[
						[-90, -180],
						[90, 180],
					]}
					style={{
						height: 600,
						width: '86.4%',
						padding: '50px',
						margin: 'auto',
						position: 'relative',
						left: '6.85%',
						
					}}>
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
					/>
					{/*<Circle
						center={circleCenter}
						radius={circleRadius}
						pathOptions={circleOptions}
				/>*/}
					{CShops !== 0 &&
						CShops.map((shop) => {
							let cIcon;
							if (shop.color === 1) {
								cIcon = blueIcon;
							} else {
								cIcon = redIcon;
							}
							return (
								<Marker
									key={shop.shopID}
									position={[shop.lat, shop.lon]}
									icon={cIcon}>
									<Popup>
										<div>
											<h2>{JSON.parse(shop.tag).name}</h2>
											<table>
												<tr>
													<th>Product</th>
													<th>Price</th>
													<th>Date</th>
													<th>Likes</th>
													<th>Dislikes</th>
													<th>Exists</th>
													<th></th>
												</tr>
												{offer !== {} &&
													typeof offer[shop.shopID] !== 'undefined' &&
													offer[shop.shopID].map((offer) => {
														return (
															<tr>
																<th>{offer.Product}</th>
																<th>{offer.Price}</th>
																<th>{offer.Date}</th>
																<th>{offer.Likes}</th>
																<th>{offer.Dislikes}</th>
																<th>
																	{offer.Exists === 0 && 'Out of stock'}
																	{offer.Exists === 1 && 'In stock'}
																</th>
																<th>
																	<button
																		style={{
																			boxSizing: 'border-box',
																			width: '100%',
																			padding: '10px 20px',
																			border: 'none',
																			borderRadius: '5px',
																			background: '#5B6DCD',
																			color: '#FFFFFF',
																			fontWeight: 'bold',
																			fontSize: '16px',
																			cursor: 'pointer',
																			boxShadow:
																				'0px 2px 4px rgba(0, 0, 0, 0.25)',
																			transition: 'background 0.3s ease',
																		}}
																		onClick={() => {
																			props.handleDelete(
																				'Delete_an_offer',
																				shop.offerID
																			);
																		}}>
																		<b>Delete Offer</b>
																	</button>
																</th>
															</tr>
														);
													})}
											</table>
										</div>
										<div>
											<button
												style={{
													boxSizing: 'border-box',
													width: '50%',
													padding: '5px',
													border: 'solid #5B6DCD 3px',
												}}
												onClick={() => {
													props.handleSubmit('Submit_An_Offer', shop.shopID);
												}}>
												<b>New Offer</b>
											</button>
											<button
												style={{
													boxSizing: 'border-box',
													width: '50%',
													padding: '5px',
													border: 'solid #d93a1e 3px',
												}}
												onClick={() => {
													props.handleSubmit('Evaluation', offer[shop.shopID]);
												}}>
												<b> Evaluation</b>
											</button>
										</div>
									</Popup>
								</Marker>
							);
						})}
					,[]
					<LocationMarker />
					<Search
						provider={new OpenStreetMapProvider()}
						searchUrl='path/to/your/json/file.json'
					/>
				</MapContainer>
			</div>
			<div
				span
				className='anazitiseis'>
				<h2> Select a Category</h2>
				<Select
					options={category}
					defaultValue={category}
					placeholder='Select a Category '
					isSearchable
					noOptionsMessage={() => 'No Category found'}
					onChange={(e) => handleChange(e)}
				/>
				<button
					onClick={() => handleSubmit(Ccat)}
					type='submit'>
					Submit
				</button>
			</div>
		</div>
	);
}

export default Map;
