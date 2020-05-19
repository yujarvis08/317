var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;

/* GET home page. */
//localhost:3000
router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root:'public/'});
});
/* GET login page*/
router.get('/login',  function (req, res, next) {
 res.sendFile('login.html', {root:'public/'});
});
/* GET register page*/
router.get('/register',  function (req, res, next) {
 res.sendFile('registration.html', {root:'public/'});
});
/* GET post image page*/
router.use('/postimage', isLoggedIn);
router.get('/postimage',  function (req, res, next) {
 res.sendFile('postimage.html', {root:'public/'});
});


module.exports = router;
