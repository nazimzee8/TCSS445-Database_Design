var board = [];
var startX = Math.floor(26/2)-1;
var startY = Math.floor(29/2)-1;
var startNode = new Node(startX, startY, false);
var startPacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
var bubbleCount = 0;
var superBubbleCount = 0;
var nullSpaces = 0;
var emptySpaces;
var TOTAL_SPACES = 26*29;
var continues = true;
board = buildGameboard(board, startNode, startX, startY, 26, 29, width*depth);

for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
  var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
  var y = parseInt(bubbleParams[0]) - 1;
  var x = parseInt(bubbleParams[1]) - 1;
  var type = bubbleParams[2];
  var eaten = parseInt(bubbleParams[3]);
  if (type === "b") {
    board[x][y].bubble = true;
    bubbleCount++;
  } else {
    board[x][y].superBubble = true;
    superBubbleCount++;
  }
  if(eaten === 0) {
    board[x][y].eaten = false;
  } else {
    board[x][y].eaten = true;
  if (!checkSpots(x, y))
    nullSpaces++;

var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
if(p.x >= 0 && p.x < 26 && board[p.x][p.y]) board[p.x][p.y].inky = true;
p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
if (p.x >= 0 && p.x < 26 && board[p.x][p.y]) board[p.x][p.y].pinky = true;
p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
if (p.x >= 0 && p.x < 26 && board[p.x][p.y]) board[p.x][p.y].blinky = true;
p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
if (p.x >= 0 && p.x < 26 && board[p.x][p.y]) GAMEBOARD[p.x][p.y].clyde = true;

p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pacman = true;

};

selectMove(board[startPacman.i][startPacman.j]);

class Node {
  constructor(i, j, path, weight, created) {
    this.i = i;
    this.j = j;
    this.searched = false;
    this.created = created;
    this.checked = false;
    this.visited = 0;
    this.left = null;
    this.right = null;
    this.north = null;
    this.south = null;
    this.bubble = false;
    this.superBubble = false;
    this.inky = false;
    this.pinky = false;
    this.blinky = false;
    this.clyde = false;
    this.pacman = false;
    this.eaten = false;
    this.path = path;
    this.weight = weight;
  }

  constructor(i, j, left, right, north, south, path, weight, created) {
    this.i = i;
    this.j = j;
    this.searched = false;
    this.created = created;
    this.checked = false;
    this.visited = 0;
    this.bubble = false;
    this.superBubble = false;
    this.inky = false;
    this.pinky = false;
    this.blinky = false;
    this.clyde = false;
    this.pacman = false;
    this.eaten = false;
    this.left = left;
    this.right = right;
    this.north = north;
    this.south = south;
    this.path = path;
    this.weight = weight;
  }
}

class Path {
  constructor() {
    this.directions = [];
    this.length = 0;
    this.hasGhost = false;
    this.distToSuperBubble = 0;
    this.distToGhost = 0;
  }
  push (option) {
    this.directions.push(option);
    this.length++;
  }
  pop (option) {
    this.directions.pop(option);
    this.length--;
  }
}

const fleeOptions = {
  options: 0,
  direction: 0
}

getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);
  return {x: i, y: j};
}

/*getNodeI = function(node, x) {
  var i = BUBBLES_GAP * x
}*/

