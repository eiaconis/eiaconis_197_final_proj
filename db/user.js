var mongo = require ('./mongo');

module.exports = {

  getAllUsers: function (callback) {
    mongo.User.find(function (error, users) {
      callback(error, users);
    });
  },

  addUser: function (userData, callback) {
    var user = new mongo.User(userData);
    user.save(function (error) {
      callback(error, user);
    });
  },

  getUserByUsername: function(username, callback) {
    mongo.User.findOne({username: username}).exec(function (error, reviews) {
      callback(error, reviews);
    });
  },

  checkPassword: function (username, password, callback) {
    mongo.User.findOne({username: username, password: password }, function (error, res) {
      if (error) {
        callback(error);
      } if (!res) {
        callback(null, null);
      }
      else {
        callback(null, res);
      }
    });
  }

};

