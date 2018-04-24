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

  addCanvas: function(currId, id, callback) {
    mongo.User.findOne({_id: currId}).exec(function (error, user) {
      user.canvases.push(id);
      user.save(function(error) {
        callback(error, user);
      })
    });
  },

  getUserByUsername: function(username, callback) {
    mongo.User.findOne({username: username}).exec(function (error, reviews) {
      callback(error, reviews);
    });
  },

  getUserById: function(id, callback) {
    mongo.User.findOne({_id: id}).exec(function (error, user) {
      callback(error, user);
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

