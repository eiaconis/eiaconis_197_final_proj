#!/usr/bin/env node
// start the server
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d', server.address().port);
});
