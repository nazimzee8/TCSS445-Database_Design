// helper functions
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

function AgentBrain(gameEngine) {
    this.size = 4;
    this.previousState = gameEngine.grid.serialize();
    this.reset();
    this.score = 0;
};

AgentBrain.prototype.reset = function () {
    this.score = 0;
    this.grid = new Grid(this.previousState.size, this.previousState.cells);
};

// Adds a tile in a random position
AgentBrain.prototype.addRandomTile = function () {
    if (this.grid.cellsAvailable()) {
        var value = Math.random() < 0.9 ? 2 : 4;
        var tile = new Tile(this.grid.randomAvailableCell(), value);

        this.grid.insertTile(tile);
    }
};

AgentBrain.prototype.moveTile = function (tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
AgentBrain.prototype.move = function (direction) {
    // 0: up, 1: right, 2: down, 3: left
    var self = this;

    var cell, tile;

    var vector = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved = false;

    //console.log(vector);

    //console.log(traversals);

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            cell = { x: x, y: y };
            tile = self.grid.cellContent(cell);

            if (tile) {
                var positions = self.findFarthestPosition(cell, vector);
                var next = self.grid.cellContent(positions.next);

                // Only one merger per row traversal?
                if (next && next.value === tile.value && !next.mergedFrom) {
                    var merged = new Tile(positions.next, tile.value * 2);
                    merged.mergedFrom = [tile, next];

                    self.grid.insertTile(merged);
                    self.grid.removeTile(tile);

                    // Converge the two tiles' positions
                    tile.updatePosition(positions.next);

                    // Update the score
                    self.score += merged.value;

                } else {
                    self.moveTile(tile, positions.farthest);
                }

                if (!self.positionsEqual(cell, tile)) {
                    moved = true; // The tile moved from its original cell!
                }
            }
        });
    });
    //console.log(moved);
    if (moved) {
    //    this.addRandomTile();
    }
    return moved;
};

// Get the vector representing the chosen direction
AgentBrain.prototype.getVector = function (direction) {
    // Vectors representing tile movement
    var map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 },  // Right
        2: { x: 0, y: 1 },  // Down
        3: { x: -1, y: 0 }   // Left
    };

    return map[direction];
};

