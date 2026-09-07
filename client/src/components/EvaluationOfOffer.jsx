import React, { useState } from 'react';
import './main.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import img_1 from './product_img/1.jpeg';
import img_2 from './product_img/2.jpg';
import img_3 from './product_img/3.jpg';
import img_4 from './product_img/4.png';
import img_5 from './product_img/5.jpg';
import img_6 from './product_img/6.jpg';
import img_7 from './product_img/7.jpg';
import img_8 from './product_img/8.jpg';
import img_9 from './product_img/9.jpg';
import img_10 from './product_img/10.jpg';
import img_11 from './product_img/11.jpg';
import img_12 from './product_img/12.jpg';
import img_13 from './product_img/13.jpg';
import img_14 from './product_img/14.jpg';
import img_15 from './product_img/15.jpg';
import img_16 from './product_img/16.png';
import img_17 from './product_img/17.png';
import img_18 from './product_img/18.jpg';
import img_19 from './product_img/19.jpg';
import img_20 from './product_img/20.jpg';
import img_21 from './product_img/21.jpg';
import img_22 from './product_img/22.jpg';
import img_23 from './product_img/23.jpg';
import img_24 from './product_img/24.jpg';
import img_25 from './product_img/25.jpg';
import img_26 from './product_img/26.jpg';
import img_27 from './product_img/27.jpg';
import img_28 from './product_img/28.jpg';
import img_29 from './product_img/29.jpg';
import img_30 from './product_img/30.jpg';
import img_31 from './product_img/31.jpg';
import img_32 from './product_img/32.jpg';
import img_33 from './product_img/33.jpg';
import img_34 from './product_img/34.jpg';
import img_35 from './product_img/35.jpg';
import img_36 from './product_img/36.jpg';
import img_37 from './product_img/37.jpg';
import img_38 from './product_img/38.jpg';
import img_39 from './product_img/39.jpg';
import img_40 from './product_img/40.jpg';

function Evaluation(props) {
	const [Offers, setOffers] = useState(props.offers);

	const handlelike = (uID, like, oID) => {
		var data = {
			userID: uID,
			dislike: like,
			offerID: oID,
		};
		const response = fetch('http://localhost:8000/submitlike', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		});

		handlePin();
		return response;
	};
	const handleStock = (oID, stock) => {
		if (stock === 0) {
			stock = 1;
		} else {
			stock = 0;
		}
		var data = {
			offerID: oID,
			exists: stock,
		};
		const response = fetch('http://localhost:8000/changeexist', {
			// Enter your IP address here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		});
		handlePin();

		return response;
	};

	const handlePin = () => {
		let shopID = props.offers[0].ShopID;
		const response = fetch('http://localhost:8000/shopoffer/pin?id=' + shopID, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((json) => {
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
				setOffers(off);
			});
		return response;
	};

	const IMG = {};
	IMG[1] = img_1;
	IMG[2] = img_2;
	IMG[3] = img_3;
	IMG[4] = img_4;
	IMG[5] = img_5;
	IMG[6] = img_6;
	IMG[7] = img_7;
	IMG[8] = img_8;
	IMG[9] = img_9;
	IMG[10] = img_10;
	IMG[11] = img_11;
	IMG[12] = img_12;
	IMG[13] = img_13;
	IMG[14] = img_14;
	IMG[15] = img_15;
	IMG[16] = img_16;
	IMG[17] = img_17;
	IMG[18] = img_18;
	IMG[19] = img_19;
	IMG[20] = img_20;
	IMG[21] = img_21;
	IMG[22] = img_22;
	IMG[23] = img_23;
	IMG[24] = img_24;
	IMG[25] = img_25;
	IMG[26] = img_26;
	IMG[27] = img_27;
	IMG[28] = img_28;
	IMG[29] = img_29;
	IMG[30] = img_30;
	IMG[31] = img_31;
	IMG[32] = img_32;
	IMG[33] = img_33;
	IMG[34] = img_34;
	IMG[35] = img_35;
	IMG[36] = img_36;
	IMG[37] = img_37;
	IMG[38] = img_38;
	IMG[39] = img_39;
	IMG[40] = img_40;

	return (
		<div className='Evaluation'>
			<div>
				<table>
					<tr>
						<th>Product</th>
						<th>Price</th>
						<th>Date</th>
						<th>Likes</th>
						<th>Dislikes</th>
						<th>Exists</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					{Offers !== {} &&
						typeof Offers !== 'undefined' &&
						Offers.map((offer) => {
							let stock;
							if (offer.Exists === 0) {
								stock = 'NOW IN STOCK!';
							} else {
								stock = 'OUT OF STOCK!';
							}
							return (
								<tr key={offer.OfferID}>
									<th>
										{offer.Product}
										<Popup
											trigger={<button>Click ME!!!!</button>}
											position='right center'>
											<div>
												<img
													style={{ width: '100%' }}
													src={IMG[offer.ProductID]}
													alt=''
												/>
											</div>
										</Popup>
									</th>
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
											disabled={offer.Exists === 0}
											onClick={() => {
												handlelike(props.userID, 1, offer.ID, offer.ShopID);
											}}>
											Like
										</button>
									</th>
									<th>
										<button
											disabled={offer.Exists === 0}
											onClick={() => {
												handlelike(props.userID, 0, offer.ID, offer.ShopID);
											}}>
											Dislike
										</button>
									</th>
									<th>
										<button
											onClick={() => {
												handleStock(offer.ID, offer.Exists, offer.ShopID);
											}}>
											{stock}
										</button>
									</th>
								</tr>
							);
						})}
				</table>
			</div>
		</div>
	);
}
export default Evaluation;
