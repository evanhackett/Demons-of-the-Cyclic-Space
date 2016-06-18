'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

// grid constructor
function Grid(resolution, canvas) {

  // create grid structure (2d array). fill grid with arrays of length resolution which are filled with 0
  var grid = _.map(_.range(resolution), function() {
    return _.fill(_.range(resolution), 0);
  });


  // color cell function is a public method for filling in cell at (x,y) with color
  var colorCell = function(x, y, color) {
    // calculate dimensions of a cell based on the Grid resolution and canvas resolution
    var cell_size = canvas.resolution / resolution;

    canvas.ctx.fillStyle = "rgb("+color.r+","+color.g+","+color.b+")";
    canvas.ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
  }

  // assigns the 2d array representing the state of the next iteration to grid
  var nextState = function(cb) {
    // map over each cell, passing the position, value, and neighbors of the cell to the callback function
    // callback function needs to return a cell value
    grid = _.map(grid, function(cells, i) {
      return _.map(cells, function(value, j) {
        return cb({
          position: {x: i, y: j},
          value: value,
          neighbors: getNeighbors(i,j)
        });
      });;
    });
  };

  function getNeighbors(x,y) {
    // each cell has 8 neighbors.
    var neighbors = [];

    // upper-left
    neighbors.push(createNeighbor(x-1, y-1));
    // upper-mid
    neighbors.push(createNeighbor(x, y-1));
    // upper-right
    neighbors.push(createNeighbor(x+1, y-1));
    // mid-left
    neighbors.push(createNeighbor(x-1, y));
    // mid-right
    neighbors.push(createNeighbor(x+1, y));
    // lower-left
    neighbors.push(createNeighbor(x-1, y+1));
    // lower-mid
    neighbors.push(createNeighbor(x, y+1));
    // lower-right
    neighbors.push(createNeighbor(x+1, y+1));

    function createNeighbor(x, y) {
      // We have to wrap around when neighbors are beyond the edge.
      var n_x, n_y; // neighbor-x, neighbor-y

      if (x < 0) {
        n_x = grid.length-1;
      } else if (x >= grid.length-1) {
        n_x = 0;
      } else {
        n_x = x;
      }

      if (y < 0) {
        n_y = grid.length-1;
      } else if (y >= grid.length-1) {
        n_y = 0;
      } else {
        n_y = y;
      }

      return {
        x: n_x,
        y: n_y,
        value: grid[n_x][n_y]
      };
    }

    return neighbors;
  }

  var initialize = function() {
    //set some default values
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        grid[i][j] = _.random(0, 11);
      }
    }
  };

  var each = function(cb) {
    _.each(grid, cb);
  };

  // return public api
  return {
    colorCell: colorCell,
    nextState: nextState,
    initialize: initialize,
    each: each
  };
}


function draw(grid) {
  // clear canvas
  ctx.clearRect(0,0, canvas.width, canvas.height);

  grid.each(function(cells, i) {
    _.each(cells, function(cell_value, j) {
      grid.colorCell(i, j, getCellColor(cell_value));
    });
  });

  function getCellColor(value) {
    // currently hardcoding in 8 possible values. 0-n where n=8
    var map = {
      0 : {r: 0, g: 0, b: 0},
      1 : {r: 0, g: 0, b: 255},
      2 : {r: 0, g: 255, b: 0},
      3 : {r: 0, g: 255, b: 255},
      4 : {r: 255, g: 0, b: 0},
      5 : {r: 255, g: 0, b: 255},
      6 : {r: 255, g: 255, b: 0},
      7 : {r: 255, g: 255, b: 255},
      8 : {r: 127, g: 127, b: 255},
      9 : {r: 255, g: 255, b: 127},
      10 : {r: 0, g: 127, b: 255},
      11 : {r: 255, g: 127, b: 0},
    };
    return map[value];
  }
}

// construct an nxn grid object
var grid = Grid(200, {ctx: ctx, resolution: width});
grid.initialize();
// draw(grid);

var start = null;

function iterate(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  var random_on = Math.floor(progress / 10000) % 2 === 0 ? true : false;


  draw(grid);
  grid.nextState(function(cell) {
    // loop through neighbors and check for successor
    var predicate = function(neighbor) {
      if (cell.value === 11) {
        return neighbor.value === 0;
      }
      return neighbor.value === cell.value + 1;
    };
    // randomly decide if change should even take place, only if random_on is true
    if (random_on && _.random(1) === 1) {
      return cell.value;
    }
    if (_.filter(cell.neighbors, predicate).length > 0) {
      // if there is a successor, the cell is "consumed", it's value is incremented
      return cell.value === 11 ? 0 : cell.value + 1; // have to wrap when successor equals n
    }
    return cell.value;
  });

  requestAnimationFrame(iterate);

}

iterate();
