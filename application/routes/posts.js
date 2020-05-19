const express                = require('express');
const router                 = express.Router();
const errorPrint = require('../helpers/debug/debughelper').errorPrint;
const successPrint = require('../helpers/debug/debughelper').successPrint;
const db                     = require('../conf/database.js');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "public/images/uploads");
	},
	filename: function(req, file, cb) {
		let fileExt = file.mimetype.split("/")[1];
		let randName = crypto.randomBytes(22).toString("hex");
		cb(null, `${randName}.${fileExt}`);
	}
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single('uploadImage'), (req, res, next) => {
	let fileUploaded = req.file.path;
	let fileThumbnail = `thumbnail-${req.file.filename}`;
	let destOfThumbnail = req.file.destination + "/" + fileThumbnail;
	let title = req.body.title;
	let desc = req.body.description;
	let fk_userid = req.session.userID;

	sharp(fileUploaded)
	.resize(200)
	.toFile(destOfThumbnail)
	.then(() => {
		let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUES (?,?,?,?,now(),?);'
		return db.execute(baseSQL,[title,desc,fileUploaded,destOfThumbnail,fk_userid]);

	})
	.then(([results, fields]) => {
		if(results && results.affectedRows) {
			res.redirect('/');
		} else {
			next(Error('Error creating post'));
		}
	})
	.catch((err) => {next(err)});
});

router.get('/search/:searchTerm', (req, res, next) => {
	let searchTerm = req.params.searchTerm;
	let _sql = 'SELECT posts.id, posts.title, posts.description, posts.thumbnail, \
	  users.username \
	FROM posts \
	JOIN users ON posts.fk_userid=users.id \
	WHERE title LIKE ?;';
	searchTerm = "%" + searchTerm + "%";
	db.query(_sql,[searchTerm])
	.then(([results, fields]) => {
		res.json(results);
	})
	.catch((err) => next(err));
})

router.get('/getRecentPosts', (req, res, next) => {
	let _sql = 'SELECT posts.id, posts.title, posts.description, \
	posts.thumbnail, users.username, posts.created \
	FROM posts \
	JOIN users ON posts.fk_userid=users.id \
	ORDER BY posts.created  DESC \
	LIMIT 100';
	db.query(_sql)
	.then(([results, fields]) => {
		res.json(results);
	})
	.catch((err) => next(err));
})

router.get("/imagepage/:id",  function (req, res, next) {
	res.sendFile('imagepage.html', {root:'public/'});
   });


router.get('/getPostById/:id', (req, res, next) => {
	let _id = req.params.id;
	let _sql = 'SELECT posts.id, posts.title, posts.description, posts.photopath, \
	users.username, posts.created \
	FROM posts \
	JOIN users ON posts.fk_userid=users.id \
	WHERE posts.id = ?';
	db.query(_sql, _id)
	.then(([results, fields]) => {
		res.json(results[0]);
	})
	.catch((err) => next(err));
})

module.exports = router;