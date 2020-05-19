const express                = require('express');
const router                 = express.Router();
const UserController = require('../controller/users');

router.post('/register', function(req, res, next) {
	UserController.createUser(req, res, next);
});

router.post('/login', function(req, res, next) {
	UserController.logIn(req, res, next);
});

router.post('/logout', (req, res, next) => {
	UserController.logOut(req, res, next);
})

module.exports = router;