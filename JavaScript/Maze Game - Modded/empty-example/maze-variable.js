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
549 lines (460 sloc) 11.1 KB
Modified by Roberto Bliaja
*/

var mazeSketch = function(p){
    var cols, rows, w;
    var stack = [];
    var cells = [];
    var times = [];
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
    
    var timer = 0;
    var level = 0;
    var tab = 0;

    p.setup = function() 
    {
        winSizeW = 500;
        winSizeH = 500;
        p.createCanvas(winSizeW, winSizeH);
        p.strokeWeight(3);
        p.frameRate(30);
        p.imageMode(p.CENTER);
        p.pixelDensity(1);
        imgChest = p.loadImage("image/treasure.png");
        imgCoin = p.loadImage("image/coin.png");

        cols = 5;
        rows = 5;
        p.reset(cols, rows, p.floor(cols * 1.5));
    }
    
    p.draw = function() 
    {
        if (player.pos.x == endPoint % cols && player.pos.y == p.floor(endPoint / cols) &&
            coins.length == 0) 
        {
            cols += 2;
            rows += 2;
            
            times.push(p.timeClock(true));
            level++;
            p.reset(cols, rows, p.floor(cols * 1.5));
            p.localStore();
        }

        p.image(img, winSizeW / 2, winSizeH / 2, winSizeW, winSizeH);

        p.fill(0, 0,0);
        p.ellipse((endPoint % cols) * w + w / 2, p.floor(endPoint / cols) * w + w / 2, w/2, w/2)

        player.show();
        if(!player.auto)
        {
            player.move();
        }
        p.checkCoin(player.pos.x, player.pos.y);

        for (var i = 0; i < coins.length; i++) 
        {
            coins[i].show();
        }

        var m = p.atMouse();
        if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) 
        {
            p.noStroke();
            p.fill(255,100);
            p.ellipse(m.x * w + w/2, m.y * w + w/2, w/3, w/3);
        }
        
        p.timeClock(times);
    }
    
    p.keyPressed = function() 
    {
        if (p.keyCode == p.LEFT_ARROW) 
        {
            player.direc = dir.left;

        } 
        else if (p.keyCode == p.RIGHT_ARROW) 
        {
            player.direc = dir.right;

        } 
        else if (p.keyCode == p.UP_ARROW) 
        {
            player.direc = dir.up;

        } 
        else if (p.keyCode == p.DOWN_ARROW) 
        {
            player.direc = dir.down;

        } 
        else if (p.keyCode == 13) 
        {
            reset(cols, rows, p.floor(cols * 1.5));

        } 
        else if (p.keyCode == 27) 
        {
            var a = prompt("Level: ");
            cols = Number(a) || cols;
            rows = Number(a) || rows;
            reset(cols, rows, floor(cols * 1.5));

        } 
        else if (p.keyCode == 123 || p.keyCode == 73) 
        {
            imgPlayer = null;
            return false;

        } 
        else if (p.keyCode == 65) 
        {
            player.auto = !player.auto;
        }
    }
    
    p.mousePressed = function() 
    {
        var m = p.atMouse();

        if (!paths.includes(cells[m.x + m.y * cols])) 
        {
            if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) 
            {
                p.reset_Astart(cells[player.pos.x + player.pos.y * cols]);
                p.A_star(cells[m.x + m.y * cols]);
            }
        } 
        else
        {
            var found = paths.findIndex(function(ele) 
            {
                return ele == cells[m.x + m.y * cols];
            });

            paths.splice(0, found);
            p.drawPaths();
        }
    }

    p.mouseDragged = function() 
    {
        p.mousePressed();
    }

    p.atMouse = function() 
    {
        return {
            x: p.floor(p.mouseX / w),
            y: p.floor(p.mouseY / w)
        };
    }
 
    p.calculateMaze = function() 
    {
        while (stack.length > 0) 
        {
            currentCell.visited = true;

            var next = currentCell.checkNeighbors();

            if (next) {
                next.visited = true;
                stack.push(currentCell);
                p.removeWalls(currentCell, next);
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

    p.reset = function(collum, row, numCoin) 
    {
        img = p.createGraphics(winSizeW, winSizeH);
        img.pixelDensity(1);

        cols = collum;
        rows = row;
        w = p.width / cols;
        startPoint = p.floor(p.random(cols * rows));
        endPoint = p.floor(p.random(rows * rows));

        cells = [];
        stack = [];
        coins = [];
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                cells.push(new p.Cell(x, y));
            }
        }

        currentCell = cells[startPoint];
        stack.push(currentCell);

        player = new p.Player(startPoint % cols, p.floor(startPoint / cols));
        for (var i = 0; i < numCoin; i++) {
            coins.push(new p.Coin(p.floor(p.random(cols)), p.floor(p.random(rows))));
        }
        p.clear();

        p.calculateMaze();

        for (var i = 0; i < cells.length; i++)
            cells[i].addNeighbors();

        p.reset_Astart(cells[startPoint]);
    }

    p.index = function(x, y) 
    {
        if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
            return -1;
        return x + y * cols;
    }
    
    p.Cell = function(x, y) 
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

            var top = cells[p.index(x, y - 1)];
            var right = cells[p.index(x + 1, y)];
            var bottom = cells[p.index(x, y + 1)];
            var left = cells[p.index(x - 1, y)];

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
                var r = p.floor(p.random(0, neighbors.length))
                return neighbors[r];
            } else {
                return null;
            }
        }

        this.addNeighbors = function() {
            this.neighbors = [];

            var top = cells[p.index(x, y - 1)];
            var right = cells[p.index(x + 1, y)];
            var bottom = cells[p.index(x, y + 1)];
            var left = cells[p.index(x - 1, y)];

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
            img.strokeWeight(5);
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
    
    p.removeWalls = function(a, b) 
    {
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

    p.drawMap = function() 
    {
        img.background(200,150,0);
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

    p.Player = function(x, y) 
    {
        this.pos = p.createVector(x, y);
        this.direc = dir.none;
        this.score = 0;
        this.ro = 0;
        this.auto = false;
        this.x = 0;
        this.y = 0;
        this.shapeSize = w/10;

        this.show = function() 
        {
            p.push();
                p.translate(this.pos.x * w + w / 2, this.pos.y * w + w / 2);
                if (this.direc == dir.up) this.ro = -90;
                else if (this.direc == dir.down) this.ro = 90;
                else if (this.direc == dir.left) this.ro = 180;
                else if (this.direc == dir.right) this.ro = 0;

                p.drawLuminParticle(this.x,this.y,this.shapeSize,20);
            p.pop();


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
                    p.drawMap();
                    p.drawPaths();
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
    
    p.Coin = function(x, y) 
    {
        this.x = x;
        this.y = y;
        this.frames = (p.random(-5,5));
        this.timeCount = 0;

        this.show = function() 
        {
            if (imgCoin)
            {
                p.fill(255,0,0);
                p.ellipse(this.x * w + w / 2,
                        this.y * w + w / 2,
                        w / 2 / this.frames,
                        w / 2 /this.frames);

                p.fill(255);
                p.ellipse(this.x * w + w / 2,
                        this.y * w + w / 2,
                        w / 3 / this.frames,
                        w / 3 /this.frames);

                p.push();
                   /*// drawLuminParticle(this.x * w + w / 2,
                                      this.y * w + w / 2,
                                      w / 50,1);*/
                p.pop();
            }


            if (p.millis() - this.timeCount > 50) 
            {
                this.timeCount = p.millis();
                this.frames = (this.frames + 0.1) % 5;
                if (this.frames < 1) this.frames = 1;
            }
        }
    }

    p.checkCoin = function(x, y) 
    {
        for (var i = 0; i < coins.length; i++) {
            if (x == coins[i].x && y == coins[i].y) 
            {
                tab = player.score++;
                coins.splice(i, 1);
                console.log(coins);
                return;
            }
        }
    }
    
    countWalls = function(cell) 
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
    
    p.A_star = function(end) {
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

                p.addToPaths(current);
                p.drawPaths();

                break;
            }

            // Best option moves from openSet to closedSet
            p.removeFromArray(openSet, current);
            closedSet.push(current);

            // Check all the neighbors
            var neighbors = current.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!closedSet.includes(neighbor)) {
                    var tempG = current.g + p.heuristic(neighbor, current);

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
                        neighbor.h = p.heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
        }
    }
    
    p.reset_Astart = function(start) 
    {
        openSet = [];
        closedSet = [];
        paths = [];
        openSet.push(start);

        p.drawMap();
    }

    p.addToPaths = function(ele) 
    {
        paths = [];
        paths.push(ele);
        while (ele.previous) 
        {
            paths.push(ele.previous);
            ele = ele.previous;
        }
    }

    p.drawPaths = function() 
    {
        p.drawMap();
        img.noFill();
        img.stroke(0, 100);
        img.strokeWeight(w / 2);
        img.beginShape();
        for (var i = 0; i < paths.length; i++) 
        {
            img.vertex(paths[i].x * w + w / 2, paths[i].y * w + w / 2);
        }
        img.endShape();
    }
    
    //Draws a luminous particle
    p.drawLuminParticle = function(x,y,size,randomPart)
    {
        p.blendMode(p.BLEND);
        p.blendMode(p.SCREEN);
        p.blendMode(p.ADD);

        // Trim end of trail.
        trail.push([x + p.random(-randomPart,randomPart), y + p.random(-randomPart,randomPart)]);

        let removeCount = 1;
        if (p.mouseIsPressed && p.mouseButton == p.CENTER) 
        {
            removeCount++;
        }

        for (let i = 0; i < removeCount; i++) 
        {
            if (trail.length == 0) {
                break;
            }

            if (p.mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
                trail.splice(0, 1);
            }
        }

        // Spawn particles.
        if (trail.length > 1) {
            var mouse = new p5.Vector(x, y);
            mouse.sub(p.pmouseX, p.pmouseY);
            if (mouse.mag() > 5) 
            {
                mouse.normalize();
                for (let i = 0; i < 3; i++) 
                {
                    particles.push(new Particle(p,p.pmouseX, p.pmouseY, mouse.x, mouse.y));
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
        p.drawingContext.shadowColor = p.color(0, 125, 255);

        for (let i = 0; i < trail.length; i++) 
        {
            let mass = i * 1.5;
            p.drawingContext.shadowBlur = mass;

            p.stroke(255);
            p.strokeWeight(mass);
            p.point(trail[i][0], trail[i][1]);
        }

        // Draw particles.
        for (let i = 0; i < particles.length; i++) 
        {
            var parts = particles[i];
            var mass = parts.mass * parts.vel.mag() * 0.6;
            
            p.drawingContext.shadowColor = p.color(colorScheme[parts.colorIndex]);
            p.drawingContext.shadowBlur = mass;

            p.stroke(255,0,0);
            p.strokeWeight(mass * 0.05);

            p.fill(255,0,0);
            p.ellipse(x, y,size);

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
    p.removeFromArray = function(arr, elt) 
    {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    p.heuristic = function(a, b) 
    {
        var d = p.dist(a.i, a.j, b.i, b.j);
        // var d = abs(a.i - b.i) + abs(a.j - b.j);
        return d;
    }
    
    p.timeClock = function(stopTime)
    {
        if (p.frameRate() % 30) 
        { 
            //if the frameCount is divisible by 60, then a second has passed. it will stop at 0
            timer ++;
            p.textSize(20);
            p.stroke(0);
            p.strokeWeight(2);
            
            var realTimeSeconds = p.round(timer/30,1);
            if(realTimeSeconds < 60)
            {
                p.text("Time: " + realTimeSeconds + "'s",0, 20); 
                if (stopTime == true)
                {
                    return realTimeSeconds;
                }
            }
            else if(realTimeSeconds > 60)
            {
                var realTimeMinutes = p.round(realTimeSeconds/60 * 1,2);
                p.text("Time: " + realTimeMinutes + "'m",0, 20);
                if (stopTime == true)
                {
                    return realTimeMinutes;
                }
            }
        }
        
        if(times != "")
        {
            p.text(times + "'s",0, 40);
        }
    }
    
    p.localStore = function()
    {
        compileGameData(p,"MAZEGAMETIME",0,times[times.length -1],false,0);
        compileGameData(p,"MAZEGAMELEVEL",1,level,false,0);
        compileGameData(p,"MAZEGAMETAB",2,tab,false,0);
    }

    window.oncontextmenu = function() {
        player.auto = true;
        return false;
    }
}