var express = require('express');
var router = express.Router();

/* GET home page. */
//localhost:3000
router.get('/home', function(req, res, next) {
  res.sendFile('index.html', {root:'public/'});
});
/* GET login page*/
router.get('/login',  function (req, res, next) {
 res.sendFile('login.html', {root:'public/'});
});
/* GET register page*/
router.get('/registration',  function (req, res, next) {
 res.sendFile('registration.html', {root:'public/'});
});
/* GET post image page*/
router.get('/postimage',  function (req, res, next) {
 res.sendFile('postimage.html', {root:'public/'});
});

router.get('/imagepage',  function (req, res, next) {
 res.sendFile('imagepage.html', {root:'public/'});
});

/*router.get('/logout',  function (req, res, next) {
	req.session = null;
});*/

module.exports = router;
