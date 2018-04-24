$(document).ready(function () {
	console.log("loading canvas")
  var $canvasElement = $('#canvas-builder');
  var builder = new CanvasBuilder($canvasElement);
  builder.setupPalette();
  builder.setupCanvas();
});