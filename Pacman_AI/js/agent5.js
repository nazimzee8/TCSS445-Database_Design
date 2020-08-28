var GAMEBOARD = [];
var direction;
var targetNode;
var pacNode;
var blinkyNode;
var inkyNode;
var pinkyNode;
var clydeNode;

var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

  return {x: i, y: j}
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        posX: i,
        posY: j,
        visited: false,
        prev: null,
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false
      });
    }
  }

    
  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

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
          posX: i,
          posY: j,
          visited: false,
          prev: null,
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
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  if(p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].inky = true;
    GAMEBOARD[p.x][p.y].posX = p.x;
    GAMEBOARD[p.x][p.y].posY = p.y; 
    inkyNode = GAMEBOARD[p.x][p.y];
  }
  p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].pinky = true;
    GAMEBOARD[p.x][p.y].posX = p.x;
    GAMEBOARD[p.x][p.y].posY = p.y; 
    pinkyNode = GAMEBOARD[p.x][p.y];
  }
  p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].blinky = true;
    GAMEBOARD[p.x][p.y].posX = p.x;
    GAMEBOARD[p.x][p.y].posY = p.y; 
    blinkyNode = GAMEBOARD[p.x][p.y];
  }
  p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].clyde = true;
    GAMEBOARD[p.x][p.y].posX = p.x;
    GAMEBOARD[p.x][p.y].posY = p.y; 
    clydeNode = GAMEBOARD[p.x][p.y];
  }
  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].pacman = true;
    GAMEBOARD[p.x][p.y].posX = p.x;
    GAMEBOARD[p.x][p.y].posY = p.y;
    pacNode = GAMEBOARD[p.x][p.y];
  }
  targetNode = breadthFirstPacman(pacNode, []);
  direction = getPacmanPath(targetNode, pacNode);

};

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

function isWall(i , j) {
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
        return false;
    }
    else {
        return true;
    }
}

