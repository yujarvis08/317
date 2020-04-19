const express                = require('express');
const router                 = express.Router();
const db                     = require('../conf/database.js');

router.post('/register', function(req, res, next) {
	console.log(req.body);
	let email                = req.body.email;
	let username             = req.body.username;
	let password             = req.body.password;

	let baseSQL              = 'INSERT INTO users (username, email, password, created) VALUES (?, ?, ?, now())';
	db.query(baseSQL, [username, email, password])
	.then(([results, fields])=> {

		if(results && results.affectedRows) {
			res.redirect('/login');
		} else {
			res.send('user was not created');
		}
	});
});

router.post('/login', function(req, res, next) {
	console.log(req.body);
	let username             = req.body.username;
	let password             = req.body.password;

	let loginCred            = 'SELECT * FROM users WHERE username = ? AND password = ?';
	db.query(loginCred, [username, password])
	.then(([results, fields])=> {
		
		if(results.username  == username && results.password == password) {
			res.send('login successful');
		} else {
			res.send('login unsuccessful');
		}
	});
});



module.exports = router;