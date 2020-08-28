// Tic Tac Toe
var Agent = function () {

}

class Node {
    constructor() {
        this.score = null,
        this.move = null;
        this.positions = [];
        this.board = new GameBoard();
    }
}

var currentRoot = new Node();

Agent.prototype.create = function(root=new Node(), depth) {
    if (depth === 0) {
        return root;
    }
    else {
        if (root.positions.length === 0) {
            for (var i = 0; i < depth; i++) {
                root.positions.push(new Node());
            }
        }
        for (var i = 0; i < depth; i++) {
            this.create(root.positions[i], depth-1);
        }
    }
}

Agent.prototype.minimax = function(root, board, isMax) {
    if (board.gameOver() === 1) {
        root.score = 1;
        return root.score;
    }
    else if (board.gameOver() === 2) {
        root.score = -1;
        return root.score;
    }
    else if (board.gameOver() === 3) {
        root.score = 0;
        return root.score;
    }
    else {
        var max = -Infinity;
        var min = Infinity;
        var validMoves = this.getValidMoves(board.clone());
        for (var i = 0; i < root.positions.length; i++) {
            root.positions[i].board = board.clone();
            root.positions[i].board.move(validMoves[i]);
            root.positions[i].move = validMoves[i];
        }
        for (var i = 0; i < root.positions.length; i++) {
            if (isMax) {
                var bestScore = this.minimax(root.positions[i], root.positions[i].board, false);
                max = Math.max(max, bestScore);
                root.score = max;
            }
            else {
                var bestScore = this.minimax(root.positions[i], root.positions[i].board, true);
                min = Math.min(min, bestScore);
                root.score = min;
            }
        }
        return root.score;
    }
}

Agent.prototype.getValidMoves = function(board) {
    var validMoves = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) {
            validMoves.push(i);
        }
    }
    return validMoves;
}

Agent.prototype.evaluate = function(root, board) {
    var validOptions = [];
    var bestScore;
    if (board.playerOne) bestScore = -Infinity;
    else bestScore = Infinity;
    for (var i = 0; i < root.positions.length; i++) {
        var score = root.positions[i].score;
        if (board.playerOne) bestScore = Math.max(bestScore, score);
        else bestScore = Math.min(bestScore, score);
    }
    for (var i = 0; i < root.positions.length; i++) {
        if (root.positions[i].score === bestScore) validOptions.push(root.positions[i]);
    }
    return validOptions;
}

var miniMaxTree = new Node();
Agent.prototype.selectMove = function(board) {
    var that = board.clone();
    var rounds = 9 - that.X.length - that.O.length;
    this.create(currentRoot, rounds);
    this.minimax(currentRoot, that, that.playerOne);
    var freeCells = this.evaluate(currentRoot, that);
    return freeCells[0].move;
}

