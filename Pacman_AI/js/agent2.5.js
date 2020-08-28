var GAMEBOARD = [];
var startPacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
var bubbleCount = 0;
var superBubbleCount = 0;
var nullSpaces = 0;
var emptySpaces;
var TOTAL_SPACES = 26 * 29;
var continues = true;
var listNodes = [];
var path = [];
var allQueues = [];
var ghostQueues = [];
var targetNode = new Node(-1, -1, true);

var pacNode = new Node(-1, -1, true);
var blinkyNode = new Node(-1, -1, true);
var pinkyNode = new Node(-1, -1, true);
var inkyNode = new Node(-1, -1, true);
var clydeNode = new Node(-1, -1, true);

class Node {
  constructor(i, j, created) {
    this.i = i;
    this.j = j;
    this.searched = false;
    this.created = created;
    this.checked = false;
    this.visited = false;
    this.target = false;
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
    this.index = -1;
  }

  constructor(i, j, left, right, north, south, created) {
    this.i = i;
    this.j = j;
    this.searched = false;
    this.created = created;
    this.visited = false;
    this.target = false;
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
    this.index = -1;
  }
}

/*
class Path {
  constructor() {
    this.queue = [];
    this.ghostQueue = [];
    this.weight = 0;
    this.ghostWeight = 0;
  }
  push (option) {
    this.queue.push(option);
    this.weight++;
  }
  pop () {
    this.queue.pop();
    this.weight--;
  }
  pushGhost(option) {
    this.ghostQueue.push(option);
    this.ghostWeight++;
  }
  popGhost() {
    this.ghostQueue.pop();
    this.ghostWeight--;
  }
} */

var startNode = new Node(0, 0, false);

getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);
  return {x: i, y: j};
}

/*getNodeI = function(node, x) {
  var i = BUBBLES_GAP * x
}*/

