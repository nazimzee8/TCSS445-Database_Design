
// find and replace CPM with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()

//Nazim Zerrouki
//Adam Shandi 
function CPM(game) {
    this.player = 1;
    this.currPlayer = 0;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "Dr. Mario";
    this.color = "White";
    this.cooldown = 0;
    this.direction = { x: randomInt(1600) - 800, y: randomInt(1600) - 800 };
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

CPM.prototype = new Entity();
CPM.prototype.constructor = CPM;

// alter the code in this function to create your agent
// you may check the state but do not change the state of these variables:
//    this.rocks
//    this.cooldown
//    this.x
//    this.y
//    this.velocity
//    this.game and any of its properties

// you may access a list of zombies from this.game.zombies
// you may access a list of rocks from this.game.rocks
// you may access a list of players from this.game.players

CPM.prototype.isVisited = function(searched, visited) {
    for (var i = 0; i < visited.length; i++) {
        if (visited[i] === searched) return true;
        else return false;
    }
}

CPM.prototype.isZombie = function(position) {
    for (var i = 0; i < this.game.zombies.length; i++) {
        for (var j = -1*this.radius; j <= this.radius; j++) {
            if (position.x+j === this.game.zombies[i].x && position.y+j === this.game.zombies[i].y) return true;
        }
    }
    return false;
}

CPM.prototype.selectAction = function () {

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null };
    var closest = 1000;
    var target = null;
    var closestRock = null;
    for (var i = 0; i < this.game.zombies.length; i++) {
        var ent = this.game.zombies[i];
        var dist = distance(ent, this);
        if (dist < closest) {
            closest = dist;
            target = ent;
        }
    }
    for (var i = 0; i < this.game.rocks.length; i++) {
        var ent = this.game.rocks[i];
        var dist = distance(ent, this);
        if (this.game.zombies.length >= 1) {
            if (dist < closest && dist < distance(target, ent)) {
                closest = dist;
                closestRock = ent;
            }
        }
        else {
            if (dist < closest) {
                closest = dist;
                closestRock = ent;
            }
        }
    }
    if (target) {
        action.target = target;
        if (distance(target, this) <= 100) action.throwRock = true;
    }
    if (target !== null && closestRock !== null && this.x >= 0 && this.x <= 800 && this.y >= 0 && this.y <= 800) {
        /*for (var i = 0; i < this.game.zombies.length; i++) {
            var zombie = this.game.zombies[i];
            if (distance(this, zombie) <= 100) {
                var distance = distance(this, zombie)
                var difX = zombie.x - this.x / distance;
                var difY = zombie.y - this.y / distance;
                action.direction.x += difX;
                action.direction.y += difY;
            }
        }*/
        if (distance(target, this) <= 100 || distance(closestRock, this) >= distance(closestRock, target) + 50) {
            action.direction.x += 100 * target.x - this.x;
            action.direction.y += 100 * target.x - this.x;
        }
        else if (this.rocks < 2 && distance(closestRock, this) < distance(closestRock, target)) {
            action.direction = direction(closestRock, this);
            action.direction.x += 100 * action.direction.x;
            action.direction.y += 100 * action.direction.y;
        }
        else if (this.rocks === 2 && this.cooldown === 0) {
            action.direction = direction(target, this);
            action.direction.x += 100 * action.direction.x;
            action.direction.y += 100 * action.direction.y;
        }
        else if (this.rocks < 2 && distance(closestRock, this) >= distance(closestRock, target)) /*|| distance(closestRock, this) >= distance(closestRock, target))*/ {
            //action.direction.x = 50 * (action.direction.x-direction(target, closestRock).x);
            //action.direction.y = 50 * (action.direction.y-direction(target, closestRock).y);
            //action.direction.x = 50 * (target.x - this.x / distance(target, this));
            //action.direction.y = 50 * (target.y - this.y / distance(target, this));
        }
    }
    return action;
};

