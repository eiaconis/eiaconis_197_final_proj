var mongo = require ('./mongo');

module.exports = {
  getCanvasData: function (title, callback) {
    mongo.Canvas.findOne({title: title}).exec(function (error, canvas) {
      callback(error, canvas);
    });
  },

  saveCanvas: function (canvasData, callback) {
    var canvas = new mongo.Canvas(canvasData);
    canvas.save(function (error) {
      callback(error);
    });
  },

  getCanvasesForUser: function (userId) {
  	mongo.Canvas.find({ author: userId });
  }

};