// Build a list of positions to traverse in the right order
AgentBrain.prototype.buildTraversals = function (vector) {
    var traversals = { x: [], y: [] };

    for (var pos = 0; pos < this.size; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
};

AgentBrain.prototype.findFarthestPosition = function (cell, vector) {
    var previous;

    // Progress towards the vector direction until an obstacle is found
    do {
        previous = cell;
        cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
             this.grid.cellAvailable(cell));

    return {
        farthest: previous,
        next: cell // Used to check if a merge is required
    };
};

AgentBrain.prototype.positionsEqual = function (first, second) {
    return first.x === second.x && first.y === second.y;
};

function Agent() {
};

Agent.prototype.getFreeCells = function(brain) {
    var freeCells = [];
    var emptyCells = brain.grid.availableCells();
    /*for (var x = 0; x < brain.grid.size; x++) {
        for (y = 0; y < brain.grid.size; y++) {
            if (brain.grid.cells[x][y] === null) {
                emptyCells.push({x: x, y: y});
            }
        }
    }*/
    for (var i = 0; i < emptyCells.length; i++) {
        var position = {x: emptyCells[i].x, y: emptyCells[i].y};
        freeCells.push(new Tile(position, 2));
        freeCells.push(new Tile(position, 4));
    }
    return freeCells;
}

Agent.prototype.getValidOptions = function(brain) {
    var validOptions = [];
    for (var i = 0; i < 4; i++) {
        if (brain.move(i)) {
            validOptions.push(i);
            brain.reset();
        }
    }
    return validOptions;
}

Agent.prototype.getMaxTile = function(brain) {
    var max = 0;
    var position;
    for (var x = 0; x < brain.grid.size; x++) {
        for (var y = 0; y < brain.grid.size; y++) {
            if (brain.grid.cells[x][y]!== null && max < brain.grid.cells[x][y].value) {
                max = Math.max(max, brain.grid.cells[x][y].value);
                var position = {x: x, y: y};
            }
        }
    }
    return {value: max, position: position};
}

Agent.prototype.emptyRow = function(brain, x) {
    for (y = 0; y < 4; y++) {
        if (brain.grid.cells[x][y] !== null) return false;
    }
    return true;
}

Agent.prototype.emptyColumn = function(brain, y) {
    for (x = 0; x < 4; x++) {
        if (brain.grid.cells[x][y] !== null) return false;
    }
    return true;
}

Agent.prototype.isMonotonic = function(brain) {
    var tile = this.getMaxTile(brain).value;
    var min = tile;
    var position = this.getMaxTile(brain).position;
    for (var x = position.x; x >= 0; x--) {
        if (brain.grid.cells[x][0] === null) {
            if (this.emptyRow(brain, x)) break;
            else return false;
        }
        else min = brain.grid.cells[x][0].value;
        for (y = 0; y < position.y; y++) {
            if (brain.grid.cells[x][y] !== null && min >= brain.grid.cells[x][y].value) min = brain.grid.cells[x][y].value;
            else if (brain.grid.cells[x][y] !== null && min < brain.grid.cells[x][y].value) return false;
        }
    }
    
    for (var y = 0; y < position.y; y++) {
        if (brain.grid.cells[position.x][y] === null) {
            if (this.emptyColumn(brain, y)) break;
            else return false;
        }
        else min = brain.grid.cells[position.x][y].value;
        for (var x = position.x; x >= 0; x--) {
            if (brain.grid.cells[x][y] !== null && min >= brain.grid.cells[x][y].value) min = brain.grid.cells[x][y].value;
            else if (brain.grid.cells[x][y] !== null && min < brain.grid.cells[x][y].value) return false;
        }
    }
    return true;
}

Agent.prototype.isMaxCorner = function(brain, max) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    var n = brain.grid.size-1;
    if (brain.grid.cells[0][0] !== null && max === brain.grid.cells[0][0].value) return true;
    else if (brain.grid.cells[0][n] !== null && max === brain.grid.cells[0][n].value) return true;
    else if (brain.grid.cells[n][0] !== null && max === brain.grid.cells[n][0].value) return true;
    else if (brain.grid.cells[n][n] !== null && max === brain.grid.cells[n][n].value) return true;
    else return false;
}

Agent.prototype.isMaxMiddle = function(brain, max) {
    for (var x = 1; x < 3; x++) {
        for (var y = 1; y < 3; y++) {
            if (brain.grid.cells[x][y] !== null && max === brain.grid.cells[x][y].value) return true;
        }
    }
    return false;
}

//count number of free spaces in each row.
//check bottom diaganol as to not shift the highest tile.
//make sure number of freespaces on row with highest tile (bottom or top) as zero.
//keep the highest tiles at the sides.

Agent.prototype.checkRows = function(brain, row) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    var emptyCells = 0;
    for (var x = 0; x < brain.grid.size; x++) {
        if (brain.grid.cells[x][row] === null) emptyCells++;
    }
    return emptyCells;
}

Agent.prototype.rightDiagonalTiles = function(brain, row) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    for (var x = 0; x < brain.grid.size; x++) {
        if (x < brain.grid.size && brain.grid.cells[x+1][row-1] === brain.grid.cells[x][row] && (this.checkRows(brain, row-1) + 1 === this.checkRows(brain, row))) return true;
    }
    return false;
}

Agent.prototype.leftDiagonalTiles = function(brain, row) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    for (var x = 0; x < grid.size; x++) {
        if (x > 0 && brain.grid.cells[x-1][row-1] === brain.grid.cells[x][row] && (this.checkRows(brain, row-1) + 1 === this.checkRows(brain, row))) return true;
    }
    return false;
}

