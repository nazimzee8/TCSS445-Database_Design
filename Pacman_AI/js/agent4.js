var GAMEBOARD = [];
var bubbleCount = 0;
var superBubbleCount = 0;
var nullSpaces = 0;
var emptySpaces;
var TOTAL_SPACES = 26 * 29;
var continues = true;
var listNodes = [];
/*var path = [];
var allQueues = [];
var ghostQueues = [];
var targetNode = new Node(-1, -1, true); */

/*class Node {
   constructor(i, j, left, right, north, south) {
    this.i = i;
    this.j = j;
    this.searched = false;
    this.created = false;
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
    this.prev = null;
    this.left = left;
    this.right = right;
    this.north = north;
    this.south = south;
    this.index = -1;
  } 
}*/

var pacNode = null;
var blinkyNode = null;
var pinkyNode = null;
var inkyNode = null;
var clydeNode = null;


/*class Path {
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

var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);
  return {x: i, y: j};
}

/*getNodeI = function(node, x) {
  var i = BUBBLES_GAP * x
}*/

/*var buildGameboard = function(GAMEBOARD, node, i, j, width, depth, Accumulator = width * depth) {
  if (Accumulator === 0) {
    return GAMEBOARD;
  }
  left = null;
  right = null;
  north = null;
  south = null;
  if (i > 0 && checkSpots(i-1, j) && GAMEBOARD[i-1][j] === null) {
    left = new Node(i-1, j, null, null, null, null);
  }
  else if (i > 0 && checkSpots(i-1, j) && GAMEBOARD[i-1][j] !== null) {
    left = GAMEBOARD[i-1][j];
  }
  if (i < width-1 && checkSpots(i+1, j) && GAMEBOARD[i+1][j] === null) {
    right = new Node(i+1, j, null, null, null, null);
  }
  else if (i < width-1 && checkSpots(i+1, j) && GAMEBOARD[i+1][j] !== null) {
    right = GAMEBOARD[i+1][j];
  }
  if (j > 0 && checkSpots(i, j-1) && GAMEBOARD[i][j-1] === null) {
    north = new Node(i, j-1, null, null, null, null);
  }
  else if (j > 0 && checkSpots(i, j-1) && GAMEBOARD[i][j-1] !== null) {
    north = GAMEBOARD[i][j-1];
  }
  if (j < depth-1 && checkSpots(i, j+1) && GAMEBOARD[i][j+1] === null) {
    south = new Node(i, j+1, null, null, null, null);
  }
  else if (j < depth-1 && checkSpots(i, j+1) && GAMEBOARD[i][j+1] !== null) {
    south = GAMEBOARD[i][j+1];
  }
  node = new Node(i, j, left, right, north, south);
  node.created = true;

  if (left === null)
    nullSpaces++;
  if (right === null)
    nullSpaces++;
  if (north === null)
    nullSpaces++;
  if (south === null)
    nullSpaces++;

  if (node.left !== null)
    node.left.right = node;
  if (node.right !== null)
    node.right.left = node;
  if (node.south !== null)
    node.south.north = node;
  if (node.north !== null)
    node.north.south = node;
  GAMEBOARD[i][j] = node;
  listNodes.push(node);

  if (left !== null && !left.created) {
    buildGameBoard(GAMEBOARD, left, i-1, j, width, depth, Accumulator-1);
  }
  if (right !== null && !right.created) {
    buildGameBoard(GAMEBOARD, right, i+1, j, width, depth, Accumulator-1);
  }
  if (north !== null && !north.created) {
    buildGameBoard(GAMEBOARD, north, i, j-1, width, depth, Accumulator-1);
  }
  if (south !== null && !south.created) {
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

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        i: i,
        j: j,
        created: false,
        visited: false,
        target: false,
        prev: false,
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false
    });
    listNodes.push(GAMEBOARD[i][j]);
  }
}
  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[0]) - 1;
    var x = parseInt(bubbleParams[1]) - 1;
    var type = bubbleParams[2];
    var eaten = parseInt(bubbleParams[3]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
      bubbleCount++;
    }
    else {
      GAMEBOARD[x][y].superBubble = true;
      superBubbleCount++;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } 
    else {
      GAMEBOARD[x][y].eaten = true;
    
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

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {  
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
        GAMEBOARD[i][j] = {
          i: i,
          j: j,
          created: false,
          visited: false,
          target: false,
          prev: false,
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };
      }
      else {
        GAMEBOARD[i][j] = null;  
        listNode[28*i + j] = null;   
      }
    }
  }
  //GAMEBOARD = buildGameboard([], new Node(0, 0, null, null, null, null), 0, 0, 26, 29, 26*29);

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

/*function selectMove() {

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

function reverse(queue) {
  var temp = [];
  for (var i = queue.length-1; i >= 0; i++) {
    temp[Math.abs(i-queue.length-1)] = queue[i];
  }
  return temp;
}

var pacPath = [];
function selectMove() {
  initializeStuff();
  buildGameboard();
  var pacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (GAMEBOARD[pacman.x][pacman.y].bubble) {
    GAMEBOARD[pacman.x][pacman.y].bubble = false;
    GAMEBOARD[pacman.x][pacman.y].eaten = true;
  }
  else if (board[pacman.x][pacman.y].superBubble) {
    GAMEBOARD[pacman.x][pacman.y].superBubble = false;
    GAMEBOARD[pacman.x][pacman.y].eaten = true;
  }
  pacNode = GAMEBOARD[pacman.x][pacman.y];
  if (pacPath.length === 0) { 
    listNodes.forEach(function(node) {
      node.visited = false;
      node.target = false });
    pacPath = getPacmanPath();
    var closestGhost = closestGhost(blinkyNode, inkyNode, pinkyNode, clydeNode);

    while (pacPath.length >= closestGhost) {
      listNodes.forEach(function(node) {
      node.visited = false});

      pacPath = getPacmanPath();
      listNodes.forEach(function(node) {
        node.visited = false });
      closestGhost = closestGhost(blinkyNode, pinkyNode, inkyNode, clydeNode);
    }
    pacPath = reverse(pacPath);
    pacPath.pop();
  }
  var node = pacPath.pop();
  if (canMovePacman(1) && !PACMAN_MOVING && node === pacNode.right) {
    console.log(1);
    movePacman(1);
  }
  else if (canMovePacman(2) && !PACMAN_MOVING && node === pacNode.south) {
    console.log(2);
    movePacman(2);
  }
  else if (canMovePacman(3) && !PACMAN_MOVING && node === pacNode.left) {
    console.log(3);
    movePacman(3);
  }
  else if (canMovePacman(4) && !PACMAN_MOVING && node === pacNode.north) {
    console.log(4);
    movePacman(4);
  }
}

function breadthFirstPacman() {
    var pacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    breadthFirstPacman(GAMEBOARD[pacman.x][pacman.y], []);
}

function breadthFirstPacman(node, queue) {
    /*if (node != null && node.bubble && !node.eaten) {
        return node;
    }
    if (node != null && node.superBubble && !node.eaten) {
      return node;
    }
    else if (queue.length === 0) {
        return;
    }
    else {*/
    var i = node.i;
    var j = node.j;
    while (GAMEBOARD[i][j] !== null && (GAMEBOARD[i][j].bubble || GAMEBOARD[i][j].superBubble) && !GAMEBOARD[i][j].eaten && !GAMEBOARD[i][j].target) {
      queue.push(GAMEBOARD[i][j]);
      if (queue.length() > 1) {
        GAMEBOARD[i][j].visited = true;
        for (var k = 1; k < queue.length; k++) {
            queue[k-1] = queue[k];
        }
        queue.pop();
      }
      node = queue[0];
      i = node.i;
      j = node.j;
      if (GAMEBOARD[i+1][j] !== null) {
        GAMEBOARD[i+1][j].prev = node;
        if (!GAMEBOARD[i+1][j].visited) {
          GAMEBOARD[i+1][j].visited = true;
          queue.push(GAMEBOARD[i+1][j]);
        }
      }
      if (GAMEBOARD[i][j+1] !== null) {
        GAMEBOARD[i][j+1].prev = node;
        if (!GAMEBOARD[i][j+1].visited) {
          GAMEBOARD[i][j+1].visited = true;
          queue.push(GAMEBOARD[i][j+1]);
        }
      }
      if (GAMEBOARD[i-1][j] !== null) {
        GAMEBOARD[i-1][j].prev = node;
        if (!GAMEBOARD[i-1][j].visited) {
          GAMEBOARD[i-1][j].visited = true;
          queue.push(GAMEBOARD[i-1][j]);
        }
      }
      if (GAMEBOARD[i][j-1] !== null) {
        GAMEBOARD[i][j-1].prev = node;
        if (!GAMEBOARD[i][j-1].visited) {
          GAMEBOARD[i][j-1].visited = true;
          queue.push(GAMEBOARD[i][j-1]);
        }
      }
  }
  GAMEBOARD[i][j].target = true;
  return GAMEBOARD[i][j];
}

