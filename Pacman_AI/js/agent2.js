var board = [];
var startX = Math.floor(26 / 2) - 1;
var startY = Math.floor(29 / 2) - 1;
var bubbleCount = 0;
var superBubbleCount = 0;
var nullSpaces = 0;
var emptySpaces;
var TOTAL_SPACES = 26*29;
var continues = true;
var listNode = [];
var listIndex = -1;
selectMove(board[startPacman.i][startPacman.j]);

class Node {
  constructor(i, j, created) {
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
    this.path = new Path();
    this.ghost_path = new Path();
    this.weight = Infinity;
    this.ghostWeight = Infinity;
    this.index = 0;
  }

  constructor(i, j, left, right, north, south, created) {
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
    this.path = new Path();
    this.ghost_path = new Path();
    this.weight = Infinity;
    this.ghostWeight = Infinity;
    this.index = 0;
  }

  push(node) {
      this.path.push(node);
  }
  pop(node) {
      this.path.pop(node);
  }
}

var startNode = new Node(startX, startY, false);

class Path {
  constructor() {
    this.directions = [];
    this.length = 0;
    this.hasGhost = false;
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
  listIndex++;
  node.index = listIndex;
  board[i][j] = node;
  listNodes.push(node);
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

board = buildGameboard(board, startNode, startX, startY, 26, 29, 26 * 29);

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
var numOfGhosts = 4;*/

function resetPath(node) {
    if (node.left === null || node.right === null || node.north === null || node.south === null) {
        return;
    }
    node.searched = false;
    node.weight = 0;
    node.ghostWeight = 0;
    node.path.hasGhost = false;
    node.path = [];
    node.ghost_path = [];
    if (node.right != null)
        resetPath(node.right);
    if (node.south != null) 
        resetPath(node.south)
    if (node.left != null)
        resetPath(node.left)
    if (node.north != null)
        resetPath(node.north)

}

function checkForGhost(node) {
    var blinkyXY = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
    var pinkyXY = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
    var inkyXY = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
    var clydeXY = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
    if (node.i === blinkyXY.x && node.j === blinkyXY.y) {
      node.blinky = true;
    }
    else
      node.blinky = false;
    if (node.i === pinkyXY.x && node.j === pinkyXY.y) {
      node.pinky = true;
    }
    else
      node.pinky = false;
    if (node.i === inkyXY.x && node.j === inkyXY.x) {
      node.inky = true;
    }
    else
      node.inky = false;
    if (node.i === clydeXY.x && node.j === clydeXY.y) {
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

  function swap(queue) {
    var temp = [];
    temp[0] = queue[1];
    temp[1] = queue[0];
    return temp;
  }

  /*function reverse(queue) {
      reverse(queue, Math.floor(queue.length/2));
  } 
  function reverse(queue, n) {
      if (n === 1) {
          return;
      }
      temp = queue.subarray(0, n);
      queue.subarray(0, n) = queue.subarray(n, queue.length);
      queue.subarray(n, queue.length) = temp; 
      reverse(queue.subarray(0, n), n/2);
      reverse(queue.subarray(n, queue.length), 3n/2);
  }*/

  function reverse(queue) {
    var temp;
    for (var i = queue.length-1; i >= 0; i--) {
      temp[i-queue.length-1] = queue[i];
    }
    return temp;
  }

//var minPath = new Path();

function adjacentBubble(node) {
    if (node.right != null && node.right.bubble)
        return {bubble: true, direction: 1, node: node.right};
    if (node.south != null && node.south.bubble)
        return {bubble: true, direction: 2, node: node.south};
    if (node.left != null && node.left.bubble)
        return {bubble: true, direction: 3, node: node.left};
    if (node.north != null && node.north.bubble)
        return {bubble: true, direction: 4, node: node.north};
    else
        return {bubble: false, direction: 0};
}

var ghostReached = false;
var min = Infinity;
var queue = [];
var closestNode = new Node();
var minIndex = 0;

function selectMove() {
    var pacman = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    var node = board[pacman.x][pacman.y];
    min = Infinity;
    queue = [];
    listNode = [];
    minPath = new Node();
    resetPath(node);
    if (node.bubble) {
        node.bubble = false;
        node.eaten = true;
    }
    if (node.superBubble) {
        PACMAN_SUPER = true;
        node.superBubble = false;
        node.eaten = true;
    }
    board[node.i][node.j] = node;
    if (canMovePacman(1) && !PACMAN_MOVING && minPath.pop() === 1) {
        movePacman(1);
    }
    else if (canMovePacman(2) && !PACMAN_MOVING && minPath.pop() === 2) {
        movePacman(2);
    }
    else if (canMovePacman(3) && !PACMAN_MOVING && minPath.pop() === 3) {
        movePacman(3);
    }
    else if (canMovePacman(4) && !PACMAN_MOVING && minPath.pop() === 4) {
        movePacman(4);
    }

}

function distFromGhost(node) {
    distFromGhost(node, node)
}

function distFromGhost(node, path) {
    if (ghostReached) {
        if (min > node.ghostWeight+1) {
            min = node.ghostWeight+1;
            closestNode = node;
            minIndex = node.index;
        }
        return 1;
    }
    /*if (ghostReached && !mini) {
        if (max < node.ghostWeight+1) {
            max = node.ghostWeight+1;
            farthestNode = node;
            maxIndex = node.index;
        }
    }*/
    else {
        if (node.right != null) {
            if (hasGhost(node.right)) {
                ghostReached = true;
            }
            path.ghost_path.push(1);
            node.right.ghostWeight = 1 + distFromGhost(node.right, path)
            listNode[node.right.index].ghostWeight = node.right.ghostWeight;
        }
        if (node.south != null) {
            if (hasGhost(node.south)) {
                ghostReached = true;
            }
            path.ghost_path.push(2);
            node.south.ghostWeight = 1 + distFromGhost(node.south, path);
            listNode[node.south.index].ghostWeight = node.south.ghostWeight;
        }
        if (node.left != null) {
            if (hasGhost(node.left)) {
                ghostReached = true;
            }
            path.ghost_path.push(3);
            node.left.ghostWeight = 1 + distFromGhost(node.left, path);
            listNode[node.left.index].ghostWeight = node.left.ghostWeight;
        }
        if (node.north != null) {
            if (hasGhost(node.north)) {
                ghostReached = true;
            }
            path.ghost_path.push(4);
            node.north.ghostWeight =  1 + distFromGhost(node.north, path);
            listNode[node.north.index].ghostWeight = node.north.ghostWeight;
        }
    }
}

function closestGhost(closestNode, minIndex) {
    listNode[minIndex].ghostWeight = closestNode.ghostWeight;
    listNode[minIndex].ghost_path = reverse(listNode[minIndex].ghost_path);
    return listNode[minIndex];
}

/*function eatGhost(node) {
    var pacman = get(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if (node.superBubble && node.i === pacman.x && pacman.y) {
        return true;
    }
    else
        return false;
}*/

function closestPath(node, Super) {
    closestPath(node, node, 1, Super);
}

/*{x: GAMEBOARD[i][j].x,  y: GAMEBOARD[i][j].y}

list_Bubbles[0].x
list_Bubbles[0].y*/

function closestPath(node, path, weight, Super) {
    min = Infinity;
    ghostReached = false;
    var right = path;
    var south = path;
    var left = path;
    var north = path;
    var right_weight = weight;
    var south_weight = weight;
    var left_weight = weight;
    var north_weight = weight;
    checkForGhost(node);
    checkForGhost(node.right);  
    checkForGhost(node.south);
    checkForGhost(node.left);
    checkForGhost(node.north);

    if (node.superBubble && Super) {
        distFromGhost(node);
        path.ghostWeight = closestGhost(closestNode, minIndex).weight;
        queue.push(path)
        queue[queue.length-1] = reverse(queue[queue.length-1]);
        if (queue.length > 1) {
            if (queue[1].weight >= queue[0].weight && !queue[0].hasGhost && GHOST_MOVING_SPEED * queue[0].ghostWeight > PACMAN_MOVING_SPEED * queue[0].weight) {
                queue.pop();
            }
            else if (queue[1].weight < queue[0].weight && !queue[1].path.hasGhost && GHOST_MOVING_SPEED * queue[1].ghostWeight > PACMAN_MOVING_SPEED * queue[1].weight) {
                queue = swap(queue); 
                queue.pop();
            }
            else if (!queue[0].path.hasGhost && GHOST_MOVING_SPEED * queue[0].ghostWeight > PACMAN_MOVING_SPEED * queue[0].weight) {
                queue.pop();
            }
            else if (!queue[1].path.hasGhost && GHOST_MOVING_SPEED * queue[1].ghostWeight > PACMAN_MOVING_SPEED * queue[1].weight)
                queue = swap(queue);
                queue.pop();
        }
        return queue;
    }

    else if (node.bubble && !Super) {
        //path.weight = weight;
        distFromGhost(node);
        path.ghostWeight = closestGhost(closestNode, minIndex).weight;
        queue.push(path)
        if (queue.length > 1) {
            queue[0].path.reverse(queue[0].path);
            queue[1].path.reverse(queue[1].path);
            if (queue[1].weight >= queue[0].weight && GHOST_MOVING_SPEED * queue[0].ghostWeight > PACMAN_MOVING_SPEED * queue[0].weight) {
                queue.pop();
            }
            else if (queue[1].weight < queue[0].weight && !queue[1].path.hasGhost && GHOST_MOVING_SPEED * queue[1].ghostWeight > PACMAN_MOVING_SPEED * queue[1].weight) {
                queue = swap(queue);
                queue.pop();
            }
            else if (!queue[0].path.hasGhost && GHOST_MOVING_SPEED * queue[0].ghostWeight > PACMAN_MOVING_SPEED * queue[0].weight) {
                queue.pop();
            }
            else if (!queue[1].path.hasGhost && GHOST_MOVING_SPEED * queue[1].ghostWeight > PACMAN_MOVING_SPEED * queue[1].weight)
                queue = swap(queue);
                queue.pop();
        }
        return queue;
    }
    else {
        if (canMovePacman(1) && node.right != null && !node.right.bubble && !node.right.searched) {
            node.right.searched = true;
            right.push(1);
            if (hasGhost(node.right)) {
                right.path.hasGhost = true;
            }
            if (adjacentBubble(node).bubble) {
                right.push(adjacentBubble(node).direction)
                closestPath(adjacentBubble(node).node, right, right_weight+1, Super);
            }
            else
                closestPath(node.right, right, right_weight+1, Super);
        }
        if (canMovePacman(2) && node.south != null && !node.south.bubble && !node.south.searched) {
            node.south.searched = true;
            south.push(2);
            if (hasGhost(node.south)) {
                south.path.hasGhost = true;
            }
            if (adjacentBubble(node).bubble) {
                south.push(adjacentBubble(node).direction)
                closestPath(adjacentBubble(node).node, south, south_weight+1, Super)
            }
            else
                closestPath(node.south, south, south_weight+1, Super);
        }
        if (canMovePacman(3) && node.left != null && !node.left.bubble && !node.left.searched) {
            node.left.searched = true;
            left.push(3);
            if (hasGhost(node.left)) {
                left.path.hasGhost = true;
            }
            if (adjacentBubble(node).bubble) {
                left.push(adjacentBubble(node).direction)
                closestPath(adjacentBubble(node).node, left, left_weight+1, Super)
            }
            else
                closestPath(node.left, left, left_weight+1, Super);
        }
        if (canMovePacman(4) && node.north != null && !node.north.bubble && !node.north.searched) {
            node.north.searched = true;
            north.push(4);
            if (hasGhost(node.north)) {
                north.path.hasGhost = true;
            }
            if (adjacentBubble(node).bubble) {
                north.push(adjacentBubble(node).direction)
                closestPath(adjacentBubble(node).node, north, north_weight+1, Super);
            }
            else
                closestPath(node.north, north, north_weight+1, Super)
        }
    }

    function fleeBlinky(node) {
        var blinkyXY = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
        var x = blinkyXY.x;
        var y = blinkyXY.y;
        var direction = GHOST_BLINKY_DIRECTION;
        if (node.i === x && direction === 1 && board[x][y].right != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.i === x && direction === 3 && board[x][y].left != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 2 && board[x][y].south != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 4 && board[x][y].north != null) {
            return {flee: true, moveTo: direction}
        }
        else
            return false;
      }
      
      function fleePinky(node) {
        var pinkyXY = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
        var x = pinkyXY.x;
        var y = pinkyXY.y;
        var direction = GHOST_PINKY_DIRECTION;
        if (node.i === x && direction === 1 && board[x][y].right != null) {
          return {flee: true, moveTo: direction}
        }
        else if (node.i === x && direction === 3 && board[x][y].left != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 2 && board[x][y].south != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 4 && board[x][y].north != null) {
          return {flee: true, moveTo: direction}
        }
        else
          return false;
      }
      
      function fleeInky(node) {
        var inkyXY = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
        var x = inkyXY.x;
        var y = inkyXY.y;
        var direction = GHOST_INKY_DIRECTION;
        if (node.i === x && direction === 1 && board[x][y].right != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.i === x && direction === 3 && board[x][y].left != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 2 && board[x][y].south != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 4 && board[x][y].north != null) {
            return {flee: true, moveTo: direction}
        }
        else
            return false;
      }
      
      function fleeClyde(node) {
        var clydeXY = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
        var x = clydeXY.x;
        var y = clydeXY.y;
        var direction = GHOST_CLYDE_DIRECTION;
        if (node.i === x && direction === 1 && board[x][y].right != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.i === x && direction === 3 && board[x][y].left != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 2 && board[x][y].south != null) {
            return {flee: true, moveTo: direction}
        }
        else if (node.j === y && direction === 4 && board[x][y].north != null) {
            return {flee: true, moveTo: direction}
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

    function chaseGhosts(node) {
      minPath = closestGhost(closestNode, minIndex).ghost_path;
    }
      
}

setInterval(drawDebug, 1000/3);