//check number of sequential blocks in a row or column to evaluate magnitutde of score
Agent.prototype.checkAdjacentTiles = function(brain, x, y) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    var num = 0;
    if (x+1 < brain.grid.size && brain.grid.cells[x][y] !== null && brain.grid.cells[x+1][y] !== null && brain.grid.cells[x][y] === brain.grid.cells[x+1][y]) num++;
    else if (y+1 < brain.grid.size && brain.grid.cells[x][y] !== null && brain.grid.cells[x][y+1] !== null && brain.grid.cells[x][y].value === brain.grid.cells[x][y+1].value) num++;
    return num;
}

Agent.prototype.evalAdjacentTiles = function(brain) {
    //var grid = new Grid(brain.previousState.size, brain.previousState.cells);
    var num = 0;
    for (var x = 0; x < brain.grid.size; x++) {
        for (y = 0; y < brain.grid.size; y++) {
            num += this.checkAdjacentTiles(brain, x, y);
        }
    }
    return num;
}

Agent.prototype.weightedMatrix = function() {
    var weightedMatrix;
    /*for (x = 0; x < 4; x++) {
        weightedMatrix.push([]);
    }*/
    /*weightedMatrix = [
        [-10, -40, -40, -40],
        [30, 30, 10, -20],
        [60, 50, 30, -10],
        [100, 60, 30, 15]
    ]; */
    weightedMatrix = [
        [0, -100, -200, -500],
        [80, 40, 0, -40],
        [200, 80, 40, 0],
        [500, 200, 80, 40]
    ];
    /*weightedMatrix = [
        [100, 0, -100, -500],
        [200, 100, 0, -100],
        [300, 200, 100, 0],
        [500, 300, 200, 100]
    ];*/
    //weightedMatrix[0].push(-40);
    //weightedMatrix[0].push(-40)

    /*weightedMatrix[0].push([-10, -40, -40, -40]);
    weightedMatrix[1].push([30, 30, 10, -20]);
    weightedMatrix[2].push([60, 50, 30, -10]);
    weightedMatrix[3].push([100, 60, 30, 15]);*/
    return weightedMatrix;
}

Agent.prototype.expectimax = function(gameManager, depth, chance) {
    var brain = new AgentBrain(gameManager);
    var freeCells = this.getFreeCells(brain);
    var validOptions = this.getValidOptions(brain);
    if (depth === 0) {
        var value = this.evaluateGrid(brain);
        return value;
    } 
    else {
        var value;
        var total = 0;
        var max = -Infinity;
        if (chance) {
            for (var i = 0; i < freeCells.length; i++) {
                brain.grid.insertTile(freeCells[i]);
                if (freeCells[i].value === 2) value = 0.9 * 0.5/(freeCells.length) * this.expectimax(brain, depth-1, false);
                else value = 0.1 * 0.5/(freeCells.length) * this.expectimax(brain, depth-1, false);
                total += value;
                brain.grid.removeTile(freeCells[i]);
            }
            return total;
        }
        else {
            for (var i = 0; i < validOptions.length; i++) {
                brain.move(validOptions[i]);
                value = this.expectimax(brain, depth-1, true);
                max = Math.max(max, value);
                brain.reset();
             }
             return max;
        }
    }
}

Agent.prototype.selectMove = function (gameManager) {
    var brain = new AgentBrain(gameManager);
    var validOptions = this.getValidOptions(brain);
    var bestMove = null;
    var max = -Infinity;
    var depth = 4;
    for (var i = 0 ; i < validOptions.length; i++) {
        brain.move(validOptions[i]);
        var value = this.expectimax(brain, depth, true);
        if (max < value) {
            max = Math.max(max, value);
            bestMove = validOptions[i];
        }
        brain.reset();
    }
    if (bestMove === null) {
        for (var i = 0; i < 4; i++) {
            if (brain.move(i)) return i;
        }
    }
    else return bestMove;
};

Agent.prototype.evaluateGrid = function (brain) {
    // calculate a score for the current grid configuration\
    var score = 0;
    var freeCells = this.getFreeCells(brain);
    var weightedMatrix = this.weightedMatrix();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (brain.grid.cells[i][j] === null) score += 500;
            else score += brain.grid.cells[i][j].value * weightedMatrix[i][j];
        }
    }
    if (freeCells.length/2 <= 3) score -= 1000;
    //score += freeCells.length/2 * 40;
    return score;
};
