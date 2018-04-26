#!/usr/bin/env node
// start the server
var app = require('../app');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.database);
var userDb = require('../db/user');
var groupDb = require('../db/group');
var canvasDb = require('../db/canvas');

app.set('port', process.env.PORT || 3000);


// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. 

var http = require('http');
var io = require('socket.io');

var server = app.listen(app.get('port'), function () {
	console.log('Express server listening on port %d', server.address().port);
});

var socketServer = io(server);

var currOnline = [];

socketServer.on('connection', function (socket) {

	// as soon as user logs on, send back all other users and the users's groups
	if (currOnline) {
		socket.emit('online_users', currOnline);
	}

  // update all users a new user has logged in
  socket.on('log_on', function (data) {
  	if (data) {
  		currOnline.push(data);
  	}
  	socket.broadcast.emit('newuser_log_on', data);

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
	socket.broadcast.emit('user_log_out', data);
});

// tell all sockets to check for updates
socket.on('create_group', function(data) {
	console.log("group created");
	var users = data.users;
	groupDb.addGroup(data, function(err, savedGroup) {
		if (err) {
			alert("Error creating group: " + err);
		} else {
			socketServer.emit('new_group', data);
		}
	});	
});

// socket joins group
socket.on('join_group', function(data){
	console.log(data.username + "joined" + data.groupName);
	socket.join(data.groupName);
	// get current canvas state to send back also
	socketServer.to(data.groupName).emit('req_canvas'); 
	socketServer.to(data.groupName).emit('user_join', data.username); // emit to group user joined
});

socket.on('curr_canvas', function(canvas, groupName) {
	console.log(groupName + canvas);
	var data = {content: canvas}
	if (canvas && groupName) {
		socketServer.to(groupName).emit('draw_canvas', data);
	}
})

socket.on('paint', function(data) {
	var update = {"ind": data.ind, "color": data.color};
	socketServer.to(data.groupName).emit('paint_canvas', update); 
});

// allow a user to leave group and update users in this group
socket.on('leave_group', function (groupId, userId) {
	console.log("leaving group " + userId)
	socket.leave(groupId); // disconnect socket
	socketServer.to(groupId).emit('user_left', userId); // emit to group that this user left
});

socket.on('save_canvas', function (canvas, id) {
	canvasDb.saveCanvas(canvas, function(err, data) {
		if (err) {
			console.log("Error creating group: " + err);
		} else {
			console.log("saved canvas!" + data);
			socketServer.local.emit('new_canvas', data);
		}
	});	
})

socket.on('get_canvas_data', function (title) {
	console.log("getting " + title);
	canvasDb.getCanvasData(title, function(err, data) {
		if (err) {
			console.log("Error getting canvas: " + err);
		} else {
			socketServer.local.emit('draw_canvas', data);
		}
	});	
})


});
