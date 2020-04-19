const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host:"localhost",
	user:"photoapp",
	password:"1234",
	database:"csc317",
	connectionLimit: 50,
	debug:false,
});

module.exports = pool;