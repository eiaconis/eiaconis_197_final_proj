
var isAuthenticated = function (req, res, next) {
  console.log("checking for auth");
  if (req.session.isAuthenticated) {
    res.redirect('/home');
    next();
  } else {
    res.redirect('/');
  }
}; 


// Export the middleware function for use in app.js
module.exports = isAuthenticated;
