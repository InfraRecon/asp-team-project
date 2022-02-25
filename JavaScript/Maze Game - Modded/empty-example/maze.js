/*
Skip to content
Pull requests
Issues
Marketplace
Explore
@InfraRecon
HoangTran0410 /
p5js-playground
Public

1
5

    1

Code
Issues
Pull requests
Actions
Projects
Wiki
Security

    Insights

p5js-playground/2019/maze/maze.js /
@HoangTran0410
HoangTran0410 [Refactor] sort project by year
Latest commit 119bace on Mar 19
History
1 contributor
549 lines (460 sloc) 11.1 KB*/

var cols, rows, w;
var stack = [];
var cells = [];
var currentCell;

var player;
var coins = [];
var img;
var imgPlayer;
var imgChest;
var imgCoin;

var winSizeW;
var winSizeH;
var startPoint, endPoint;

var inOut = true;
var diam = 10;
const MAX_PARTICLE_COUNT = 25;
const MAX_TRAIL_COUNT = 10;

var colorScheme = ["#0A1B28", "#071F43", "#357D7E", "#35EEEE", "#919DF0","#FF0000"];
var trail = [];
var particles = [];


function setup() 
{
    winSizeW = 500;
	winSizeH = 500;
	createCanvas(winSizeW, winSizeH);
	strokeWeight(3);
	frameRate(30);
	imageMode(CENTER);
	pixelDensity(1);
	imgChest = loadImage("image/treasure.png");
	imgCoin = loadImage("image/coin.png");

	cols = 5;
	rows = 5;
	reset(cols, rows, floor(cols * 1.5));
}

function draw() 
{
    push();
    //translate(100,0);
    if (player.pos.x == endPoint % cols && player.pos.y == floor(endPoint / cols) &&
		coins.length == 0) 
    {
		cols += 2;
		rows += 2;
		reset(cols, rows, floor(cols * 1.5));
	}

	image(img, winSizeW / 2, winSizeH / 2, winSizeW, winSizeH);
    
    fill(0, 0,0);
    ellipse((endPoint % cols) * w + w / 2, floor(endPoint / cols) * w + w / 2, w/2, w/2)
    
	player.show();
	if(!player.auto)
    {
		player.move();
    }
	checkCoin(player.pos.x, player.pos.y);

	for (var i = 0; i < coins.length; i++) 
    {
		coins[i].show();
	}

	var m = atMouse();
	if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) 
    {
		noStroke();
		fill(242, 239, 58, 35);
		ellipse(m.x * w + w/2, m.y * w + w/2, w/3, w/3);
	}
    pop();
}

function keyPressed() 
{
	if (keyCode == LEFT_ARROW) 
    {
		player.direc = dir.left;

	} 
    else if (keyCode == RIGHT_ARROW) 
    {
		player.direc = dir.right;

	} 
    else if (keyCode == UP_ARROW) 
    {
		player.direc = dir.up;

	} 
    else if (keyCode == DOWN_ARROW) 
    {
		player.direc = dir.down;

	} 
    else if (keyCode == 13) 
    {
		reset(cols, rows, floor(cols * 1.5));

	} 
    else if (keyCode == 27) 
    {
		var a = prompt("Level: ");
		cols = Number(a) || cols;
		rows = Number(a) || rows;
		reset(cols, rows, floor(cols * 1.5));

	} 
    else if (keyCode == 123 || keyCode == 73) 
    {
		imgPlayer = null;
		return false;

	} 
    else if (keyCode == 65) 
    {
		player.auto = !player.auto;
	}
}

function mousePressed() 
{
	var m = atMouse();

	if (!paths.includes(cells[m.x + m.y * cols])) 
    {
		if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) 
        {
			reset_Astart(cells[player.pos.x + player.pos.y * cols]);
			A_star(cells[m.x + m.y * cols]);
		}
	} 
    else
    {
		var found = paths.findIndex(function(ele) 
        {
			return ele == cells[m.x + m.y * cols];
		});

		paths.splice(0, found);
		drawPaths();
	}
}

function mouseDragged() 
{
	mousePressed();
}

