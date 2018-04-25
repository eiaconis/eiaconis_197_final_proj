           // var allUsers = []
           var canvasState = []
           var curr;
           $(document).ready(function () {
            console.log("loading canvas");
            var $canvasElement = $('#canvas-builder');
            var builder = new CanvasBuilder($canvasElement);
            builder.setupPalette();
            builder.setupCanvas();

            window.socketURL = 'http://localhost:3000';

            window.socket = io(window.socketURL);

            $.get('/currUser', function (data, status) {
                  curr = data; // store reference to current user frontend
                });

            $.get('/allGroups', function (data, status) {
              var allGroups= data;
              console.log(allGroups);
              for (var i = 0; i < allGroups.length; i++) {
                window.makeGroup(data[i]);
              }
            });

            $.get('/allProjects', function (data, status) {
              var allProjects = data;
              console.log(allProjects);
              for (var i = 0; i < allProjects.length; i++) {
                if (allProjects[i].author == curr._id) {
                  window.makeProject(allProjects[i]);
                }
              }
            });

              // notify server a new user has connected and ask it to notify other online users
              window.socket.on('connect', function () {
                $.get('/currUser', function (data, status) {
                  curr = data; // store reference to current user frontend
                  window.socket.emit('log_on', curr);
                });
              });

              // update state if user logs on
              window.socket.on('newuser_log_on', function (user) {
                console.log(user)
                window.makeUser(user);
              });

              // update state if user logs on
              window.socket.on('user_log_out', function (user) {
                window.removeUser(user);
              });

              window.socket.on('online_users', function (allUsers) {
                for (var i = 0; i < allUsers.length; i++) {
                  if (allUsers[i] && !document.getElementById(allUsers[i]._id) && allUsers[i]._id != curr._id) {
                    var $newDiv = $('<div>');
                    $('.users').append($newDiv);
                    $newDiv.addClass("well " + allUsers[i]._id);
                    $newDiv.attr('id', allUsers[i]._id);
                    var content = document.createTextNode(allUsers[i].username);
                    $newDiv.append(content);
                    $newDiv.on('mousedown', onClickedUser);
                  }
                }
              });

              window.socket.on('new_group', function (data) {
                window.makeGroup(data);
                if (data.users.includes(curr._id)) {
                  // TODO post request to add group to user account
                }
              });

              window.socket.on('user_left', function (username) {
                if(username != curr.username) {
                  alert(username + " left group!");
                }
              });

              window.socket.on('user_join', function (username) {
               if(username != curr.username) {
                alert(username + " joined group!");
              }
            });

              window.socket.on('paint_canvas', function(data) {
                window.paintSwatch(data);
              });

              window.socket.on('draw_canvas', function(data) {
                console.log("drawing!");
                window.redraw(data.content);
              });

              window.socket.on('new_canvas', function(data) {
                window.makeProject(data);
              });

            });

           window.makeUser = function(data) {
            if (data && !document.getElementById(data._id) && data._id != curr._id) {
              var $newDiv = $('<div>');
              $('.users').append($newDiv);
              $newDiv.addClass("well " + data._id);
              $newDiv.attr('id', data._id);
              var content = document.createTextNode(data.username);
              $newDiv.append(content);
              $newDiv.on('mousedown', onClickedUser);
            }
          }

          window.removeUser = function(data) {
            var div = document.getElementById(data._id);
            div.parentNode.removeChild(div);
          }

          window.makeGroup = function(data) {
            if (data && data.users.includes(curr._id)) {
              var $newDiv = $('<div>');
              $('.groups').append($newDiv);
              $newDiv.addClass("well " + data.name);
              $newDiv.attr('id', data.name);
              var content = document.createTextNode(data.name);
              $newDiv.append(content);
            $newDiv.on('mousedown', joinGroup); //TODO: open current canvas of group
          }
        }

        window.makeProject = function(data) {
          var $newDiv = $('<div>');
          $('.projects').append($newDiv);
          $newDiv.addClass("well " + data.title);
          $newDiv.attr('id', data._id);
          var content = document.createTextNode(data.title);
          $newDiv.append(content);
          $newDiv.on('mousedown', emitRedraw(data.title)); 
        }
 /*
 Modified HW4
 */
// Default size of map (in tiles)
var DEFAULT_WIDTH = 84;
var DEFAULT_HEIGHT = 47;
var selectedSwatch = 'white';

var CanvasBuilder = function ($container, params) {
  console.log("canvas builder")
  this.$container = $container;
  this.height = DEFAULT_HEIGHT;
  this.width = DEFAULT_WIDTH;
};

CanvasBuilder.prototype.setupPalette = function () {
  console.log("setting up pallette")
  $('.swatch').click(function () {
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    var $selSwatch = $('.selected');  // jQuery element
    var selSwatch = $selSwatch.get(0);  // DOM element
    selectedSwatch = selSwatch.classList[1];
  });
};