function getPacmanPath() {
  getPacmanPath(breadthFirstPacman(), []);
}

function getPacmanPath(node, path) {
  var i = node.i;
  var j = node.j;
  if (i === pacNode.i && j === pacNode.j) {
    path.push(node);
    return path;
  }
  else {
    if (node.prev === GAMEBOARD[i+1][j]) {
      path.push(GAMEBOARD[i+1][j]);
      getPacmanPath(GAMEBOARD[i+1][j], path);
    }
    else if (node.prev === GAMEBOARD[i][j+1]) {
      path.push(GAMEBOARD[i][j+1]);
      getPacmanPath(GAMEBOARD[i][j+1], path);
    }
    else if (node.prev === GAMEBOARD[i-1][j]) {
      path.push(GAMEBOARD[i-1][j]);
      getPacmanPath(GAMEBOARD[i-1][j], path);
    }
    else if (node.prev === GAMEBOARD[i][j-1]) {
      path.push(GAMEBOARD[i][j-1]);
      getPacmanPath(GAMEBOARD[i][j-1], path);
    }
  }
}

function breadthFirstGhost(ghost) {
  breadthFirstGhost(breadthFirstPacman(), [], ghost);
}

function breadthFirstGhost(target, queue, ghost) {
  var i = ghost.i;
  var j = ghost.j;
  while (GAMEBOARD[i][j] !== target) {
    queue.push(GAMEBOARD[i][j]);
    if (queue.length() > 1) {
      GAMEBOARD[i][j].visited = true;
      for (var k = 1; k < queue.length; k++) {
          queue[k-1] = queue[k];
      }
      queue.pop();
    }
    ghost = queue[0];
    i = ghost.i;
    j = ghost.j;
    if (GAMEBOARD[i+1][j] !== null) {
      GAMEBOARD[i+1][j].prev = node;
      if (!GAMEBOARD[i+1][j].visited) {
        GAMEBOARD[i+1][j].visited = true;
        queue.push(GAMEBOARD[i+1][j]);
      }
    }
    if (GAMEBOARD[i][j+1] !== null) {
      GAMEBOARD[i][j+1].prev = node;
      if (!GAMEBOARD[i][j+1].visited) {
        GAMEBOARD[i][j+1].visited = true;
        queue.push(GAMEBOARD[i][j+1]);
      }
    }
    if (GAMEBOARD[i-1][j] !== null) {
      GAMEBOARD[i-1][j].prev = node;
      if (!GAMEBOARD[i-1][j].visited) {
        GAMEBOARD[i-1][j].visited = true;
        queue.push(GAMEBOARD[i-1][j]);
      }
    }
    if (GAMEBOARD[i][j-1] !== null) {
      GAMEBOARD[i][j-1].prev = node;
      if (!GAMEBOARD[i][j-1].visited) {
        GAMEBOARD[i][j-1].visited = true;
        queue.push(GAMEBOARD[i][j-1]);
      }
    }
  }
  return GAMEBOARD[i][j];
}

