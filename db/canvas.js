var mongo = require ('./mongo');

module.exports = {
  
  getAllCanvases: function (callback) {
    mongo.Canvas.find(function (error, canvases) {
      callback(error, canvases);
    });
  },

  getCanvasData: function (title, callback) {
    mongo.Canvas.findOne({title: title}).exec(function (error, canvas) {
      console.log('canvas found : ' + canvas);
      callback(error, canvas);
    });
  },

  saveCanvas: function (canvasData, callback) {
    var canvas = new mongo.Canvas(canvasData);
    canvas.save(function (error, savedCanvas) {
      callback(error, savedCanvas);
    });
  },

  getCanvasesForUser: function (userId) {
  	mongo.Canvas.find({ author: userId });
  }

};


