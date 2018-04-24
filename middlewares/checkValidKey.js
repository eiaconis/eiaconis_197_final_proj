var keysDb = require('../db/key');

// This function checks if a given API key is valid.
// The callback has type function (err, isValid) where:
// 1. err is some database error if one was thrown during lookup, otherwise null/undefined
// 2. isValid is a boolean indicating whether the key is valid
var isAPIKeyValid = function (apiKey, callback) {
  keysDb.containsKey(apiKey, callback);
};

var checkValidKey = function (req, res, next) {
  var currKey = req.query.key; 
  var validate = isAPIKeyValid(currKey, function (err, isValid) {
    if (isValid) {
      next();
    } else if (err) {
      next(err);
    } else {
      res.status(403);
      next(new Error('Invalid key'));
    }
  });

}; 


module.exports = checkValidKey;
