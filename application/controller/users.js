const errorPrint = require('../helpers/debug/debughelper').errorPrint;
const successPrint = require('../helpers/debug/debughelper').successPrint;
const UserError = require('../helpers/error/UserError');
const UserModel = require('../model/users.js');
const UserController = {
    createUser: function(req, res, next) {
        let email                = req.body.email;
	let username             = req.body.username;
	let password             = req.body.password;

	//validate username, password, email
	// check username presence
	UserModel.usernameExists(username)
	.then((usernameDoesNotExist) => {
		if(usernameDoesNotExist) {
			return UserModel.emailExists(email);
		} else {
			throw new UserError("Username exists", "/register",200);
		}
	})
	.then((emailDoesNotExist) => {
		if(emailDoesNotExist) {
			return bcrypt.hash(password, 10);
		} else {
			throw new UserError('Email already exists', '/register', 200);
		}
	})
	.then((hashedPassword) => {
		return UserModel.create(username, hashedPassword, email);
	})
	.then((userWasCreated) => {
		if(userWasCreated) {
			successPrint('User has been created');
			res.redirect('/login');
		} else {
			throw new UserError('Server Error, user could not be created', '/register', 500);
		}
	})
	.catch((err) => {
		if(err instanceof UserError) {
			errorPrint(err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
		next(err);
	})
    },

    logIn: function(req, res, next) {
        let username             = req.body.username;
	let password             = req.body.password;
	let userID;

	UserModel.authenticate(username, password)
	.then((userData) => {
		if(userData) {
			successPrint('Login Success');
			req.session.username = userData.user;
			req.session.userID = userData.uid;
			res.redirect('/');
		} else {
			throw new UserError('Username or password is incorrect', '/login', 200);
		}
	})
	.catch((err) => {
		if(err instanceof UserError) {
			errorPrint(err.getMessage());
			res.status(err.getStatus());
			res.redirect(err.getRedirectURL());
		}
		next(err);
	})
    },

    logOut: function(req, res, next) {
        req.session.destroy((err) => {
            if(err) {
                errorPrint('Failed to destroy session');
                next(err);
            } else {
                successPrint('Session destroyed');
                res.clearCookie('csid');
                res.redirect('/login')
            }
        })
    }
}

module.exports = UserController;