buildGameboard = function(board = [], startNode, i, j, width, depth, Accumulator = width * depth) {
  if (Accumulator === 0) {
    return board;
  }
  left = null;
  right = null;
  north = null;
  south = null;
  let node;
  if (i > 0 && !board[i][j].left.created && checkSpots(i-1, j)) {
    left = new Node(i-1, j, false);
  }
  else if (i > 0 && board[i][j].left.created && checkSpots(i-1, j)) {
    left = board[i][j].left;
  }
  if (i < width-1 && !board[i][j].right.created && checkSpots(i+1, j)) {
    right = new Node(i+1, j, false);
  }
  else if (i < width-1 && board[i][j].right.created && checkSpots(i+1, j)) {
    right = board[i][j].right;
  }
  if (j > 0 && !board[i][j].north.created && checkSpots(i, j-1)) {
    north = new Node(i, j-1, false);
  }
  else if (j > 0 && board[i][j].north.created && checkSpots(i, j-1)) {
    north = board[i][j].north;
  }
  if (j < depth-1 && !board[i][j].south.created && checkSpots(i, j+1)) {
    south = new Node(i, j+1, false);
  }
  else if (j < depth-1 && board[i][j].south.created && checkSpots(i, j+1)) {
    south = board[i][j].south;
  }
  node = new Node(i, j, left, right, north, south, true);

  if (left === null)
    nullSpaces++;
  if (right === null)
    nullSpaces++;
  if (north === null)
    nullSpaces++;
  if (south === null)
    nullSpaces++;

  node.left.right = node;
  node.right.left = node;
  node.south.north = node;
  node.north.south = node;
  board[i][j] = node;
  if (left != null && !left.created) {
    buildGameBoard(board, left, i-1, j, width, depth, Accumulator-1);
  }
  if (right != null && !right.created) {
    buildGameBoard(board, right, i+1, j, width, depth, Accumulator-1);
  }
  if (north != null && !north.created) {
    buildGameBoard(board, north, i, j-1, width, depth, Accumulator-1);
  }
  if (south != null && !south.created) {
    buildGameBoard(board, south, i, j+1, width, depth, Accumulator-1);
  }
} 

//function allNodesVisited()

//var GAMEBOARD = [];
  /*for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
          GAMEBOARD[i][j] = new Node();
      }
    }
  }*/

  function checkSpots(i, j) {
  /*for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) { 
      var left = board[i][j].left;
      var right = board[i][j].right;
      var north = board[i][j].north;
      var south = board[i][j].south; */
      if((i === 0 && (j === 13)) ||
      (i === 1 && (j === 13)) ||
      (i === 2 && (j === 13)) ||
      (i === 3 && (j === 13)) ||
      (i === 4 && (j === 13)) ||
      (i === 6 && (j === 13)) ||
      (i === 7 && (j === 13)) ||
      (i === 8 && (j >= 10 && j <= 18)) ||
      (i === 9 && (j === 10 || j === 16)) ||
      (i === 10 && (j === 10 || j === 16)) ||
      (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 12 && (j === 10 || j === 16)) ||
      (i === 13 && (j === 10 || j === 16)) ||
      (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 15 && (j === 10 || j === 16)) ||
      (i === 16 && (j === 10 || j === 16)) ||
      (i === 17 && (j >= 10 && j <= 18)) ||
      (i === 18 && (j === 13)) ||
      (i === 19 && (j === 13)) ||
      (i === 21 && (j === 13)) ||
      (i === 22 && (j === 13)) ||
      (i === 23 && (j === 13)) ||
      (i === 24 && (j === 13)) ||
      (i === 25 && (j === 13)))  {
        return true;
        /* GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };*/
      }
      else {
        return false;
      }
  }

function drawRect(i,j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
  var y = BUBBLES_Y_START + j*ygap- 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if(GAMEBOARD && GAMEBOARD[0] && GAMEBOARD[i][j]){
    ctx.strokeStyle = "green";
    ctx.rect(x,y,w,h);
    ctx.stroke();
  }
}

function drawDebug() {
  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      drawRect(i,j);
    }
  }
}

function selectMove() {

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

        var directions = [];
        for (var i = 1; i < 5; i++) {
            if (canMovePacman(i)) 
              directions.push(i);
        }

        if (directions.length > 2 || !PACMAN_MOVING){
           movePacman(directions[Math.floor(Math.random() * directions.length)]);
        }
    }
};

var minPath = new Path();
var allPaths = []; 
var minGhostPath = new Path();
var allGhostPaths = [];
var nullSuperBubbles = TOTAL_SPACES - superBubbleCount;
/*var maxGhostPath = new Path();
var allGhostPaths = [];
var numOfGhosts = 4;*/

function resetPaths() {
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      board[i][j].searched = false;
    }
  }
}

function checkForPacman(node) {
  var pacmanXY = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (node.i === pacmanXY.i && node.j === pacmanXY.j) {
    node.pacman = true;
  }
  else 
    node.pacman = false;
}

function hasPacman(node) {
  if (node.pacman) {
    return true;
  }
  else
    return false;
}

