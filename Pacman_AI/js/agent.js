var GAMEBOARD = [];
var pacNode;
var directon;
var targetNode;

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
        chase: false,
        ghost: false,
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
          chase: false,
          ghost: false,
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

  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      if (!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble) {
        GAMEBOARD[i][j] = 'Wall';
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  if(p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].inky = true;
    if (GHOST_INKY_AFFRAID_TIMER !== null || GHOST_INKY_STATE === -1) GAMEBOARD[p.x][p.y].chase = true;
  }
  p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].pinky = true;
    if (GHOST_PINKY_AFFRAID_TIMER !== null || GHOST_PINKY_STATE === -1) GAMEBOARD[p.x][p.y].chase = true;
  }
  p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].blinky = true;
    if (GHOST_BLINKY_AFFRAID_TIMER !== null || GHOST_BLINKY_STATE === -1) GAMEBOARD[p.x][p.y].chase = true;
  }
  p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]){ 
    GAMEBOARD[p.x][p.y].clyde = true;
    if (GHOST_CLYDE_AFFRAID_TIMER !== null || GHOST_CLYDE_STATE === -1) GAMEBOARD[p.x][p.y].chase = true;
  }
  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].pacman = true;
  }
  pacNode = GAMEBOARD[p.x][p.y];
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

function isWall(i, j) {
  if (GAMEBOARD[i][j] === 'Wall') return true;
  else return false;
}

function isGhost(i, j) {
  if (i >= 0 && i <= 25 && j >= 0 && j <= 28) {
    if (GAMEBOARD[i][j].blinky) { 
      if (GHOST_BLINKY_AFFRAID_TIMER === null || GHOST_BLINKY_STATE === -1) return true;
      else return false;
    }
    else if (GAMEBOARD[i][j].inky) {
      if (GHOST_INKY_AFFRAID_TIMER === null || GHOST_INKY_STATE === -1) return true;
      else return false;
    }
    else if (GAMEBOARD[i][j].pinky) {
      if (GHOST_PINKY_AFFRAID_TIMER === null || GHOST_PINKY_STATE === -1) return true;
      else return false;
    }
    else if (GAMEBOARD[i][j].clyde) {
      if (GHOST_CLYDE_AFFRAID_TIMER === null || GHOST_CLYDE_STATE === -1) return true;
      else return false;
    }
    else {
      return false;
    }
  }
  else return false;
}

function ghostRight(i, j) {
  for (var n = 1; n < 3; n++) {
    //for (var m = -2; m < 3; m++) {
      if (isGhost(i+n, j)) return true;
    //}
  }
  return false;
}

function ghostLeft(i, j) {
  for (var n = 1; n < 3; n++) {
   // for (var m = -2; m < 3; m++) {
      if (isGhost(i-n, j)) return true;
    //}
  }
  return false;
}

function ghostNorth(i, j) {
  for (var n = 1; n < 3; n++) {
    for (var m = -2; m < 3; m++) {
      if (isGhost(i+m, j-n)) return true;
    }
  }
  return false;
}

function ghostSouth(i, j) {
  for (var n = 1; n < 3; n++) {
    for (var m = -2; m < 3; m++) {
      if (isGhost(i+m, j+n)) return true;
    }
  }
  return false;
}

function selectMove() {
  buildGameboard();
  targetNode = breadthFirstPacman(pacNode, []);
  direction = getPacmanDirection(targetNode, pacNode);
  if (!PACMAN_DEAD && !GAMEOVER) {
    if (canMovePacman(direction)) {
      console.log(GHOST_BLINKY_STATE);
      console.log(GHOST_PINKY_STATE);
      console.log(GHOST_INKY_STATE);
      console.log(GHOST_CLYDE_STATE);
      movePacman(direction);
    }
  }
}

function breadthFirstPacman(node=pacNode, queue=[]) {
  var i = node.posX;
  var j = node.posY;
  GAMEBOARD[i][j].visited = true;
  queue.push(node);
  while (queue.length > 0) {
    node = queue.shift();
    i = node.posX;
    j = node.posY;
    if (i > 0) {
      if (!isWall(i-1, j) && !ghostLeft(i, j)) {
        if (!GAMEBOARD[i-1][j].visited) {
          GAMEBOARD[i-1][j].visited = true;
          GAMEBOARD[i-1][j].prev = GAMEBOARD[i][j];
          queue.push(GAMEBOARD[i-1][j]);
        }
      }
    }

    if (j > 0) {
      if (!isWall(i, j-1) && !ghostNorth(i, j)) {
        if (!GAMEBOARD[i][j-1].visited) {
          GAMEBOARD[i][j-1].visited = true;
          GAMEBOARD[i][j-1].prev = GAMEBOARD[i][j];
          queue.push(GAMEBOARD[i][j-1]);
        }
      }
    }

  if (i < 25) {
    if (!isWall(i+1, j) && !ghostRight(i, j)) {
      if (!GAMEBOARD[i+1][j].visited) {
        GAMEBOARD[i+1][j].prev = GAMEBOARD[i][j];
        GAMEBOARD[i+1][j].visited = true;
        queue.push(GAMEBOARD[i+1][j]);
      }
    }
  }

  if (j < 28) {
    if (!isWall(i, j+1) && !ghostSouth(i, j)) {
      if (!GAMEBOARD[i][j+1].visited) {
        GAMEBOARD[i][j+1].prev = GAMEBOARD[i][j];
        GAMEBOARD[i][j+1].visited = true;
        queue.push(GAMEBOARD[i][j+1]);
      }
    }
  }

  if (GAMEBOARD[i][j].chase || (!GAMEBOARD[i][j].eaten && (GAMEBOARD[i][j].superBubble || GAMEBOARD[i][j].bubble))) {
    GAMEBOARD[i][j].visited = true;
    return GAMEBOARD[i][j];
  }

  }
  //return GAMEBOARD[i][j];
}

function getPacmanDirection(target, pacman=pacNode) {
  var i = target.posX;
  var j = target.posY;
  if (i > 0 && GAMEBOARD[i-1][j] === pacman) {
    return 1;
  }
  else if (j > 0 && GAMEBOARD[i][j-1] === pacman) {
    return 2;
  }
  else if (i < 25 && GAMEBOARD[i+1][j] === pacman) {
    return 3;
  }
  else if (j < 28 && GAMEBOARD[i][j+1] === pacman) {
    return 4;
  }
  else {
    if (i < 25 && GAMEBOARD[i][j].prev === GAMEBOARD[i+1][j]) {
      return getPacmanDirection(GAMEBOARD[i+1][j], pacman);
    }
    else if (i < 28 && GAMEBOARD[i][j].prev === GAMEBOARD[i][j+1]) {
      return getPacmanDirection(GAMEBOARD[i][j+1], pacman);
    }
    else if (i > 0 && GAMEBOARD[i][j].prev === GAMEBOARD[i-1][j]) {
      return getPacmanDirection(GAMEBOARD[i-1][j], pacman);
    }
    else if (j > 0 && GAMEBOARD[i][j].prev === GAMEBOARD[i][j-1]) {
      return getPacmanDirection(GAMEBOARD[i][j-1], pacman);
    }
  }
}
//setInterval(drawDebug, 1000/3);