const buildGameboard = function(GAMEBOARD, node, i, j, width, depth, Accumulator = width * depth) {
  if (Accumulator === 0) {
    return GAMEBOARD;
  }
  left = null;
  right = null;
  north = null;
  south = null;
  if (i > 0 && !GAMEBOARD[i][j].left.created && checkSpots(i-1, j)) {
    left = new Node(i-1, j, true);
  }
  else if (i > 0 && GAMEBOARD[i][j].left.created && checkSpots(i-1, j)) {
    left = GAMEBOARD[i][j].left;
  }
  if (i < width-1 && !GAMEBOARD[i][j].right.created && checkSpots(i+1, j)) {
    right = new Node(i+1, j, true);
  }
  else if (i < width-1 && GAMEBOARD[i][j].right.created && checkSpots(i+1, j)) {
    right = GAMEBOARD[i][j].right;
  }
  if (j > 0 && !GAMEBOARD[i][j].north.created && checkSpots(i, j-1)) {
    north = new Node(i, j-1, true);
  }
  else if (j > 0 && GAMEBOARD[i][j].north.created && checkSpots(i, j-1)) {
    north = GAMEBOARD[i][j].north;
  }
  if (j < depth-1 && !GAMEBOARD[i][j].south.created && checkSpots(i, j+1)) {
    south = new Node(i, j+1, true);
  }
  else if (j < depth-1 && GAMEBOARD[i][j].south.created && checkSpots(i, j+1)) {
    south = GAMEBOARD[i][j].south;
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
  listNodes.push(node);
  node.left.right = node;
  node.right.left = node;
  node.south.north = node;
  node.north.south = node;
  GAMEBOARD[i][j] = node;

  if (left != null && !left.created) {
    buildGameBoard(GAMEBOARD, left, i-1, j, width, depth, Accumulator-1);
  }
  if (right != null && !right.created) {
    buildGameBoard(GAMEBOARD, right, i+1, j, width, depth, Accumulator-1);
  }
  if (north != null && !north.created) {
    buildGameBoard(GAMEBOARD, north, i, j-1, width, depth, Accumulator-1);
  }
  if (south != null && !south.created) {
    buildGameBoard(GAMEBOARD, south, i, j+1, width, depth, Accumulator-1);
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

GAMEBOARD = buildGameboard(GAMEBOARD, GAMEBOARD[0][0], 0, 0, 26, 29, 26*29);

for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
  var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
  var y = parseInt(bubbleParams[0]) - 1;
  var x = parseInt(bubbleParams[1]) - 1;
  var type = bubbleParams[2];
  var eaten = parseInt(bubbleParams[3]);
  if (type === "b") {
    GAMEBOARD[x][y].bubble = true;
    GAMEBOARD[x][y].target = true;
    bubbleCount++;
  } else {
    GAMEBOARD[x][y].superBubble = true;
    GAMEBOARD[x][y].target = true;
    superBubbleCount++;
  }
  if(eaten === 0) {
    GAMEBOARD[x][y].eaten = false;
  } else {
    GAMEBOARD[x][y].eaten = true;
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

/*function selectMove(node) {

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
}; */

/*var minGhostPath = new Path();
var allGhostPaths = [];
var nullSuperBubbles = TOTAL_SPACES - superBubbleCount;
var maxGhostPath = new Path();
var allGhostPaths = [];
var numOfGhosts = 4;

function resetPath(node) {
    if (node.left === null || node.right === null || node.north === null || node.south === null) {
        return;
    }
    node.searched = false;
    node.path.hasGhost = false;
    node.path = new Path();
    node.minPath = new Path()
    node.ghostPath = new Path();
    node.minGhostPath = new Path();
    if (node.right != null)
        resetPath(node.right);
    if (node.south != null) 
        resetPath(node.south)
    if (node.left != null)
        resetPath(node.left)
    if (node.north != null)
        resetPath(node.north)
}*/

function swap(bestPath) {
  var temp = minPath[0];
  bestPath[0] = bestPath[1];
  bestPath[1] = temp;
}

function reverse(queue) {
  var temp = [];
  for (var i = queue.length-1; i >= 0; i++) {
    temp[Math.abs(i-queue.length-1)] = queue[i];
  }
  return temp;
}

function allEatenOrNull(node) {
  var right = false;
  var south = false;
  var left = false;
  var north = false;
  if (node.right != null || node.right.eaten) {
    right = true;
  }
  if (node.south != null || node.south.eaten) {
    south = true;
  }
  if (node.left != null || node.left.eaten) {
    left = true;
  }
  if (node.north != null || node.north.eaten) {
    north = true;
  }
  if (right && south && left && north) {
    return true;
  }
  else 
    return false;
}

function initializeStuff() {
  var pacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  GAMEBOARD[pacman.x][pacman.y].pacman = true;
  GAMEBOARD[pacman.x][pacman.y].right.pacman = false;
  GAMEBOARD[pacman.x][pacman.y].south.pacman = false;
  GAMEBOARD[pacman.x][pacman.y].left.pacman = false;
  GAMEBOARD[pacman.x][pacman.y].north.pacman = false;
  pacNode = GAMEBOARD[pacman.x][pacman.y];
  

  var blinky = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
  GAMEBOARD[blinky.x][blinky.y].blinky = true;
  GAMEBOARD[blinky.x][blinky.y].right.blinky = false;
  GAMEBOARD[blinky.x][blinky.y].south.blinky = false;
  GAMEBOARD[blinky.x][blinky.y].left.blinky = false;
  GAMEBOARD[blinky.x][blinky.y].north.blinky = false;
  blinkyNode = GAMEBOARD[blinky.x][blinky.y];

  var pinky = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
  GAMEBOARD[pinky.x][pinky.y].pinky = true;
  GAMEBOARD[pinky.x][pinky.y].right.pinky = false;
  GAMEBOARD[pinky.x][pinky.y].south.pinky = false;
  GAMEBOARD[pinky.x][pinky.y].left.pinky = false;
  GAMEBOARD[pinky.x][pinky.y].north.pinky = false;
  pinkyNode = GAMEBOARD[pinky.x][pinky.y];

  var inky = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
  GAMEBOARD[inky.x][inky.y].inky = true;
  GAMEBOARD[inky.x][inky.y].right.inky = false;
  GAMEBOARD[inky.x][inky.y].south.inky = false;
  GAMEBOARD[inky.x][inky.y].left.inky = false;
  GAMEBOARD[inky.x][inky.y].north.inky = false;
  inkyNode = GAMEBOARD[inky.x][inky.y];

  var clyde = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
  GAMEBOARD[clyde.x][clyde.y].clyde = true;
  GAMEBOARD[clyde.x][clyde.y].right.clyde = false;
  GAMEBOARD[clyde.x][clyde.y].south.clyde = false;
  GAMEBOARD[clyde.x][clyde.y].left.clyde = false;
  GAMEBOARD[clyde.x][clyde.y].north.clyde = false;
  clydeNode = GAMEBOARD[clyde.x][clyde.y];
}

var Super = false;
var chaseGhost = false;
function selectMove() {
  initializeStuff();
  if (GAMEBOARD[pacman.x][pacman.y].bubble) {
    GAMEBOARD[pacman.x][pacman.y].bubble = false;
    GAMEBOARD[pacman.x][pacman.y].eaten = true;
    bubbleCount--;
  }
  else if (board[pacman.x][pacman.y].superBubble) {
    affraidGhosts();
    chaseGhost = true;
    GAMEBOARD[pacman.x][pacman.y].superBubble = false;
    GAMEBOARD[pacman.x][pacman.y].eaten = true;
    superBubbleCount--;
  }
  pacNode = board[pacman.x][pacman.y];
  Super = false;
  if (fleeGhost(blinkyNode) || fleeGhost(pinkyNode) || fleeGhost(inkyNode) || fleeGhost(clydeNode)) {
    path = [];
    Super = true;
  }
  if (path.length === 0) {
    listNodes.forEach(node => {
      node.visited = false;
      node.target = false });

    path = [];
    allQueues = [];
    ghostQueues = [];
    var pacDist = breadthFirstPacman(pacNode, Super);
    var closestGhost = closestGhost(blinkyNode, pinkyNode, inkyNode, clydeNode);
    var bestGhost = optimalGhostChase(pacNode, blinkyNode, pinkyNode, inkyNode, clydeNode);
    //var bestGhost = optimalGhostChase(blinkyNode, pinkyNode, inkyNode, clydeNode);
    while (pacDist >= closestGhost) {
      path = [];
      listNodes.forEach(node => {
        node.visited = false });
      pacDist = breadthFirstPacman(pacNode, Super);
      listNodes.forEach(node => {
        node.visited = false });
      allQueues = [];
      closestGhost = closestGhost(blinkyNode, pinkyNode, inkyNode, clydeNode);
    }
    reverse(path);
  }                                                             
  if (chaseGhost) {
    if (GHOST_AFRAID_TIMER > 0) {
      if (path.length === 0) {
        bestGhost = optimalGhostChase(pacNode, blinkyNode, pinkyNode, inkyNode, clydeNode);
        path = bestGhost;
        path = reverse(path);
      }
    }
    else 
      chaseGhost = false;
      selectMove();
      return;
  }
  path.pop();
  var node = path.pop();
  if (canMovePacman(1) && !PACMAN_MOVING && node.i === pacNode.right.i && node.j === pacNode.right.j) {
    movePacman(1);
  }
  if (canMovePacman(2) && !PACMAN_MOVING && node.i === pacNode.south.i && node.j === pacNode.south.j) {
    movePacman(2);
  }
  if (canMovePacman(3) && !PACMAN_MOVING && node.i === pacNode.left.i && node.j === pacNode.left.j) {
    movePacman(3);
  }
  if (canMovePacman(4) && !PACMAN_MOVING && node.i === pacNode.north.i && node.j === pacNode.north.j) {
    movePacman(4);
  }
}

/*function selectMove() {

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

        var directions = [];
        for (var i = 1; i < 5; i++) {
            if (canMovePacman(i)) 
              directions.push(i);
        }

        if (directions.length >=2  || !PACMAN_MOVING){
           movePacman(directions[Math.floor(Math.random() * directions.length)]);
        }
        else {
            movePacman(direction);
        }
    }
};*/

function closestGhost(blinkyNode, pinkyNode, inkyNode, clydeNode) {
  var closestGhost = Infinity;
  var distanceGhosts = [];
  distanceGhosts.push(ghostSearchTarget(blinkyNode).length);
  allQueues = [];
  distanceGhosts.push(ghostSearchTarget(pinkyNode).length);
  allQueues = [];
  distanceGhosts.push(ghostSearchTarget(inkyNode).length);
  allQueues = [];
  distanceGhosts.push(ghostSearchTarget(clydeNode).length);
  for (var i = 0; i < 4; i++) {
    if (closestGhost > distanceGhosts[i]) {
      closestGhost = distanceGhosts[i];
    }
  return closestGhost;
}

function optimalGhostChase(pacNode, blinkyNode, pinkyNode, inkyNode, clydeNode) {
  var bestGhost = 0;
  var bubbleCounts = [];
  bubbleCounts.push(chaseGhost(pacNode, blinkyNode));
  ghostQueues = [];
  bubbleCounts.push(chaseGhost(pacNode, pinkyNode));
  ghostQueues = [];
  bubbleCounts.push(chaseGhost(pacNode, inkyNode));
  ghostQueues = [];
  bubbleCounts.push(chaseGhost(pacNode, clydeNode));
  for (var i = 0; i < 4; i++) {
    if (bestGhost < bubbleCounts[i]) {
      bestGhost = bubbleCounts[i];
    }
  }
  return bestGhost;
}

function breadthFirstPacman(root, Super) {
  breadthFirstPacman(root, [], Super);
}

function breadthFirstPacman(root, queue=[], Super) {
  if (root != null && !root.visited) {
    root.visited = true;
    queue.push(root);
  }
  if (root.bubble && !Super && !root.target) {
    root.target = true;
    targetNode = root;
    path.push(root);
    return 1;
  }
  else if (root.superBubble && Super && !root.target) {
    root.target = true;
    targetNode = root;
    path.push(root);
    return 1;
  }
  else if (queue.length === 0) {
    return 1;
  }
  else {
    var node = queue[0];
    node.visited = true;
    path.push(node);
    for (var i = 1; i <  queue.length; i++) {
      queue[i-1] = queue[i];
    }
    queue.pop();
    if (node.right != null && !node.right.visited && (!node.right.eaten || allEatenOrNull(node))) {
      if ((!node.right.bubble && !Super) || (!node.right.superBubble && Super)) {
        node.right.visited = true;
        queue.push(node.right);  
      }
    }
    if (node.south != null && !node.south.visited && (!node.south.eaten || allEatenOrNull(node))) {
      if ((!node.south.bubble && !Super) || (!node.south.superBubble && Super)) {
        node.south.visited = true;
        queue.push(node.south); 
      }
    }
    if (node.left != null && !node.left.visited && (!node.left.eaten || allEatenOrNull(node))) {
      if ((!node.left.bubble && !Super) || (!node.left.superBubble && Super)) {
        node.left.visited = true;
        queue.push(node.left);   
      }   
    }
    if (node.north != null && !node.north.visited && (!node.north.eaten || allEatenOrNull(node))) {
      if ((!node.north.bubble && !Super) || (!node.north.superBubble && Super)) {
        node.north.visited = true;
        queue.push(node.north);   
      }  
    }
    return 1 + breadthFirstPacman(queue[0], queue, target); 
  }
}

function ghostSearchTarget(ghost) {
  ghostSearchTarget(ghost, [], targetNode)
}

function ghostSearchTarget(ghost, queue = [], target) {
  if (ghost != null && !ghost.visited) {
    ghost.visited = true;
    queue.push(ghost);
  }
  if (ghost.i === target.i && ghost.j === target.j) {
    ghost.visited = false;
    allQueues.push(queue);
    var min = Infinity;
    var minQueue = [];
    for (var i = 0; i < allQueues.length; i++) {
      if (min > allQueues[i].length) {
        min = allQueues[i].length;
        minQueue = allQueues[i];
      }
    }
    return minQueue;
 }
 else {
   if (ghost.right != null && !ghost.right.visited) {
     ghostSearchTarget(ghost.right, queue, target);
   }
   if (ghost.south != null && !ghost.north.visited) {
     ghostSearchTarget(ghost.south, queue, target);
   }
   if (ghost.left != null && !ghost.left.visited) {
     ghostSearchTarget(ghost.left, queue, target);
   }
   if (ghost.north != null && !ghost.north.visited) {
     ghostSearchTarget(ghost.north, queue, target);
   }
 }
}

/* function breadthFirstGhost(ghost, queue = [], target) {
  if (ghost.i === target.i && ghost.j === target.j) {
     return 1;
  }
  else if (queue.length === 0) {
    return 1;
  }
  else {
      var node = queue[0];
      node.visited = true;
      for (var i = 1; i <  queue.length; i++) {
        queue[i-1] = queue[i];
      }
      queue.pop();
      if (node.right != null && !node.right.bubble && !node.right.superBubble && !node.right.visited)
        node.right = visited;
        queue.push(node.right);
      if (node.south != null && !node.south.bubble && !node.south.superBubble && !node.south.visited)
        node.south.visited = true;
        queue.push(node.south);
      if (node.left != null && !node.left.bubble && !node.left.superBubble && !node.left.visited)
        node.left.visited = true;
        queue.push(node.left);
      if (node.north != null && !node.north.bubble && !node.north.superBubble && !node.north.visited)
        node.north.visited = true;
        queue.push(node.north);      
      return 1 + breadthFirstGhost(queue[0], queue, target);
  }*/

  function fleeGhost(ghost) {
    fleeGhost(pacNode, ghost);
  }

  function fleeGhost(pacNode, ghost) {
    if (pacNode.right.right.right.i === ghost.i && pacNode.right.right.right.j === ghost.j && pacNode.right != null && pacNode.right.right != null && pacNode.right.right.right != null) {
      return true;
    }
    else if (pacNode.south.south.south.i === ghost.i && pacNode.south.south.south.j === ghost.j && pacNode.south != null && pacNode.south.south != null && pacNode.south.south.south != null) {
      return true;
    }
    else if (pacNode.left.left.left.i === ghost.i && pacNode.left.left.left.j === ghost.j && pacNode.left != null && pacNode.left.left != null && pacNode.left.left.left != null) {
      return true;
    }
    else if (pacNode.north.north.north.i === ghost.i && pacNode.north.north.north.j === ghost.j && pacNode.north != null && pacNode.north.north != null && pacNode.north.north.north != null) {
      return true;
    }
    else 
      return false;
  }

  function numOfGhosts(blinkyNode, pinkyNode, inkyNode, clydeNode) {
    var num = 0;
    if (fleeGhost(blinkyNode)) {
      num++;
    }
    if (fleeGhost(pinkyNode)) {
      num++;
    }
    if (fleeGhost(inkyNode)) {
      num++;
    }
    if (fleeGhost(clydeNode))
      num++;
    }
    return num;
  }

  /*function escapeGhost(ghost) {
    escapeGhost(pacNode, ghost, []);
  }

  function escapeGhost(node, blinkyNode, pinkyNode, inkyNode, clydeNode, queue=[]) {
    while (fleeGhost(node, blinkyNode) || fleeGhost(node, pinkyNode) || fleeGhost(node, inkyNode) || fleeGhost(node, clydeNode)) {
      var direction = 0;
      if (node != null && !node.visited) {
        queue.push(node);
      }
      if (fleeGhost(node, blinkyNode)) {
        direction = GHOST_BLINKY_DIRECTION;
      }
      else if (fleeGhost(node, pinkyNode)) {
        direction = GHOST_PINKY_DIRECTION;
      }
      else if (fleeGhost(node, inkyNode))
      if (direction === 1) {
        var node = node.left;
      }
        else if 
      }
    }
  }*/

  function chaseGhost(root, ghost) {
    chaseGhost(root, [], ghost)
  }

  function chaseGhost(root, queue=[], ghost) {
    if (root != null && !root.visited) {
      root.visited = true;
      queue.push(root);
    }
    if (root.i === ghost.i && root.j === ghost.j) {
      ghostQueues.push(queue);
      var max = 0;
      var maxQueue = [];
      var bubbleCounts = [];
      for (var i = 0; i < ghostQueues.length; i++) {
        bubbleCounts[i] = 0;
      }
      for (var i = 0; i < ghostQueues.length; i++) {
        for (var j = 0; j < ghostQueues.length; j++) {
          if (ghostQueues[i][j].bubble) {
            bubbleCounts[i]++;
          } 
        }
      }
      for (var i = 0; i < ghostQueues.length; i++) {
        if (max < bubbleCounts[i]) {
          max = bubbleCounts[i];
          maxQueue = ghostQueues[i];
        } 
      }
      return maxQueue;
    }
    else {
      if (root.right != null && !root.right.visited) {
        chaseGhost(root.right, queue, ghost);
      }
      if (root.south != null && !root.north.visited) {
        chaseGhost(root.south, queue, ghost);
      }
      if (root.left != null && !root.left.visited) {
        chaseGhost(root.left, queue, ghost);
      }
      if (root.north != null && !root.north.visited) {
        chaseGhost(root.north, queue, ghost);
      }
    }
  }

  /*function chaseGhost(root, queue, ghost) {
    if (root != null && !root.visited) {
      root.visited = true;
      queue.push(root);
    }
    if (root.i === ghost.i && root.j === ghost.j) {
      root.visited = false;
      path.push(root);
      return 1;
    }
    else if (queue.length === 0) {
      return 1;
    }
    else {
      var node = queue[0];
      node.visited = true;
      path.push(node);
      for (var i = 1; i <  queue.length; i++) {
        queue[i-1] = queue[i];
      }
      queue.pop();
      if (node.right != null && !node.right.visited)
        node.right = visited;
        queue.push(node.right);
      if (node.south != null && !node.south.visited)
        node.south.visited = true;
        queue.push(node.south);
      if (node.left != null && !node.left.visited)
        node.left.visited = true;
        queue.push(node.left);
      if (node.north != null && !node.north.visited)
        node.north.visited = true;
        queue.push(node.north);
      if (queue[0].bubble) {      
        return 1 + chaseGhost(queue[0], queue, ghost);
      }
      else
        return chaseGhost(queue[0], queue, ghost);
    }
  }
} 

  /*function checkForGhost(node) {
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
  }*/
}