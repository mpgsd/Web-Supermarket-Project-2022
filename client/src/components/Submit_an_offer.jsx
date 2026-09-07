import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './main.css';

function SubmitAnOffer(props) {
	// render(){
	const [shop, setValueS] = useState('');
	const [category, setValueC] = useState('');
	const [product, setValue] = useState('');
	const [subcategory, setsubcat] = useState('');
	const [c_prod, setcprod] = useState('');
	const [c_shop, setcshop] = useState('');
	const [c_prodact, setprod] = useState('');
	const [price, setprice] = useState('');
	const [Csubcat, setCsubcat] = useState('');
	const [Ccat, setCcat] = useState('');
	const [sub_cat, setsub_cat] = useState('');

	const getShopData = async () => {
		const response = await fetch('http://localhost:8000/shop', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((json) => {
				let shop = [];
				for (let i = 0; i < json.length; i++) {
					let value = JSON.parse(json[i].tag);
					let json1 = {
						shop: value['name'],
						label: value['name'],
						shopID: json[i].shopID,
					};
					shop.push(json1);
				}
				setValueS(shop);
			});
		return response;
	};

	useEffect(() => {
		getShopData();
	}, []);

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

	const getproductData = async () => {
		const response = await fetch('http://localhost:8000/product', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((json) => {
				let product = [];
				for (let i = 0; i < json.length; i++) {
					let json1 = {
						product: json[i].name,
						label: json[i].name,
						category: json[i].category,
						productID: json[i].productID,
						subcategory: json[i].subcategory,
					};
					product.push(json1);
				}
				setValue(product);
				setcprod(product);
			});
		return response;
	};

	useEffect(() => {
		getproductData();
	}, []);

	const getsubcategory = async () => {
		const response = await fetch('http://localhost:8000/subcategory', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((json) => {
				let subcategory = [
					{ subcategory: 'All', label: 'All', category: 'All' },
				];
				for (let i = 0; i < json.length; i++) {
					let json1 = {
						label: json[i].subcategory,
						subcategory: json[i].subcategory,
						category: json[i].category,
					};
					subcategory.push(json1);
				}
				setsubcat(subcategory);
				setsub_cat(subcategory);
			});
		return response;
	};
	useEffect(() => {
		getsubcategory();
	}, []);

	const handleChange = (e) => {
		setCcat(e.category);
		let sub = [{ subcategory: 'All', label: 'All', category: 'All' }];

		for (let i = 0; i < subcategory.length; i++) {
			if (e.category === 'All' || e.category === subcategory[i].category) {
				sub.push(subcategory[i]);
			}
		}
		setsub_cat(sub);

		console.log(sub);
	};
	const handleChangesubcat = (e) => {
		setCsubcat(e.subcategory);
		let newprod = [];
		for (let i = 0; i < product.length; i++) {
			if (e.subcategory === 'All' || e.subcategory === product[i].subcategory) {
				newprod.push(product[i]);
			}
		}
		setcprod(newprod);
	};
	const handleChangeShop = (e) => {
		setcshop(e.shopID);
	};
	const handleChangeProd = (e) => {
		setprod(e.productID);
	};
	const handleInput = (e) => {
		setprice(e.target.valueAsNumber);
	};

	const handleSubmit = (shopID, productID, userID, price) => {
		if (shopID > 0 && productID > 0 && userID > 0 && price > 0) {
			let data = {
				shopID: shopID,
				productID: productID,
				userID: userID,
				price: price,
			};
			fetch('http://localhost:8000/submitoffer', {
				// Enter your IP address here
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data), // body data type must match "Content-Type" header
			});
		}
	};

	var val;
	if (props.shopID !== 0) {
		val = shop[props.shopID - 1];
	}
	return (
		<div className='Selection'>
			<h2> Select a Shop to submit an offer</h2>
			<Select
				options={shop}
				value={val}
				placeholder='Select a Shop'
				isSearchable
				onChange={() => handleChangeShop}
				noOptionsMessage={() => 'No Shop found'}
			/>

			<h2> Select a Category</h2>
			<Select
				options={category}
				placeholder='Select a Category '
				isSearchable
				onChange={(e) => handleChange(e)}
				noOptionsMessage={() => 'No Category found'}
			/>
			<h2> Select a Subcategory</h2>
			<Select
				options={sub_cat}
				defaultValue={sub_cat}
				placeholder='Select a Subcategory '
				isSearchable
				onChange={(e) => handleChangesubcat(e)}
				noOptionsMessage={() => 'No Product found'}
			/>
			<h2> Now select the product that you want to submit the offer</h2>
			<Select
				options={c_prod}
				placeholder='Select a Product '
				isSearchable
				onChange={(e) => handleChangeProd(e)}
				noOptionsMessage={() => 'No Product found'}
			/>

			<span className='offer'>
				<h2> Add the price </h2>
				<input
					type='number'
					required
					placeholder='Price'
					onChange={() => handleInput}
				/>
				<button
					type='submit'
					onClick={() => handleSubmit(c_shop, c_prodact, props.userID, price)}>
					Submit
				</button>
			</span>
		</div>
	);
}

export default SubmitAnOffer;