CanvasBuilder.prototype.setupCanvas = function () {
  for (var i = 0; i < this.height; i++) {
    var $firstDiv = $('<div>');
    $('.canvas').append($firstDiv);
    $firstDiv.addClass('row');
    for (var j = 0; j < this.width; j++) {
      var ind = (i * 83) + j;
      canvasState[ind] = "white";
      var $newDiv = $('<div>');
      $firstDiv.prepend($newDiv);
      $newDiv.addClass('swatch white');
      $newDiv.attr('id', ind);
      $newDiv.data('past', 'swatch white');
      $newDiv.on('mouseover', onMouseOver);
      $newDiv.on('mousedown', onMouseDown);
      $newDiv.on('mouseout', onMouseOut);
    }
  }
}

// Event handlers 

function onMouseOver (e) {
  var LEFT_MOUSE_BUTTON = 1;
  if (e.which === LEFT_MOUSE_BUTTON) {
    $(this).removeClass($(this).get(0).classList[1]);
    $(this).addClass(selectedSwatch);
    $(this).data('past', selectedSwatch);
    var ind = $(this).attr('id');
    canvasState[ind] = selectedSwatch;
    if (document.group) {
      var data = {"groupName":document.group, "ind": ind, "color": selectedSwatch};
      window.socket.emit('paint', data);
    }
  } else {
    $(this).removeClass($(this).get(0).classList[1]);
    $(this).addClass(selectedSwatch);
  }
}

function onMouseOut () {
  $(this).removeClass($(this).get(0).classList[1]);
  $(this).addClass($(this).data('past'));
}

function onMouseDown () {
  $(this).data('past', selectedSwatch);
  $(this).removeClass($(this).get(0).classList[1]);
  var ind = $(this).attr('id');
  canvasState[ind] = selectedSwatch;
  $(this).addClass(selectedSwatch);
  if (document.group) {
    var data = {"groupName":document.group, "ind": ind, "color": selectedSwatch};
    window.socket.emit('paint', data);
  }
}

function onClickedUser() {
  if ($(this).get(0).classList[2]) {
    $(this).removeClass("toAdd");
  } else {
    $(this).addClass("toAdd");
  }
}

function logOut() {
  window.socket.emit('log_out', curr);
  alert("Logging out!");
  $.post('/logout', function (req, res) {
    window.location.reload();
  });
}

function createGroup() {
  var groupName = $('.new-group-name').val();
  $('.new-group-name').setText("Enter group name...");
  var newUsers = []
  var users = [].slice.call(document.getElementsByClassName('toAdd')); // get all user wells with "toAdd" class set
  for (var i = 0; i < users.length; i++) {
    newUsers.push(users[i].id);
  }
  newUsers.push(curr._id);
  console.log(newUsers);
  var data = {name: groupName, users: newUsers};
  window.socket.emit('create_group', data);
}

function joinGroup() {
  var groupName = $(this).attr('id');
  $(this).addClass('selected');
  document.group = groupName;
  var data = {"groupName": groupName, "userId": curr._id, "username":curr.username};
  window.socket.emit('join_group', data);
}

function leaveGroup() {
  if (document.group) {
    console.log("leaving")
    window.socket.emit('leave_group', document.group, curr.username);
    document.group = null;
    clearCanvas();
  }
}

// iterate through all of the "swatches" of the current canvas state and store color in flattened array
function saveCanvas() {
  var title = $('.title').val();
  var type = document.group ? true : false;
  var newCanvas = {"title": title, "author": curr._id, "type": type, content:canvasState}; //TODO update type based if in group
  document.canvas = newCanvas;
  window.socket.emit('save_canvas', newCanvas, curr._id);
}

function paintSwatch(data) {
  console.log("painting" + data.color);
  canvasState[data.ind] = data.color;
  var currSwatch = document.getElementById(data.ind);
  var remove = currSwatch.classList[1];
  currSwatch.classList.remove(remove);
  currSwatch.classList.add("swatch", data.color);
}

function clearCanvas() {
  for (var i = 0; i < 3948; i++) {
    if (canvasState[i]) {
      var currSwatch = document.getElementById(i);
      var remove = currSwatch.classList[1];
      currSwatch.classList.remove(remove);
      currSwatch.classList.add("white");
      canvasState[i] = "white";
    }
  }
}

function emitRedraw(title) {
  console.log('emitting redraw for ' + title);
  window.socket.emit('get_canvas_data', title);
}

function redraw(content) {
  var canvasState = content;
  // set current canvas id to it
  for (var i = 0; i < 3948; i++) {
    if (canvasState[i]) {
      var currSwatch = document.getElementById(i);
      var remove = currSwatch.classList[1];
      currSwatch.classList.remove(remove);
      console.log(canvasState[i]);
      currSwatch.classList.add(canvasState[i]);
    }
  }
}