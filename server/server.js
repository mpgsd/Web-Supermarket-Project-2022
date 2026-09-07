const express = require('express');
//const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);
const schedule = require('node-schedule');
const db = require('./connection/MySQLConnect');
const app = express();

const port = 8000;
const oneDay = 1000 * 60 * 60 * 24;

var sessionStore = new MySQLStore({ expiration: oneDay }, db);

app.use(
	sessions({
		store: sessionStore,
		secret: 'thisisaverysecuresecret',
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: true,
	})
);

app.use(express.json());
//app.use(cookieParser());

//Schedule 1 every month

const jobAlocToken = schedule.scheduleJob('0 0 0 0 */1 *', function () {
	query = 'Select Token  from ManageToken';
	db.query(query, function (err, result) {
		if (!err) {
			var token = result.Token;
			query = 'Select sum(monthscore)as totalscore From Users';
			db.query(query, function (err, result) {
				if (!err) {
					mtoken = Math.floor(0.8 * token);
					sscore = Math.floor(mtoken / result.totalscore);
					query = 'Select userID,monthscore,totaltoken,token From Users';
					db.query(query, function (err, result) {
						if (!err) {
							for (let i = 0; i < result.length; i++) {
								let ntoken = sscore * result[i].monthscore;
								result[i].totaltoken = result[i].totaltoken + ntoken;
								result[i].token = ntoken;
								result[i].monthscore = 0;
							}
							query =
								'INSERT INTO Users(userID,monthscore,totaltoken,token) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE monthscore = VALUES(monthscore), totaltoken = VALUES(totaltoken), token =VALUES(token)';
							db.query(query, result, function (err, result) {
								if (!err) {
									console.log('Month Aloc ok!');
								}
							});
						}
					});
				}
			});
		}
	});
});