function atMouse() 
{
	return {
		x: floor(mouseX / w),
		y: floor(mouseY / w)
	};
}

function calculateMaze() 
{
	while (stack.length > 0) 
    {
		currentCell.visited = true;

		var next = currentCell.checkNeighbors();

		if (next) {
			next.visited = true;
			stack.push(currentCell);
			removeWalls(currentCell, next);
			currentCell = next;
		} 
        
        else if (stack.length > 0) {
			currentCell = stack.pop();
		}
	}

	for (var i = 0; i < cells.length; i++) 
    {
		cells[i].show();
	}
}

function reset(collum, row, numCoin) 
{
	img = createGraphics(winSizeW, winSizeH);
	img.pixelDensity(1);

	cols = collum;
	rows = row;
	w = width / cols;
	startPoint = floor(random(cols * rows));
	endPoint = floor(random(rows * rows));

	cells = [];
	stack = [];
	coins = [];
	for (var y = 0; y < rows; y++) {
		for (var x = 0; x < cols; x++) {
			cells.push(new Cell(x, y));
		}
	}

	currentCell = cells[startPoint];
	stack.push(currentCell);

	player = new Player(startPoint % cols, floor(startPoint / cols));
	for (var i = 0; i < numCoin; i++) {
		coins.push(new Coin(floor(random(cols)), floor(random(rows))));
	}
	clear();

	calculateMaze();

	for (var i = 0; i < cells.length; i++)
		cells[i].addNeighbors();

	reset_Astart(cells[startPoint]);
}

function index(x, y) 
{
	if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
		return -1;
	return x + y * cols;
}

