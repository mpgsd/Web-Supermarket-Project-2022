import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { UserData } from './userData';
import Chart from 'chart.js/auto';

function LineChart({ chartData }) {
	return <Line data={chartData} />;
}

const Statistics = () => {
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

	const [selectedDate, setSelectedDate] = useState(new Date());

	// Fetch data from the server based on the selected date
	const getData = async () => {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth() + 1; // Months are zero-based in JavaScript
		const response = await fetch(
			`http://localhost:8000/monthoffer?year=${year}&month=${month}`
		);
		const data = await response.json();

		// Process the data and create the chart dataset

		//ayto einai to palio chart kai den fainetai mhn asxoleisai
		const chartDataset = {
			labels: data.map((data) => data.day),
			datasets: [
				{
					label: 'Number of Offers',
					data: data.map((data) => data.count),
					backgroundColor: 'rgba(75,192,192,0.6)',
					borderWidth: 4,
				},
			],
		};

		// AYTO EINAI GIA NA PAREI ENA CHART THN HMEROMHNIA Populate the chart dataset with the retrieved data

		setUserData(chartDataset);
	};

	useEffect(() => {
		getData();
	}, [selectedDate]);

	return (
		<div style={{ width: '85%', float: 'right' }}>
			<h2>
				Statistics Chart for {selectedDate.getMonth() + 1}/
				{selectedDate.getFullYear()}
			</h2>
			<input
				style={{ float: 'right' }}
				type='date'
				value={selectedDate.toISOString().split('T')[0]}
				onChange={(e) => setSelectedDate(new Date(e.target.value))}
			/>
			{/* allios vazoume pano <input type="text" 
      value={selectedDate} onChange={handleDateChange} />*/}

			{/*<Line data={chartData} />*/}
			<LineChart chartData={userData} />
		</div>
	);
};

export default Statistics;

{
	/*let sortedData = [];

    fetch("/api/createChart")
      .then((response) => response.json())
      .then((data) => {
        data.sort(function (a, b) {
          var one = a.dateOfOffer.split("/").reverse().join("");
          var two = b.dateOfOffer.split("/").reverse().join("");
          return one > two ? 1 : one < two ? -1 : 0;
        });

        console.log(data);
        var totalNumberofOffers = 0;

        for (i = 0; i < data.length; i++) {
          totalNumberofOffers += data[i].offer.length;

          if (i == data.length - 1)
            sortedData.push({
              date: data[i].dateOfOffer,
              numberOfOffers: totalNumberofOffers,
            });
          else if (data[i].dateOfOffer !== data[i + 1].dateOfOffer) {
            sortedData.push({
              date: data[i].dateOfOffer,
              numberOfOffers: totalNumberofOffers,
            });
            totalNumberofOffers = 0;
          }
        }

        console.log(sortedData);
        console.log(sortedData.map((data) => data.date));
        var ctx = document.getElementById("chart1").getContext("2d");
        var chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: sortedData.map((data) => data.date),
            datasets: [
              {
                label: "My Offers",
                data: sortedData.map((data) => data.numberOfOffers),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
      });


      function goBack() {
  		  window.history.back();
  			}*/
}
