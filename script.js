'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

// grid constructor
function Grid(resolution, canvas) {

  // create grid structure (2d array).
  var grid = [];
  grid.length = resolution;

  _.fill(grid, _.fill(([]).length = resolution, 0)) // fill grid with arrays of length resolution which are filled with 0

  // color cell function is a public method for filling in cell at (x,y) with color
  var colorCell = function(x, y, color) {
    // calculate dimensions of a cell based on the Grid resolution and canvas resolution
    var cell_size = canvas.resolution / resolution;

    canvas.ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
  }

  // return public api
  return {
    colorCell: colorCell
  };
}


// construct an nxn grid object
var grid = Grid(5, {ctx: ctx, resolution: width});
grid.colorCell(0,2);
