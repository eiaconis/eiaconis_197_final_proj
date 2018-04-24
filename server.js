// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. However, currently it does not
// actually have any websocket functionality - that part is your job!

/*var http = require('http');
var io = require('socket.io');

var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');
};

var server = http.createServer(requestListener);

server.listen(8080, function () {
  console.log('Server is running...');
});

var socketServer = io(server);


socketServer.on('connection', function (socket) {
  
  /*socket.emit('here_are_the_current_questions', questions);

  socket.on('add_new_question', function (data) {
    questions[ind] = { 
      text : data.text, 
      answer : '',
      author : socket.id,
      id : ind };
    socketServer.emit('new_question_added', questions[ind]);
    ind++;
  });

  socket.on('get_question_info', function (id) {
    if (questions[id]) {
      socket.emit('question_info', questions[id]);
    } else {
      socket.emit('question_info', null);
    }
  });

  socket.on('add_answer', function (newAnswer) {
    questions[newAnswer.id].answer = newAnswer.answer;
    socket.broadcast.emit('answer_added', questions[newAnswer.id]);
  });

}); */