const jobCreateToken = schedule.scheduleJob('0 30 0 0 */1 *', function () {
	query = 'Select Count(*) as C from Users';
	db.query(query, function (err, result) {
		if (!err) {
			var token = result.C * 100;
			query = 'UPDATE ManageToken Set Token = ?';
			db.query(query, token, function (err, result) {
				if (!err) {
					console.log('Create token ok!');
				}
			});
		}
	});
});
// const jobCreateToken1 = schedule.scheduleJob('*/1 * * * * *', function () {
// 	console.log('ot woks');
// });
//Routes
app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var data = [username, password];
	var userID;
	var admin;
	var query =
		'SELECT userID,admin FROM Users WHERE username = ? AND password = ?';
	db.query(query, data, function (err, result) {
		if (result.length > 0) {
			userID = result[0].userID;
			admin = result[0].admin;

			data = {
				userID: userID,
				admin: admin,
				username: username,
			};

			res.setHeader(
				'Access-Control-Allow-Origin',
				'*',
				'Access-Control-Allow-Methods',
				'POST'
			);

			return res.json(data);
		} else {
			res.status(400).json({ error: 'Wrong User/Pass' });
		}
	});
});
app.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var data = [username, password, email];
	console.log(req.body);
	var query = 'SELECT username FROM Users WHERE username = ?';
	db.query(query, username, function (err, result) {
		if (result.length == 0) {
			var query = 'INSERT INTO Users (username ,password,email) VALUES(?,?,?)';
			db.query(query, data, function (err, result) {
				res.setHeader(
					'Access-Control-Allow-Origin',
					'*',
					'Access-Control-Allow-Methods',
					'POST'
				);

				return res.status(200).json({ Msg: 'ok' });
			});
		} else {
			res.status(400).json({ error: 'Username already exists' });
		}
	});
});
app.get('/shop', function (req, res) {
	var query = 'Select * From Shops';
	db.query(query, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/category', function (req, res) {
	var query = 'Select DISTINCT category From Products';
	db.query(query, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/subcategory', function (req, res) {
	var query = 'Select DISTINCT subcategory,category From Products';
	db.query(query, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/product', function (req, res) {
	var query = 'Select name,category,productID,subcategory From Products';
	db.query(query, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/shopoffer', function (req, res) {
	var query = 'Select * From Shops';
	db.query(query, function (err, resultall) {
		if (resultall.length > 0) {
			var query =
				'Select DISTINCT Shops.shopID,Shops.lat,Shops.lon,Shops.tag From Shops inner join Offers on Shops.shopID=Offers.shopID where  Offers.date>DATE_SUB(now(),interval 7  day )';
			db.query(query, function (err, result) {
				for (let i = 0; i < resultall.length; i++) {
					resultall[i].color = 0;
				}
				if (result.length > 0) {
					var j = 0;
					for (let i = 0; i < resultall.length; i++) {
						if (j == result.length) {
							break;
						}
						let allID = resultall[i].shopID;

						let rID = result[j].shopID;
						if (allID == rID) {
							resultall[i].color = 1;
							j += 1;
						}
					}
					console.log(resultall);
					return res.json(resultall);
				} else {
					return res.json(resultall);
				}
			});
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/shopoffer/cat', function (req, res) {
	var data = req.query.id;
	if (data == 1) {
		cat = 'Ποτά - Αναψυκτικά';
	} else if (data == 2) {
		cat = 'Τρόφιμα';
	} else if (data == 3) {
		cat = 'Για κατοικίδια';
	} else if (data == 4) {
		cat = 'Προσωπική φροντίδα';
	}

	console.log(data, cat);
	var query =
		'Select DISTINCT Shops.shopID,Shops.lat,Shops.lon,Shops.tag From (Shops inner join Offers on Shops.shopID=Offers.shopID) inner join Products on Offers.productID=Products.productID where Products.category=? and  Offers.date>DATE_SUB(now(),interval 7  day )';
	db.query(query, cat, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/shopoffer/pin', async function (req, res) {
	var shopID = req.query.id;

	var query =
		'Select * From (Shops inner join Offers on Shops.shopID=Offers.shopID) inner join Products on Products.productID=Offers.productID where Shops.shopID=? and  Offers.date>DATE_SUB(now(),interval 7  day )';
	db.query(query, shopID, async function (err, result) {
		if (result.length > 0) {
			for (let i = 0; i < result.length; i++) {
				const offerID = result[i].offerID;

				// Retrieve likes count
				const likesQuery =
					'SELECT COUNT(*) AS c FROM Likes WHERE offerID = ? AND dislike = 1';
				const likesResult = await new Promise((resolve, reject) => {
					db.query(likesQuery, offerID, function (err, result1) {
						if (err) {
							reject(err);
						} else {
							resolve(result1);
						}
					});
				});

				if (likesResult.length > 0) {
					result[i].likes = likesResult[0].c;
				} else {
					result[i].likes = 0;
				}

				// Retrieve dislikes count
				const dislikesQuery =
					'SELECT COUNT(*) AS c FROM Likes WHERE offerID = ? AND dislike = 0';
				const dislikesResult = await new Promise((resolve, reject) => {
					db.query(dislikesQuery, offerID, function (err, result1) {
						if (err) {
							reject(err);
						} else {
							resolve(result1);
						}
					});
				});

				if (dislikesResult.length > 0) {
					result[i].dislikes = dislikesResult[0].c;
				} else {
					result[i].dislikes = 0;
				}
			}
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/checkexist', function (req, res) {
	var oID = req.query.id;

	var query = 'Select * From Offers where offerID = ?';
	db.query(query, oID, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/getoffers', function (req, res) {
	var userID = req.query.id;
	var query =
		'Select Products.name,Products.category,Products.subcategory,Offers.price,Shops.tag From (Offers inner join Products on Offers.productID=Products.productID) inner join Shops on Shops.shopID = Offers.shopID  where Offers.userID = ?';
	db.query(query, userID, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/getlikes', function (req, res) {
	var userID = req.query.id;
	var query =
		'Select Likes.dislike,Offers.date,Shops.tag,Products.name,Products.category,Products.subcategory,Offers.price From ((Likes inner join Offers on Offers.offerID=Likes.likeID) inner join Products on Products.productID=Offers.productID) inner join Shops on Shops.shopID=Offers.offerID where Likes.userID = ?';
	db.query(query, userID, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.get('/getUserData', function (req, res) {
	var userID = req.query.id;
	var query =
		'Select token, totaltoken , score ,monthscore From Users Where userID=?';
	db.query(query, userID, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None exist shop' });
		}
	});
});
app.post('/submitlike', function (req, res) {
	var username = req.body.userID;
	var dislike = req.body.dislike;
	var offerID = req.body.offerID;
	var data = [dislike, username, offerID];
	console.log(req.body);
	var query = 'SELECT * FROM Likes where userID=? and offerID=?';
	db.query(query, [username, offerID], function (err, result) {
		if (result.length === 0) {
			var query = 'INSERT INTO Likes(dislike,userID,offerID) values(?,?,?)';
			db.query(query, data, function (err, result) {
				if (!err) {
					var query = 'SELECT userID FROM Offers Where offerID=?';
					db.query(query, username, function (err, result) {
						if (!err) {
							var query = 'SELECT * FROM Users Where userID=?';
							db.query(query, result[0].userID, function (err, result) {
								if (!err) {
									if (dislike === 1) {
										var score = result[0].score + 5;
										var monthscore = result[0].monthscore + 5;
									} else {
										var score = result[0].score - 1;
										var monthscore = result[0].monthscore - 1;
										if (monthscore < 0) {
											monthscore = 0;
										}
									}
									var query =
										'UPDATE Users SET score=?,monthscore=? WHERE userID=?';
									db.query(
										query,
										[score, monthscore, result[0].userID],
										function (err, result) {
											if (!err) {
												return res.status(200);
											}
										}
									);
								}
							});
						}
					});
					return res.status(200);
				} else {
					res.status(400);
				}
			});
		} else {
			var prev = result[0].dislike;
			console.log('DIF', prev, dislike);
			if (prev !== dislike) {
				var query =
					'UPDATE Likes SET dislike=? Where userID=? and offerID =?  ';
				db.query(query, data, function (err, result) {
					if (!err) {
						var query = 'SELECT userID FROM Offers Where offerID=?';
						db.query(query, username, function (err, result) {
							if (!err) {
								console.log('offer userID', result[0].userID);
								var query = 'SELECT * FROM Users Where userID=?';
								db.query(query, result[0].userID, function (err, result) {
									console.log(err, result);
									if (!err) {
										var score = result[0].score;
										var monthscore = result[0].monthscore;
										console.log('Prev sc,ms', score, monthscore);
										if (dislike === 1) {
											score += 6;
											monthscore += 6;
										} else {
											score -= 6;
											monthscore -= 6;
											if (monthscore < 0) {
												monthscore = 0;
											}
										}
										console.log('Next sc,ms', score, monthscore);
										var query =
											'UPDATE Users SET score=?,monthscore=? WHERE userID=?';
										db.query(
											query,
											[score, monthscore, result[0].userID],
											function (err, result) {
												if (!err) {
													return res.status(200);
												}
											}
										);
									}
								});
							}
						});

						return res.status(200);
					} else {
						res.status(400);
					}
				});
			}
		}
	});
});
app.post('/changeexist', function (req, res) {
	var offerID = req.body.offerID;
	var exist = req.body.exists;
	var data = [exist, offerID];
	console.log(offerID);
	var query = 'UPDATE Offers SET exist=? WHERE offerID=?';
	db.query(query, data, function (err, result) {
		console.log(err);
		if (!err) {
			return res.status(200);
		} else {
			res.status(400);
		}
	});
});
app.post('/submitoffer', function (req, res) {
	var userID = req.body.userID;
	var productID = req.body.productID;
	var shopID = req.body.shopID;
	var price = req.body.price;
	var data = [userID, productID, shopID, price];
	console.log(data);
	var datas = [productID, shopID];
	var score;
	var monthscore;
	var query = 'SELECT * FROM Offers WHERE productID = ? and shopID = ?';
	db.query(query, datas, function (err, result) {
		if (result.length == 0 || 0.8 * result[0].price >= price) {
			score = result[0].score;
			query = result[0].monthscore;
			('INSERT INTO Offers(userID,productID,shopID,price) values(?,?,?,?)');
			db.query(query, data, function (err, result) {
				if (!err) {
					query =
						'SELECT AVG(price) as avg From Offers where productID = ? AND date>DATE_SUB(now(),interval 1  day )';
					db.query(query, productID, function (err, result) {
						if (price < 0.8 * result.avg) {
							score += 50;
							monthscore += 50;
							query = 'UPDATE Users SET score =?,monthscore=? Where userID=?';
							db.query(
								query,
								[score, monthscore, userID],
								function (err, result) {
									if (!err) {
										return res.status(200).json({ msg: 'ok' });
									} else {
										res.status(400);
									}
								}
							);
						} else {
							query =
								'SELECT AVG(price) as avg From Offers where productID = ? AND date>DATE_SUB(now(),interval 7  day )';
							db.query(query, productID, function (err, result) {
								if (price < 0.8 * result.avg) {
									score += 20;
									monthscore += 20;
									query =
										'UPDATE Users SET score =?,monthscore=? Where userID=?';
									db.query(
										query,
										[score, monthscore, userID],
										function (err, result) {
											if (!err) {
												return res.status(200).json({ msg: 'ok' });
											} else {
												res.status(400);
											}
										}
									);
								} else {
									return res.status(200).json({ msg: 'ok' });
								}
							});
						}
					});
				} else {
					res.status(400).json({ error: 'Wrong did not insert' });
				}
			});
		} else {
			res.status(400).json({ error: 'Offer alread exists' });
		}
	});
});
//admin
app.get('/monthoffer', function (req, res) {
	var month = req.query.month;
	var year = req.query.year;
	var data = [month, year];
	console.log(data);
	var query =
		'Select COUNT(*) as count, DAY(date) as day From Offers where MONTH(date) = ? AND YEAR(date)=? GROUP BY DAY(date) ORDER BY DAY(date)';
	db.query(query, data, function (err, result) {
		console.log(err);
		if (!err) {
			console.log(result);
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None offer exists' });
		}
	});
});
app.get('/weekdiscount', function (req, res) {
	var week = req.query.week;
	console.log(week);
	var query =
		'Select AVG(Offers.price) as avg,Products.category,Products.subcategory,Products.name From Offers INNER JOIN Products on Offers.productID=Products.productID WHERE WEEK(Offers.date)=? GROUP BY Products.category,Products.subcategory,Products.name';
	db.query(query, week, function (err, result) {
		if (result.length > 0) {
			var presult = result;
			var eresult = [];
			var query =
				'Select AVG(Offers.price) as avg,Products.category,Products.subcategory,Products.name From Offers INNER JOIN Products on Offers.productID=Products.productID WHERE WEEK(Offers.date)=? GROUP BY Products.category,Products.subcategory,Products.name';
			db.query(query, week - 1, function (err, result) {
				for (let i = 0; i < presult.length; i++) {
					if (result.length > 0) {
						let avg = result.find((x) => x.name === presult[i].name).avg;
						if (avg) {
							presult[i].per = ((avg - presult[i].avg) / avg) * 100;
							eresult.push(presult[i]);
						}
					}
				}
				console.log(eresult);

				return res.json(eresult);
			});
		} else {
			res.status(400).json({ error: 'None offer exists' });
		}
	});
});
app.get('/productoffer', function (req, res) {
	var query =
		'Select * From Offers inner join Products on Offers.productID=Products.productID';
	db.query(query, data, function (err, result) {
		if (result.length > 0) {
			return res.status(200);
			//return res.json(result);
		} else {
			res.status(400).json({ error: 'None offer exists' });
		}
	});
});
app.get('/userscore', function (req, res) {
	var offset = Number(req.query.offset);
	var query =
		'Select username,token, totaltoken , score ,monthscore From Users ORDER BY score DESC LIMIT 10 OFFSET ?';
	db.query(query, [offset], function (err, result) {
		if (!err) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None offer exists' });
		}
	});
});
app.delete('/deloffer', function (req, res) {
	var offerID = req.query.id;
	var query = 'DELETE * From Offers where offerID= ?';
	db.query(query, offerID, function (err, result) {
		if (result.length > 0) {
			return res.json(result);
		} else {
			res.status(400).json({ error: 'None offer exists' });
		}
	});
});
app.post('/uploadshop', function (req, res) {
	var file = req.body.file;
	console.log('1234');
	var jsonObj = JSON.parse(file);
	var query = 'SELECT lat,lon,tag FROM Shops';
	db.query(query, function (err, result) {
		var insert = [];

		for (let i = 0; i < jsonObj.length; i++) {
			let x = 0;
			for (let j = 0; j < result.length; j++) {
				if (
					jsonObj[i].lat === result[j].lat &&
					jsonObj[i].lon === result[j].lon &&
					jsonObj[i].tag === result[j].tag
				) {
					x = 1;
					break;
				}
			}

			if (x === 0) {
				insert.push(jsonObj[i]);
			}
		}
		if (insert !== []) {
			query = 'INSERT INTO Shops(lat,lon,tag) Values ?';
			db.query(
				query,
				[insert.map((ins) => [ins.lat, ins.lon, ins.tag])],
				function (err, result) {
					if (!err) {
						res.status(200);
					} else {
						res.status(400);
					}
				}
			);
		} else {
			res.status(200);
		}
	});
});
app.post('/dshop', function (req, res) {
	var file = req.body.file;
	var jsonObj = JSON.parse(file);
	console.log('1');
	var query = 'DELETE FROM Shops WHERE (lat,lon,tag)=?';
	db.query(
		query,
		[jsonObj.map((ins) => [ins.lat, ins.lon, ins.tag])],
		function (err, result) {
			console.log(err);
		}
	);
});
app.post('/uploadproduct', function (req, res) {
	var file = req.body.file;
	console.log('1234p');
	var jsonObj = JSON.parse(file);
	var query = 'SELECT lat,lon,tag FROM Shops';
	db.query(query, function (err, result) {
		var insert = [];

		for (let i = 0; i < jsonObj.length; i++) {
			let x = 0;
			for (let j = 0; j < result.length; j++) {
				if (
					jsonObj[i].name === result[j].name &&
					jsonObj[i].category === result[j].category &&
					jsonObj[i].subcategory === result[j].subcategory
				) {
					x = 1;
					break;
				}
			}

			if (x === 0) {
				insert.push(jsonObj[i]);
			}
		}
		if (insert !== []) {
			query = 'INSERT INTO Products(name,subcategory,category) Values ?';
			db.query(
				query,
				[insert.map((ins) => [ins.name, ins.subcategory, ins.category])],
				function (err, result) {
					if (!err) {
						res.status(200);
					} else {
						res.status(400);
					}
				}
			);
		} else {
			res.status(200);
		}
	});
});
app.post('/dproduct', function (req, res) {
	var file = req.body.file;
	var jsonObj = JSON.parse(file);
	console.log('1p');
	var query = 'DELETE FROM Products WHERE (name,subcategory,category)=?';
	db.query(
		query,
		[jsonObj.map((ins) => [ins.name, ins.subcategory, ins.category])],
		function (err, result) {
			console.log(err);
		}
	);
});
//listening application on port
var server = app.listen(port, () => {
	console.log('Server Listening on port ' + server.address().port);
});