function Cell(x, y) 
{
	this.x = x;
	this.y = y;
	this.walls = {
		top: true,
		right: true,
		bottom: true,
		left: true
	}; // top right bottom left
	this.visited = false;

	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.previous = undefined;

	this.checkNeighbors = function() {
		var neighbors = [];

		var top = cells[index(x, y - 1)];
		var right = cells[index(x + 1, y)];
		var bottom = cells[index(x, y + 1)];
		var left = cells[index(x - 1, y)];

		if (top && !top.visited) {
			neighbors.push(top);
		}
		if (right && !right.visited) {
			neighbors.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if (left && !left.visited) {
			neighbors.push(left);
		}

		if (neighbors.length > 0) {
			var r = floor(random(0, neighbors.length))
			return neighbors[r];
		} else {
			return null;
		}
	}

	this.addNeighbors = function() {
		this.neighbors = [];

		var top = cells[index(x, y - 1)];
		var right = cells[index(x + 1, y)];
		var bottom = cells[index(x, y + 1)];
		var left = cells[index(x - 1, y)];

		if (top && !this.walls.top) {
			this.neighbors.push(top);
		}
		if (right && !this.walls.right) {
			this.neighbors.push(right);
		}
		if (bottom && !this.walls.bottom) {
			this.neighbors.push(bottom);
		}
		if (left && !this.walls.left) {
			this.neighbors.push(left);
		}
	}

	this.show = function() {
		var posx = this.x * w;
		var posy = this.y * w;

		img.stroke(255);
		img.strokeWeight(2);
        var wallSize = 5;
		if (this.walls.top) {
			img.line(posx, posy, posx + w, posy)
            img.line(posx + wallSize, posy + wallSize, posx + w + wallSize, posy + wallSize)
		}
		if (this.walls.right) {
			img.line(posx + w, posy, posx + w, posy + w)
            img.line(posx + w + wallSize, posy + wallSize, posx + w + wallSize, posy + w + wallSize)
		}
		if (this.walls.bottom) {
			img.line(posx + w, posy + w, posx, posy + w)
            img.line(posx + w + wallSize, posy + w + wallSize, posx + wallSize, posy + w + wallSize)
		}
		if (this.walls.left) {
			img.line(posx, posy + w, posx, posy);
            img.line(posx + wallSize, posy + w + wallSize, posx + wallSize, posy + wallSize);
		}
	}
}

function removeWalls(a, b) {
	var x = a.x - b.x;
	if (x == 1) {
		a.walls.left = false;
		b.walls.right = false;
	} else if (x == -1) {
		a.walls.right = false;
		b.walls.left = false;
	}

	var y = a.y - b.y;
	if (y == 1) {
		a.walls.top = false;
		b.walls.bottom = false;
	} else if (y == -1) {
		a.walls.bottom = false;
		b.walls.top = false;
	}
}

function drawMap() 
{
	img.background(100);
	for (var i = 0; i < cells.length; i++) {
		cells[i].previous = undefined;
		cells[i].show();
	}
}


// ==============================================

var dir = {
	up: 1,
	down: 2,
	left: 3,
	right: 4,
	none: 0
};

function Player(x, y) 
{
	this.pos = createVector(x, y);
	this.direc = dir.none;
	this.score = 0;
	this.ro = 0;
	this.auto = false;
    this.x = 0;
    this.y = 0;
    this.shapeSize = w/10;

	this.show = function() 
    {
        push();
            translate(this.pos.x * w + w / 2, this.pos.y * w + w / 2);
            if (this.direc == dir.up) this.ro = -90;
            else if (this.direc == dir.down) this.ro = 90;
            else if (this.direc == dir.left) this.ro = 180;
            else if (this.direc == dir.right) this.ro = 0;

            drawLuminParticle(this.x,this.y,this.shapeSize,20);
        pop();


		if (this.auto) 
        {
			if (paths.length > 0)
            {
				var next = paths[paths.length - 1];

				if (this.pos.x < next.x) this.direc = dir.right;
				else if (this.pos.x > next.x) this.direc = dir.left;
				if (this.pos.y < next.y) this.direc = dir.down;
				else if (this.pos.y > next.y) this.direc = dir.up;

				// this.pos = createVector(next.x, next.y);
				paths.pop();
				this.move();
				drawMap();
				drawPaths();
			} 
            else 
            {
				this.direc = dir.none;
				this.auto = false;
			}
		}
	}

	this.move = function() 
    {
		if (this.direc == dir.up &&
			!cells[this.pos.x + this.pos.y * cols].walls.top) 
        {
			this.pos.y--;

		} else if (this.direc == dir.down &&
			!cells[this.pos.x + this.pos.y * cols].walls.bottom) 
        {
			this.pos.y++;

		} else if (this.direc == dir.left &&
			!cells[this.pos.x + this.pos.y * cols].walls.left) 
        {
			this.pos.x--;

		} else if (this.direc == dir.right &&
			!cells[this.pos.x + this.pos.y * cols].walls.right) 
        {
			this.pos.x++;
		}
		if (countWalls(cells[this.pos.x + this.pos.y * cols]) <= 1)
			this.direc = dir.none;
	}
}

function Coin(x, y) 
{
	this.x = x;
	this.y = y;
	this.frames = (random(-5,5));
	this.timeCount = 0;

	this.show = function() 
    {
		if (imgCoin)
        {
            fill(255,0,0);
            ellipse(this.x * w + w / 2,
                    this.y * w + w / 2,
                    w / 2 / this.frames,
                    w / 2 /this.frames);
            
            fill(255);
            ellipse(this.x * w + w / 2,
                    this.y * w + w / 2,
                    w / 3 / this.frames,
                    w / 3 /this.frames);
            
            push();
               /*// drawLuminParticle(this.x * w + w / 2,
                                  this.y * w + w / 2,
                                  w / 50,1);*/
            pop();
        }
        

		if (millis() - this.timeCount > 50) 
        {
			this.timeCount = millis();
			this.frames = (this.frames + 0.1) % 5;
			if (this.frames < 1) this.frames = 1;
		}
	}
}

function checkCoin(x, y) 
{
	for (var i = 0; i < coins.length; i++) {
		if (x == coins[i].x && y == coins[i].y) 
        {
			player.score++;
			coins.splice(i, 1);
            console.log(coins);
			return;
		}
	}
}

function countWalls(cell) 
{
	var count = 0;
	if (cell.walls.top) count++;
	if (cell.walls.bottom) count++;
	if (cell.walls.left) count++;
	if (cell.walls.right) count++;
	return count;
}



// Open and closed set
var openSet = [];
var closedSet = [];
var paths = [];

function A_star(end) {
	while (openSet.length > 0) {
		// Best next option
		var winner = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}
		var current = openSet[winner];

		// Did I finish?
		if (current === end) {
			openSet = [];

			addToPaths(current);
			drawPaths();

			break;
		}

		// Best option moves from openSet to closedSet
		removeFromArray(openSet, current);
		closedSet.push(current);

		// Check all the neighbors
		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			// Valid next spot?
			if (!closedSet.includes(neighbor)) {
				var tempG = current.g + heuristic(neighbor, current);

				// Is this a better path than before?
				var newPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				// Yes, it's a better path
				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
		}
	}
}