function checkForGhost(node) {
  var blinkyXY = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
  var pinkyXY = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
  var inkyXY = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
  var clydeXY = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
  if (node.i === blinkyXY.i && node.j === blinkyXY.j) {
    node.blinky = true;
  }
  else
    node.blinky = false;
  if (node.i === pinkyXY.i && node.j === pinkyXY.j) {
    node.pinky = true;
  }
  else
    node.pinky = false;
  if (node.i === inkyXY.i && node.j === inkyXY.j) {
    node.inky = true;
  }
  else
    node.inky = false;
  if (node.i === clydeXY.i && node.j === clydeXY.j) {
    node.clyde = true;
  }
  else
    node.clyde = false;
  board[node.i][node.j] = node;
}

function hasGhost(node) {       
  if (node.blinky || node.inky || node.pinky || node.clyde)
    return true;
  else
    return false;
}

function fleeBlinky(node) {
  var blinkyXY = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
  var x = blinkyXY.i;
  var y = blinkyXY.j;
  var direction = GHOST_BLINKY_DIRECTION;
  if (node.i === x && board[x][y].right != null && board[x][y].left != null) {
    return {flee: true, moveTo: direction}
  }
  else if (node.j === y && board[x][y].south != null && board[x][y].north != null) {
    return {flee: true, moveTo: direction}
  }
  else
    return false;
}

function fleePinky(node) {
  var pinkyXY = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
  var x = pinkyXY.i;
  var y = pinkyXY.j;
  var direction = GHOST_PINKY_DIRECTION;
  if (node.i === x && board[x][y].right != null && board[x][y].left != null) {
    return {flee: true, moveTo: direction}
  }
  else if (node.j === y && board[x][y].south != null && board[x][y].north != null) {
    return {flee: true, moveTo: direction}
  }
  else
    return false;
}

function fleeInky(node) {
  var inkyXY = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
  var x = inkyXY.i;
  var y = inkyXY.j;
  var direction = GHOST_INKY_DIRECTION;
  if (node.i === x && board[x][y].right != null && board[x][y].left != null) {
    return {flee: true, moveTo: direction};
  }
  else if (node.j === y && board[x][y].south != null && board[x][y].north != null) {
    return {flee: true, moveTo: direction}
  }
  else
    return false;
}

function fleeClyde(node) {
  var clydeXY = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
  var x = clydeXY.i;
  var y = clydeXY.j;
  var direction = GHOST_CLYDE_DIRECTION;
  if (node.i === x && board[x][y].right != null && board[x][y].left != null) {
    return {flee: true, moveTo: direction};
  }
  else if (node.j === y && board[x][y].south != null && board[x][y].north != null) {
    return {flee: true, moveTo: direction};
  }
  else
    return false;
}

const numOfNearGhosts = node => {
  var num = 0;
  if (fleeBlinky(node))
    num++;
  if (fleePinky(node))
    num++;
  if (fleeInky(node)) 
    num++;
  if (fleeClyde(node))
    num++; 
  return num;
}

var ghostReached = false;

function tracePathToGhost(node, path) {
  var right = path;
  var south = path;
  var left = path;
  var north = path;
  if (node.superBubble) {
    if (hasGhost(node)) {
      allGhostPaths.push(path);
      return allGhostPaths;
    }
    if (node.right != null && !ghostReached)
      right.distToGhost++;
      if (hasGhost(node.right)) {
        ghostReached = true;
      }
      tracePathToGhost(node.right, right);
    if (node.south != null && !ghostReached)
      south.distToGhost++;
      if (hasGhost(node.south)) {
        ghostReached = true;
      }
      tracePathToGhost(node.south, south);
    if (node.left != null && !ghostReached) 
      left.distToGhost++;
      if (hasGhost(node.left)) {
        ghostReached = true;
      }
      tracePathToGhost(node.left, left);
    if (node.north != null && !ghostReached)
      north.distToGhost++;
      if (hasGhost(node.north)) {
        ghostReached = true;
      }
      tracePathToGhost(node.north, north);
  }
}

