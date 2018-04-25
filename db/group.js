var mongo = require ('./mongo');

module.exports = {
  getGroup: function (id, callback) {
    mongo.Group.findOne({_id: id}).exec(function (error, group) {
      callback(error, group);
    });
  },

  addGroup: function (groupData, callback) {
    var group = new mongo.Group(groupData);
    group.save(function (error, saved) {
      console.log(saved);
      callback(error, saved);
    });
  }, 

  getAllGroups: function (callback) {
    mongo.Group.find(function (error, users) {
      console.log(error);
      callback(error, users);
    });
  }, 

  removeAll : function() {
    mongo.Group.remove( function(err) {
      console.log(err);
    });
  }

};

