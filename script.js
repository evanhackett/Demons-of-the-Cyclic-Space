'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

// grid constructor
function Grid(width, height, ctx) {

  // create grid structure (2d array).

  // color cell function is a public method for filling in cell at (x,y) with color
  var colorCell = function(x, y, color) {
    // TODO: calculate how to fill in a cell based on the Grid width and height
    ctx.fillRect(x,y,1,1);
  }

  // return public api
  return {
    colorCell: colorCell
  };
}


// construct 3x3 grid object
var grid = Grid(3, 3, ctx);
grid.colorCell(2,2);