function selectMove(node) {
  var traverse = false;
  checkForPacman(node);
  checkForPacman(node.right);
  checkForPacman(node.south);
  checkForPacman(node.left);
  checkForPacman(node.north);

  checkForGhost(node);
  checkForGhost(node.right);
  checkForGhost(node.south);
  checkForGhost(node.left);
  checkForGhost(node.north);
  if (hasGhost(node) && hasPacman(node)) {
    PACMAN_DEAD = true;
    PACMAN_GAMEOVER = true;
    return;
  }
  if (!PACMAN_DEAD && !GAMEOVER) {
    if (node.bubble) {
      node.bubble = false;
      node.eaten = true;
      bubbleCount--;
      emptySpaces++;
    }
    if (node.superBubble) {
      node.superBubble = false;
      node.eaten = true;
      superBubbleCount--;
      emptySpaces++;
    }
    board[node.i][node.j] = node;

    resetPaths();
    if (numOfNearGhosts(node) > 0) {
      allPaths = possibleCloseSuperBubbles(node);
    }
    else {
      allPaths = possibleCloseBubbles(node);
    }
    allPaths = possibleCloseBubbles(node);
    minPath = closestPath();


    if (canMovePacman(1) && node.right != null && !hasGhost(node.right) && !PACMAN_MOVING && !traverse && minPath.pop() === 1 && continues) {
      traverse = true;
      movePacman(1);
      if (hasGhost(node.right) && hasPacman(node.right)) {
        continues = false;
      }
      selectMove(node.right);
    } 
    else if (canMovePacman(2) && node.south != null && !hasGhost(node.south) && !PACMAN_MOVING && !traverse && minPath.pop() === 2 && continues) {
      traverse = true;
      movePacman(2);
      if (hasGhost(node.south) && hasPacman(node.south)) {
        continues = false;
      }
      selectMove(node.south)
    } 
    else if (canMovePacman(3) && node.left != null && !hasGhost(node.left) && !PACMAN_MOVING && !traverse && minPath.pop() === 3 && continues) {
      traverse = false;
      movePacman(3);
      if (hasGhost(node.left) && hasPacman(node.left)) {
        continues = false;
      }
      selectMove(node.left)
    }
    else if (canMovePacman(4) && node.north != null && !hasGhost(node.north) && !PACMAN_MOVING && !traverse && minPath.pop() === 4 && continues) {
      traverse = true;
      movePacman(4);
      if (hasGhost(node.north) && hasPacman(node.north)) {
        continues = false;
      }
      selectMove(node.north)
    }
  }
}

function closestPath() {
  var min = Infinity;
  var minPath = new Path();
  var temp = new Path();
  for (var i = allPaths.length-1; i >= 0; i++) {
    if (min > allPaths[i].length && !allPaths[i].hasGhost) {
      min = allPaths[i].length;
      temp = allPaths[i];
    }
    allPaths.pop();
  }
  for (var index = temp.length-1; index >= 0; index++) {
    minPath[temp.length-1 - index] = temp[index];
  }
  return minPath;
}

function possibleCloseBubbles(node) {
  emptySpaces = TOTAL_SPACES - nullSpaces - bubbleCount - superBubbleCount;
  possibleCloseBubbles(node, new Path(), emptySpaces)
}

