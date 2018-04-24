var express = require('express');
var app = express();
var uuid = require('node-uuid');

// Required Middlewares and Routers
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var router = require('./routes/index');
var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var isAuthenticated = require('./middlewares/isAuthenticated');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

app.use(cookieSession({
  secret: generateCookieSecret()
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);
app.use('/home', isAuthenticated, router);

// Mount your error-handling middleware.
app.use(handleError);
app.use(pageNotFound);


module.exports = app;