function reset_Astart(start) 
{
	openSet = [];
	closedSet = [];
	paths = [];
	openSet.push(start);

	drawMap();
}

function addToPaths(ele) 
{
	paths = [];
	paths.push(ele);
	while (ele.previous) 
    {
		paths.push(ele.previous);
		ele = ele.previous;
	}
}

function drawPaths() 
{
	drawMap();
	img.noFill();
	img.stroke(255, 100);
	img.strokeWeight(w / 2);
	img.beginShape();
	for (var i = 0; i < paths.length; i++) 
    {
		img.vertex(paths[i].x * w + w / 2, paths[i].y * w + w / 2);
	}
	img.endShape();
}

//Draws a luminous particle
function drawLuminParticle(x,y,size,randomPart)
{
    blendMode(BLEND);
    blendMode(SCREEN);
    blendMode(ADD);

    // Trim end of trail.
    trail.push([x + random(-randomPart,randomPart), y + random(-randomPart,randomPart)]);

    let removeCount = 1;
    if (mouseIsPressed && mouseButton == CENTER) 
    {
        removeCount++;
    }

    for (let i = 0; i < removeCount; i++) 
    {
        if (trail.length == 0) {
            break;
        }

        if (mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
            trail.splice(0, 1);
        }
    }

    // Spawn particles.
    if (trail.length > 1) {
        let mouse = new p5.Vector(x, y);
        mouse.sub(pmouseX, pmouseY);
        if (mouse.mag() > 5) 
        {
            mouse.normalize();
            for (let i = 0; i < 3; i++) 
            {
                particles.push(new Particle(pmouseX, pmouseY, mouse.x, mouse.y));
            }
        }
    }

    // Move and kill particles.
    for (let i = particles.length - 1; i > -1; i--) 
    {
        particles[i].move();
        if (particles[i].vel.mag() < 0.1) 
        {
            particles.splice(i, 1);
        }
    }

    // Draw trail.
    drawingContext.shadowColor = color(0, 125, 255);

    for (let i = 0; i < trail.length; i++) 
    {
        let mass = i * 1.5;
        drawingContext.shadowBlur = mass;

        stroke(255);
        strokeWeight(mass);
        point(trail[i][0], trail[i][1]);
    }

    // Draw particles.
    for (let i = 0; i < particles.length; i++) 
    {
        let p = particles[i];
        let mass = p.mass * p.vel.mag() * 0.6;

        drawingContext.shadowColor = color(colorScheme[p.colorIndex]);
        drawingContext.shadowBlur = mass;

        stroke(255,0,0);
        strokeWeight(mass * 0.05);

        fill(255,0,0);
        ellipse(x, y,size);

        if(diam > w)
        {
            inOut = false;
        }

        if(diam < w/2)
        {
            inOut = true;
        }

        if(inOut)
        {
            diam += 0.0005;
        }

        if(!inOut)
        {
            diam -= 0.0005;
        }
    }
}

// Function to delete element from the array
function removeFromArray(arr, elt) 
{
	// Could use indexOf here instead to be more efficient
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elt) {
			arr.splice(i, 1);
		}
	}
}

function heuristic(a, b) 
{
	var d = dist(a.i, a.j, b.i, b.j);
	// var d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

window.oncontextmenu = function() {
	player.auto = true;
	return false;
}

 /*   © 2021 GitHub, Inc.

    Terms
    Privacy
    Security
    Status
    Docs
    Contact GitHub
    Pricing
    API
    Training
    Blog
    About

Loading complete*/