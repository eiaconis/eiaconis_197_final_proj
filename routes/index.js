var express = require('express');
var router = express.Router();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var userDb = require('../db/user');
var groupDb = require('../db/group');
//var Canvas = require('../db/Canvas');


var checkValidKey = require('../middlewares/checkValidKey');

/*Get Requests*/
router.get('/home', function (req, res, next) {
	if (req.session.isAuthenticated) {
		res.render('home');
	} else {
		res.redirect('/');
	}
});

router.get('/projects', function (req, res, next) {
	res.render('projects');
});

router.get('/allUsers', function (req, res, next) {
	userDb.getAllUsers(function (err, allUsers) {
		console.log("got all Users" + allUsers);
		res.send(allUsers);
	});
});

router.get('/allGroups', function (req, res, next) {
	console.log(req.session.user);
	groupDb.getAllGroups(req.session.user, function (err, allGroups) {
		console.log("got all Groups" + allGroups);
		res.send(allGroups);
	});
});

/*Post Requests*/
router.post('/createAccount', function (req, res) {
	console.log("creating account");
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	userDb.addUser({username: username, password: password, email: email}, function (err, savedUser) {
		if (err) {
			res.redirect('/')
		} else {
			req.session.isAuthenticated = true;
			req.session.user = savedUser._id;
			console.log("Current user: " + req.user);
			res.redirect('/home');
		}
	});
});

router.post('/checkLogin', function (req, res) {
	console.log("logging in");
	var username = req.body.username;
	var password = req.body.password;
	userDb.checkPassword(username, password, function (err, resp) {
		if (err) {
			console.log(err);
			res.redirect('/');
		} else if (resp) {
			req.session.isAuthenticated = true;
			req.session.user = resp._id;
			console.log(req.session.isAuthenticated);
			console.log("Current user: " + req.user);
			res.redirect('/home');
		} else {
			res.redirect('/');
		}
	});
});

router.post('/logout', function (req, res) {
	console.log("logging out");
	req.session.isAuthenticated = false;
	req.user = null;
	console.log("Current user: " + req.session.isAuthenticated);
	res.redirect('/');
});


module.exports = router;
