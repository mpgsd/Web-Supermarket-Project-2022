import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import Chart from 'chart.js/auto';
import Select from 'react-select';

function LineChart({ chartData }) {
	return <Bar data={chartData} />;
}

Date.prototype.getWeek = function () {
	var onejan = new Date(this.getFullYear(), 0, 1);
	var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
	var dayOfYear = (today - onejan + 86400000) / 86400000;
	return Math.ceil(dayOfYear / 7);
};

const Statistics2 = (props) => {
	const [category, setValueC] = useState('');
	const [Ccat, setCcat] = useState('');
	const [Csubcat, setCsubcat] = useState('');
	const [subcategory, setsubcat] = useState('');
	const [sub_cat, setsub_cat] = useState('');
	const [userData, setUserData] = useState({
		labels: 0,
		//labels: filteredData.map((data) => data.year)
		datasets: [
			{
				label: 'Number of Offers',
				data: 0,
				backgroundColor: [
					'rgba(75,192,192,1)',
					'#ecf0f1',
					'#50AF95',
					'#f3ba2f',
					'#2a71d0',
				],
				borderColor: 'black',
				borderWidth: 5,
			},
		],
	});
	const [allData, setAllData] = useState('');
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Fetch data from the server based on the selected date
	const getData = async () => {
		const week = selectedDate.getWeek();
		const response = await fetch(
			`http://localhost:8000/weekdiscount?week=${week}`
		);
		const data = await response.json();
		setAllData(data);
		const chartDataset = {
			labels: data.map((data) => data.name),
			datasets: [
				{
					label: 'Discound',
					data: data.map((data) => data.per),
					backgroundColor: [
						'rgba(75,192,192,1)',
						'#ecf0f1',
						'#50AF95',
						'#f3ba2f',
						'#2a71d0',
					],
					borderColor: 'black',
					borderWidth: 5,
				},
			],
		};

		// AYTO EINAI GIA NA PAREI ENA CHART THN HMEROMHNIA Populate the chart dataset with the retrieved data

		setUserData(chartDataset);
	};

	useEffect(() => {
		getData();
	}, [selectedDate]);

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

	const handleChange = (e) => {
		setCcat(e.category);
		if (e.category === 'All') {
			setsub_cat(subcategory);
		} else {
			let s = [{ subcategory: 'All', label: 'All', category: 'All' }];
			for (let i = 0; i < subcategory.length; i++) {
				if (e.category === subcategory[i].category) {
					s.push(subcategory[i]);
				}
			}
			setsub_cat(s);
		}
	};

	const handleChangesubcat = (e) => {
		setCsubcat(e.subcategory);
	};
	const handleSubmitsubcat = (category, subcategory) => {
		let cData = [];

		for (let i = 0; i < allData.length; i++) {
			if (Ccat === 'All' || Ccat === allData[i].category) {
				if (Csubcat === 'All' || Csubcat === allData[i].subcategory) {
					cData.push(allData[i]);
				}
			}
		}
		console.log(cData);
		const chartDataset = {
			labels: cData.map((data) => data.name),
			datasets: [
				{
					label: 'Discound',
					data: cData.map((data) => data.per),
					backgroundColor: [
						'rgba(75,192,192,1)',
						'#ecf0f1',
						'#50AF95',
						'#f3ba2f',
						'#2a71d0',
					],
					borderColor: 'black',
					borderWidth: 5,
				},
			],
		};

		// AYTO EINAI GIA NA PAREI ENA CHART THN HMEROMHNIA Populate the chart dataset with the retrieved data

		setUserData(chartDataset);
	};

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

	return (
		<div style={{ width: '85%', float: 'right' }}>
			<h2>
				Statistics Chart for {selectedDate.getWeek()} week of{' '}
				{selectedDate.getFullYear()}
			</h2>
			<input
				style={{ float: 'right' }}
				type='date'
				value={selectedDate.toISOString().split('T')[0]}
				onChange={(e) => setSelectedDate(new Date(e.target.value))}
			/>

			<LineChart chartData={userData} />
			<div className='selectionadmin'>
				<h2> Select a Category</h2>

				<Select
					options={category}
					defaultValue={category}
					placeholder='Select a Category '
					isSearchable
					noOptionsMessage={() => 'No Category found'}
					onChange={(e) => handleChange(e)}
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

				<button
					type='submit'
					onClick={() => handleSubmitsubcat(Ccat, Csubcat)}>
					Submit
				</button>
			</div>
		</div>
	);
};

export default Statistics2;