function getGhostPath(ghost) {
  getGhostPath(breadthFirstGhost(ghost), ghost, []);
}

function getGhostPath(node, ghost, path) {
  var i = node.i;
  var j = node.j;
  if (i === ghost.i && j === ghost.j) {
    path.push(node);
    return path;
  }
  else {
    if (node.prev === GAMEBOARD[i+1][j]) {
      path.push(GAMEBOARD[i+1][j]);
      getPacmanPath(GAMEBOARD[i+1][j], path);
    }
    else if (node.prev === GAMEBOARD[i][j+1]) {
      path.push(GAMEBOARD[i][j+1]);
      getPacmanPath(GAMEBOARD[i][j+1], path);
    }
    else if (node.prev === GAMEBOARD[i-1][j]) {
      path.push(GAMEBOARD[i-1][j]);
      getPacmanPath(GAMEBOARD[i-1][j], path);
    }
    else if (node.prev === GAMEBOARD[i][j-1]) {
      path.push(GAMEBOARD[i][j-1]);
      getPacmanPath(GAMEBOARD[i][j-1], path);
    }
  }
}

function closestGhost(blinkyNode, inkyNode, pinkyNode, clydeNode) {
  var closestGhost = Infinity;
  closestGhost = getGhostPath(blinkyNode).length;
  if (closestGhost > getGhostPath(inkyNode).length) {
    closestGhost = getGhostPath(inkyNode).length;
  }
  if (closestGhost > getGhostPath(pinkyNode).length) {
    closestGhost = getGhostPath(pinkyNode).length;
  }
  if (closestGhost > getGhostPath(clydeNode).length) {
    closestGhost = getGhostPath(clydeNode).length;
  }
  return closestGhost;
}