function isGhost(i, j) {
  if (GAMEBOARD[i][j].blinky || GAMEBOARD[i][j].binky || GAMEBOARD[i][j].pinky || GAMEBOARD[i][j].clyde) {
    return true;
  }
  else return false;
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
/*function selectMove() {

    buildGameboard();

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

      //initializeStuff();
      var pacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
      /*if (GAMEBOARD[pacman.x][pacman.y].bubble) {
        GAMEBOARD[pacman.x][pacman.y].bubble = false;
        GAMEBOARD[pacman.x][pacman.y].eaten = true;
      }
      else if (board[pacman.x][pacman.y].superBubble) {
        GAMEBOARD[pacman.x][pacman.y].superBubble = false;
        GAMEBOARD[pacman.x][pacman.y].eaten = true;
      } 
      var pacNode = GAMEBOARD[pacman.x][pacman.y];

      var blinky = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
      var pinky = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
      var inky = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
      var clyde = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);

      var blinkyNode = GAMEBOARD[blinky.x][blinky.y];
      var pinkyNode = GAMEBOARD[pinky.x][pinky.y];
      var inkyNode = GAMEBOARD[inky.x][inky.y];
      var clydeNode = GAMEBOARD[clyde.x][clyde.y];

      if (pacPath === []) { 
        for (var i = 0; i < listNodes.length; i++) {
            listNodes[i].visited = false;
            listNodes[i].target = false;
        }
        var targetNode = breadthFirstPacman(pacNode);
        pacPath = getPacmanPath(targetNode, pacNode);
        var nearestGhost = closestGhost(targetNode, blinkyNode, inkyNode, pinkyNode, clydeNode);
    
        while (pacPath.length >= nearestGhost) {
            for (var i = 0; i < listNodes.length; i++) {
                listNodes[i].visited = false;
            }
          targetNode = breadthFirstPacman(pacNode);
          pacPath = getPacmanPath(targetNode);
          for (var i = 0; i < listNodes.length; i++) {
            listNodes[i].visited = false;
            listNodes[i].target = false;
          }
          nearestGhost = closestGhost(targetNode, blinkyNode, pinkyNode, inkyNode, clydeNode);
        }
        pacPath.pop();
      }
      var node = pacPath.pop();
      if (canMovePacman(1) && !PACMAN_MOVING && node === GAMEBOARD[pacman.x+1][pacman.y]) {
        console.log(1);
        movePacman(1);
      }
      else if (canMovePacman(2) && !PACMAN_MOVING && node === GAMEBOARD[pacman.x][pacman.y+1]) {
        console.log(2);
        movePacman(2);
      }
      else if (canMovePacman(3) && !PACMAN_MOVING && node === GAMEBOARD[pacman.x-1][pacman.y]) {
        console.log(3);
        movePacman(3);
      }
      else if (canMovePacman(4) && !PACMAN_MOVING && node === GAMEBOARD[pacman.x][pacman.y-1]) {
        console.log(4);
        movePacman(4);
      }
    }
};*/

function breadthFirstPacman(node=pacNode, queue=[]) {
  var i = node.posX;
  var j = node.posY;
  GAMEBOARD[i][j].visited = true;
  queue.push(node);
  while (queue.length > 0) {
    node = queue.shift();
    i = node.posX;
    j = node.posY;
    if (!isWall(i+1, j) && !isGhost(i+1, j)) {
      if (!GAMEBOARD[i+1][j].visited) {
        GAMEBOARD[i+1][j].prev = GAMEBOARD[i][j];
        GAMEBOARD[i+1][j].visited = true;
        queue.push(GAMEBOARD[i+1][j]);
      }
      else GAMEBOARD[i][j].prev = GAMEBOARD[i+1][j];
    }

    if (!isWall(i, j+1) && !isGhost(i, j+1)) {
      if (!GAMEBOARD[i][j+1].visited) {
        GAMEBOARD[i][j+1].prev = GAMEBOARD[i][j];
        GAMEBOARD[i][j+1].visited = true;
        queue.push(GAMEBOARD[i][j+1]);
      }
      else GAMEBOARD[i][j].prev = GAMEBOARD[i][j+1];
    }

    if (!isWall(i-1, j) && !isGhost(i-1, j)) {
      if (!GAMEBOARD[i-1][j].visited) {
        GAMEBOARD[i-1][j].visited = true;
        GAMEBOARD[i-1][j].prev = GAMEBOARD[i][j];
        queue.push(GAMEBOARD[i-1][j]);
      }
      else GAMEBOARD[i][j].prev = GAMEBOARD[i-1][j];
    }

    if (!isWall(i, j-1) && !isGhost(i, j-1)) {
      if (!GAMEBOARD[i][j-1].visited) {
        GAMEBOARD[i][j-1].visited = true;
        GAMEBOARD[i][j-1].prev = GAMEBOARD[i][j];
        queue.push(GAMEBOARD[i][j-1]);
      }
      else GAMEBOARD[i][j].prev = GAMEBOARD[i][j-1];
    }
    if ((GAMEBOARD[i][j].bubble || GAMEBOARD[i][j].superBubble)) {
      GAMEBOARD[i][j].eaten = true;
      GAMEBOARD[i][j].visited = true;
      return GAMEBOARD[i][j];
    }
  }
  return GAMEBOARD[i][j];
}

function getPacmanPath(target, pacman=pacNode) {
  var i = target.posX;
  var j = target.posY;
  if (GAMEBOARD[i-1][j].prev === pacman) {
    return 1;
  }
  else if (GAMEBOARD[i][j-1].prev === pacman) {
    return 2;
  }
  else if (GAMEBOARD[i+1][j].prev === pacman) {
    return 3;
  }
  else if (GAMEBOARD[i][j+1].prev === pacman) {
    return 4;
  }
  else {
    if (GAMEBOARD[i][j].prev === GAMEBOARD[i+1][j]) {
      return getPacmanPath(GAMEBOARD[i+1][j], pacman);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i][j+1]) {
      return getPacmanPath(GAMEBOARD[i][j+1], pacman);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i-1][j]) {
      return getPacmanPath(GAMEBOARD[i-1][j], pacman);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i][j-1]) {
      return getPacmanPath(GAMEBOARD[i][j-1], pacman);
    }
  }
}

