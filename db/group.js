var mongo = require ('./mongo');

module.exports = {
  getGroup: function (id, callback) {
    mongo.Group.findOne({_id: id}).exec(function (error, group) {
      callback(error, group);
    });
  },

  addGroup: function (groupData, callback) {
    var group = new mongo.Group(groupData);
    group.save(function (error) {
      callback(error);
    });
  },

  getAllGroups: function (currUserId, callback) {
    mongo.Group.find({users:currUserId}, function (error, groups) {
      callback(error, groups);
    });
  }
};

