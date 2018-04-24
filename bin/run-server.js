#!/usr/bin/env node
// start the server
var app = require('../app');

app.set('port', process.env.PORT || 3000);

/*var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d', server.address().port);
});*/

// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. However, currently it does not
// actually have any websocket functionality - that part is your job!

var http = require('http');
var io = require('socket.io');


var server = app.listen(app.get('port'), function () {
	console.log('Express server listening on port %d', server.address().port);
});

var socketServer = io(server);

var currOnline = [];

socketServer.on('connection', function (socket) {

	// as soon as user logs on, send back all other users and the users's groups
	socket.emit('online_users', currOnline);

  // update all users a new user has logged in
  socket.on('log_on', function (data) {
  	currOnline.push(data);
  	socketServer.emit('newuser_log_on', data);
  });

// update all users a user has logged out
socket.on('log_out', function (data) {
	var newCurr = []
	for (var i = 0; i < currOnline.length; i++) {
		if (currOnline[i] != data) {
			newCurr.push(currOnline[i]);
		} 
		currOnline = newCurr;
	}
	console.log("logging out user: " + data._id);
	socketServer.emit('user_log_out', data);
});

// create group and update users in this group
socket.on('create_group', function (data) {
	//TODO - emit to only group members, emit group_created
	
});

socket.on('join_group', function(groupId){
	//TODO - emit to only group members, emit user_join

});

// allow a user to leave group and update users in this group
socket.on('leave_group', function (data) {
	//TODO- emit to only group members, emit user_left

});

});