function breadthFirstGhost(target, queue=[], ghost) {
  var i = ghost.posX;
  var j = ghost.posY;
  GAMEBOARD[i][j].visited = true;
  queue.push(GAMEBOARD[i][j]);
  while (GAMEBOARD[i][j] !== target) {
    if (queue.length() > 1) {
      GAMEBOARD[i][j].visited = true;
      for (var k = 1; k < queue.length; k++) {
          queue[k-1] = queue[k];
      }
      queue.pop();
    }
    var ghost = queue[0];
    var i = ghost.posX;
    var j = ghost.posY;
    if (!isWall(i+1, j)) {
      GAMEBOARD[i+1][j].prev = node;
      if (!GAMEBOARD[i+1][j].visited) {
        GAMEBOARD[i+1][j].visited = true;
        queue.push(GAMEBOARD[i+1][j]);
      }
    }
    if (!isWall(i, j+1)) {
      GAMEBOARD[i][j+1].prev = node;
      if (!GAMEBOARD[i][j+1].visited) {
        GAMEBOARD[i][j+1].visited = true;
        queue.push(GAMEBOARD[i][j+1]);
      }
    }
    if (!isWall(i-1, j)) {
      GAMEBOARD[i-1][j].prev = node;
      if (!GAMEBOARD[i-1][j].visited) {
        GAMEBOARD[i-1][j].visited = true;
        queue.push(GAMEBOARD[i-1][j]);
      }
    }
    if (!isWall(i, j-1)) {
      GAMEBOARD[i][j-1].prev = node;
      if (!GAMEBOARD[i][j-1].visited) {
        GAMEBOARD[i][j-1].visited = true;
        queue.push(GAMEBOARD[i][j-1]);
      }
    }
  }
  return GAMEBOARD[i][j];
}

function getGhostPath(node, ghost, path=[]) {
  var i = node.posX;
  var j = node.posY;
  if (node === ghost) {
    path.push(node);
    return path;
  }
  else {
    if (GAMEBOARD[i][j].prev === GAMEBOARD[i+1][j]) {
      path.push(GAMEBOARD[i+1][j]);
      getPacmanPath(GAMEBOARD[i+1][j], ghost_i, ghost_j, path);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i][j+1]) {
      path.push(GAMEBOARD[i][j+1]);
      getPacmanPath(GAMEBOARD[i][j+1], ghost_i, ghost_j, path);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i-1][j]) {
      path.push(GAMEBOARD[i-1][j]);
      getPacmanPath(GAMEBOARD[i-1][j], ghost_i, ghost_j, path);
    }
    else if (GAMEBOARD[i][j].prev === GAMEBOARD[i][j-1]) {
      path.push(GAMEBOARD[i][j-1]);
      getPacmanPath(GAMEBOARD[i][j-1], ghost_i, ghost_j, path);
    }
  }
}

function closestGhost(target, blinkyNode, inkyNode, pinkyNode, clydeNode) {
  var nearestGhost = Infinity;
  nearestGhost = getGhostPath(target, blinkyNode).length;
  if (nearestGhost > getGhostPath(target, inkyNode).length) {
    nearestGhost = getGhostPath(target, inkyNode).length;
  }
  if (nearestGhost > getGhostPath(target, pinkyNode).length) {
    nearestGhost = getGhostPath(target, pinkyNode).length;
  }
  if (nearestGhost > getGhostPath(target, clydeNode).length) {
    nearestGhost = getGhostPath(target, clydeNode).length;
  }
  return nearestGhost;
}

function selectMove() {

  buildGameboard();
  console.log(targetNode);
  console.log(targetNode.prev);
  console.log(direction);
  if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
      console.log(direction);
      if (canMovePacman(direction) && !PACMAN_MOVING) movePacman(direction);
    /*if (canMovePacman(1) && !PACMAN_MOVING && direction === 1) {
      movePacman(1);
    }
    else if (canMovePacman(2) && !PACMAN_MOVING && direction === 2) {
      movePacman(2);
    }
    else if (canMovePacman(3) && !PACMAN_MOVING && direction === 3) {
      movePacman(3);
    }
    else if (canMovePacman(4) && !PACMAN_MOVING && direction === 4) {
      movePacman(4);
    }*/

  }
}; 
//setInterval(drawDebug, 1000/3);
