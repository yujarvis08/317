const routeProtectors = {};
const errorPrint = require('../helpers/debug/debughelper').errorPrint;
const successPrint = require('../helpers/debug/debughelper').successPrint;

routeProtectors.userIsLoggedIn = function(req, res, next) {
	if(req.session.username) {
		successPrint('User is logged in');
		next();
	} else {
		errorPrint('User not logged in');
		redirect('/login');
	}
}

module.exports = routeProtectors;