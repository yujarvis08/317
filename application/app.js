var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

var sessionStore = new mysqlStore({/*default options*/}, require('./conf/database'));
var sessionOptions = {
	key: 'csid',
	secret: 'this is a secret',
	store: sessionStore,
	cookie: {secure: false, httpOnly: false, maxAge: 900000},
	resave: false,
	saveUninitialized: false
}

app.use(session(sessionOptions));

app.use('/posts', postRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);



module.exports = app;