/*CPM.prototype.selectAction = function () {

    var action = { direction: { x: this.direction.x, y: this.direction.y }, throwRock: false, target: null };
    var closest = Infinity;
    var target = null;
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    var direction;
    console.log(this.x);
    console.log(this.y);
    //var player = this.game.players[this.currPlayer];      
        for (var i = 0; i < this.game.zombies.length; i++) {
            var ent = this.game.zombies[i];
            var dist = distance(ent, this);
            if (dist < closest) {
                closest = dist;
                target = ent;
            }
        }
    closest = Infinity;
    /*for (var i = 0; i < this.game.rocks.length; i++) {
        var ent = this.game.rocks[i];
        var dist = distance(ent, this);
        if (dist < closest) {
            closest = dist;
            target = ent;
        }
    }
    if (target) {
        direction = direction(this, target);
        action.direction.x = direction.x;
        action.direction.y = -100*direction.y;
        action.throwRock = true;
        action.target = target;
    }
    else if (nearestZombie !== null && nearestRock !== null && this.rocks < 1) {
        var zombieVector = direction(this, nearestZombie);
        var rockVector = direction(this, nearestRock);
        action.direction.x = 10 *(rockVector.x - zombieVector.x);
        action.direction.y = 10 *(rockVector.y - zombieVector.y);
        for (i = 0; i < this.game.players.length; i++) {
            var player = this.game.players[i];
            action.direction = direction(player, target);
            if ((player.velocity.x < 0 && player.direction.x > 0) || player.velocity.x > 0 && player.direction.x < 0) {
                player.velocity.x = player.velocity.x * -1 * action.direction.x;
            }
            if ((player.velocity.y < 0 && player.direction.y > 0) || player.velocity.y > 0 && player.direction.y < 0) {
                player.velocity.y = player.velocity.y * -1 * action.direction.y;
            }
        }
        //this = target;
    }
    //console.log(direction(this, nearestZombie));
    if (this.currPlayer = this.game.players.length-1 || this.game.players.length === 1) this.currPlayer = 0;
    else this.currPlayer++;
    return action;
};*/

// do not change code beyond this point

CPM.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

CPM.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

CPM.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

CPM.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

CPM.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

CPM.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
        var target = this.action.target;
        var dir = direction(target, this);

        var rock = new Rock(this.game);
        rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
        rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
        rock.velocity.x = dir.x * rock.maxSpeed;
        rock.velocity.y = dir.y * rock.maxSpeed;
        rock.thrown = true;
        rock.thrower = this;
        this.game.addEntity(rock);
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

CPM.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};

/*CPM.prototype.searchRock = function(player, queue=[], visited=[]) {
    queue.push({x: player.x, y: player.y});
    visited.push(node);
    while (queue.length < 0) {
        var node = queue.shift();
        var x = node.x;
        var y = node.y;
        if (node.x+1 <= 800) var right = {x: node.x+1, y: node.y};
        else var right = null;

        if (node.x+1 <= 800 && node.y-1 >= 0) var upRight = {x: node.x+1, y: node.y-1};
        else var upRight = null;

        if (node.y-1 >= 0) var north = {x: node.x, y: node.y-1};
        else var north = null;

        if (node.x+1 <= 800 && node.y+1 <= 800) var downRight = {x: node.x+1, y: node.y+1};
        else var downRight = null;

        if (node.y+1 <= 800) var south = {x: node.x, y: node.y+1};
        else var south = null;

        if (node.x-1 >= 0 && node.y+1 <= 800) var downLeft = {x: node.x-1, y: node.y+1};
        else var downLeft = null;

        if (node.x-1 >= 0) var left = {x: node.x-1, y: node.y};
        else var left = null;

        if (node.x-1 >= 0 && node.y-1 >= 0) var upLeft = {x: node.x-1, y: node.y-1};
        else var upLeft = null;


        if (node.x === rock.x && node.y === rock.y) return node;
        else {
            if (right !== null && !this.isVisited(right, visited) && !this.isZombie(right)) {
                right.prev = node;
                queue.push(right);
                visited.push(right);
            }
            if (upRight !== null && !this.isVisited(upRight, visited) && !this.isZombie(upRight)) {
                upRight.prev = node;
                queue.push(upRight);
                visited.push(upRight);
            }
            if (north !== null && !this.isVisited(north, visited) && !this.isZombie(north)) {
                north.prev = node;
                queue.push(north);
                visited.push(north);
            }
            if (downRight !== null && !this.isVisited(downRight, visited) && !this.isZombie(downRight)) {
                downRight.prev = node;
                queue.push(downRight);
                visited.push(downRight);
            }
            if (south !== null && !this.isVisited(south, visited) && !this.isZombie(south)) {
                south.prev = node;
                queue.push(south);
                visited.push(south);
            }
            if (right !== null && !this.isVisited(right, visited) && !this.isZombie(right)) {
                right.prev = node;
                queue.push(right);
                visited.push(right);
            }
        }
    }
}*/