function possibleCloseBubbles(node, path, Accumulator) {
  var pathFinished = false;
  var min = infinity;
  right = path;
  south = path;
  left = path;
  north = path;
  checkForGhost(node.right);
  checkForGhost(node.south);
  checkForGhost(node.left);
  checkForGhost(node.north);
  if (node.right.bubble) {
    right.push(1);
    allPaths.push(right);
    pathFinished = true;
  }
  if (node.south.bubble || node.south) {
    south.push(2);
    allPaths.push(south);
    pathFinished = true;
  }
  if (node.left.bubble || node.left) {
    left.push(3);
    allPaths.push(left);
    pathFinished = true;
  }
  if (node.north.bubble || node.north) {
    north.push(4);
    allPaths.push(north);
    pathFinished = true;
  }

  if (Accumulator === 0) {
    return allPaths;
  }
  while (!pathFinished) {
  if (canMovePacman(1) && node.right != null && !node.right.bubble && !node.right.searched) {
    traverse = true;
    right.push(1);
    right.length++;
    node.right.searched = true;
    if (hasGhost(node.right)) {
      right.hasGhost = true;
    }
    possibleCloseBubbles(node.right, right, Accumulator-1)
  } 
  if (canMovePacman(2) && node.south != null && !node.south.bubble && !node.south.searched) {
    traverse = true;
    south.push(2);
    south.length++;
    node.south.searched = true;
    if (hasGhost(node.south)) {
      south.hasGhost = true;
    }
    possibleCloseBubbles(node.south, south, Accumulator-1)
  } 
  if (canMovePacman(3) && node.left != null && !node.left.bubble && !node.left.searched) {
    traverse = true;
    left.push(3);
    left.length++;
    node.left.searched = true;
    if (hasGhost(node.left)) {
      left.hasGhost = true;
    }
    possibleCloseBubbles(node.left, left, Accumulator-1)
  }
  if (canMovePacman(4) && node.north != null && !node.north.bubble && !node.north.searched) {
    traverse = true;
    north.push(4);
    north.length++;
    node.north.searched = true;
    if (hasGhost(node.north)) {
      north.hasGhost = true;
    }
    possibleCloseBubbles(node.north, north, Accumulator-1)
  }
}
}

possibleCloseSuperBubbles(node) {
  //nonSuperBubbles = emptySpaces + bubbleCount;
  possibleCloseSuperBubbles(node, new Path(), TOTAL_SPACES-nullSpaces-superBubbleCount)
}

possibleCloseSuperBubbles(node, path, Accumulator) {
  var nonSuperBubbles = emptySpaces + bubbleCount;
  var pathFinished = false;
  var min = infinity;
  right = path;
  south = path;
  left = path;
  north = path;
  checkForGhost(node.right);
  checkForGhost(node.south);
  checkForGhost(node.left);
  checkForGhost(node.north);
  if (node.right.superBubble) {
    right.push(1);
    allPaths.push(right);
    pathFinished = true;
    tracePathToGhost(node);
  }
  if (node.south.superBubble) {
    south.push(2);
    allPaths.push(south);
    pathFinished = true;
    tracePathToGhost(node);
  }
  if (node.left.superBubble) {
    left.push(3);
    allPaths.push(left);
    pathFinished = true;
    tracePathToGhost(node);
  }
  if (node.north.superBubble) {
    north.push(4);
    allPaths.push(north);
    pathFinished = true;
    tracePathToGhost(node);
  }

  if (Accumulator === 0) {
    return allPaths;
  }
  while (!pathFinished) {
  if (canMovePacman(1) && node.right != null && !node.right.superBubble && !node.right.searched) {
    traverse = true;
    right.push(1);
    right.length++;
    right.distToSuperBubble++;
    node.right.searched = true;
    if (hasGhost(node.right)) {
      right.hasGhost = true;
    }
    possibleCloseSuperBubbles(node.right, right, Accumulator-1)
  } 
  if (canMovePacman(2) && node.south != null && !node.south.superBubble && !node.south.searched) {
    traverse = true;
    south.push(2);
    south.length++;
    south.distToSuperBubble++;
    node.south.searched = true;
    if (hasGhost(node.south)) {
      south.hasGhost = true;
    }
    possibleCloseSuperBubbles(node.south, south, Accumulator-1)
  } 
  if (canMovePacman(3) && node.left != null && !node.left.superBubble && !node.left.searched) {
    traverse = true;
    left.push(3);
    left.length++;
    left.distToSuperBubble++;
    node.left.searched = true;
    if (hasGhost(node.left)) {
      left.hasGhost = true;
    }
    possibleCloseSuperBubbles(node.left, left, Accumulator-1)
  }
  if (canMovePacman(4) && node.north != null && !node.north.superBubble && !node.north.searched) {
    traverse = true;
    north.push(4);
    north.length++;
    north.distToSuperBubble++;
    node.north.searched = true;
    if (hasGhost(node.north)) {
      north.hasGhost = true;
    }
    possibleCloseSuperBubbles(node.north, north, Accumulator-1)
  }
}
}

setInterval(drawDebug, 1000/3);
