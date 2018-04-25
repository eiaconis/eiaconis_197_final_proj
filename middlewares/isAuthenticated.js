
var isAuthenticated = function (req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect('/home');
    next();
  } else {
    res.redirect('/');
  }
}; 


// Export the middleware function for use in app.js
module.exports = isAuthenticated;
