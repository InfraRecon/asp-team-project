var numBubblesSketch = function(p)
{
    let numBalls = 5;
    let spring = 0.05;
    let gravity = 0.01;
    let friction = -0.05;
    let balls = [];
    var sumResult;
    var argNum1;
    var symbol = ['x','/','+','-'];
    var argNum2;
    var ballSum = [];
    var ballResult = [];
    var randomSolution;

    var diam = 50;
    var inOut = true;

    var gameResult = 0;

    const MAX_PARTICLE_COUNT = 0;
    const MAX_TRAIL_COUNT = 2;

    var colorScheme = ["#0A1B28", "#071F43", "#357D7E", "#35EEEE", "#919DF0"];
    var trail = [];
    var particles = [];
    
    var times = [];
    var timer = 0;
    var level = 0;
    var right = 0;
    var wrong = 0;

    p.setup = function() 
    {
        p.createCanvas(500, 500);

        var getSymbol = symbol[p.round(p.random(0,3))];

        for (let i = 0; i < numBalls; i++) 
        {
            argNum1 = p.round(p.random(0,10));
            argNum2 = p.round(p.random(0,10));
            if (getSymbol == 'x')
            {
                ballSum.push(argNum1 + " " + getSymbol + " " + argNum2);
                ballResult.push(argNum1 * argNum2);     
            }
            if (getSymbol == '/')
            {
                ballSum.push(argNum1 + " " + getSymbol + " " + argNum2);
                ballResult.push(argNum1 / argNum2);    
            }
            if (getSymbol == '+')
            {
                ballSum.push(argNum1 + " " + getSymbol + " " + argNum2);
                ballResult.push(argNum1 + argNum2);    
            }
            if (getSymbol == '-')
            {
                ballSum.push(argNum1 + " " + getSymbol + " " + argNum2);
                ballResult.push(argNum1 - argNum2);    
            }

            balls[i] = new Ball(p, p.random(p.width),p.random(p.height*3/4),p.random(80, 100),i,balls,ballSum[i],ballResult[i]);
        }

        randomSolution = ballResult[p.round(p.random(0,5))];
        p.noStroke();
        p.fill(255);
    }

    p.draw = function() 
    {
        p.background(200);

        balls.forEach(ball => 
        {
            ball.collide();
            ball.move();
            ball.display();
        });

        p.noStroke();
        p.fill(200);
        p.rect(0,p.height*3/4,p.width,p.height*1.2/4,20);
        p.fill(255);
        p.stroke(0);
        p.textSize(25);
        p.text("Find the Sum for: " + p.round(randomSolution),p.width/5,p.height*3.5/4);

        if(gameResult)
        {
            p.fill(100,10);
            p.noStroke();
            p.rect(0,0,p.width,p.height*3.5/4);
            p.noLoop();
        }
        
        p.timeClock(times);
    }

    p.mouseClicked = function() 
    {
        for(var i = 0; i < balls.length; i++)
        {
            if(p.dist(p.mouseX,p.mouseY,balls[i].x,balls[i].y)<balls[i].diameter && 
               ballResult[balls[i].id] == randomSolution)
            {
                gameResult = true;
                times.push(p.timeClock(true));
                level++;
                right++;
                p.localStore();
                console.log("correct");
                p.reset();
            }
            
            else if(p.dist(p.mouseX,p.mouseY,balls[i].x,balls[i].y)<balls[i].diameter && 
               ballResult[balls[i].id] != randomSolution)
            {
                wrong++;
            }
        }
    }

    class Ball 
    {
        constructor(p, xin, yin, din, idin, oin, bs, br) 
        {
            this.x = xin;
            this.y = yin;
            this.vx = 0;
            this.vy = 0;
            this.diameter = din;
            this.id = idin;
            this.others = oin;
            this.bs = bs;
            this.br - br;
        }

        collide() 
        {
            for (let i = this.id + 1; i < numBalls; i++) 
            {
                // console.log(others[i]);
                let dx = this.others[i].x - this.x;
                let dy = this.others[i].y - this.y;
                let distance = p.sqrt(dx * dx + dy * dy);
                let minDist = this.others[i].diameter / 2 + this.diameter / 2;
                //   console.log(distance);
                //console.log(minDist);
                if (distance < minDist) 
                {
                    //console.log("2");
                    let angle = p.atan2(dy, dx);
                    let targetX = this.x + p.cos(angle) * minDist;
                    let targetY = this.y + p.sin(angle) * minDist;
                    let ax = (targetX - this.others[i].x) * spring;
                    let ay = (targetY - this.others[i].y) * spring;
                    this.vx -= ax;
                    this.vy -= ay;
                    this.others[i].vx += ax;
                    this.others[i].vy += ay;
                }
            }
        }

        move()
        {
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x + this.diameter / 2 + diam > p.width) 
            {
                this.x = p.width - this.diameter / 2 + diam;
                this.vx *= friction;
            } 
            else if (this.x - this.diameter / 2 + diam < 0) 
            {
            this.x = this.diameter / 2 + diam;
            this.vx *= friction;
            }

            if (this.y + this.diameter / 2 + diam > p.height*3/4)
            {
                this.y = p.height*3/4 - this.diameter / 2 + diam;
                this.vy *= friction;
            } 
            else if (this.y - this.diameter / 2 + diam < 0) 
            {
                this.y = this.diameter / 2 + diam;
                this.vy *= friction;
            }
        }

        display() 
        {   
            p.push();
                p.blendMode(p.BLEND);
                p.blendMode(p.SCREEN);
                p.blendMode(p.ADD);

                // Trim end of trail.
                trail.push([this.x, this.y]);

                let removeCount = 1;
                if (p.mouseIsPressed && p.mouseButton == p.CENTER) 
                {
                    removeCount++;
                }

                for (let i = 0; i < removeCount; i++) {
                    if (trail.length == 0) {
                        break;
                    }

                    if (p.mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
                        trail.splice(0, 1);
                    }
                }

                // Spawn particles.
                if (trail.length > 1) {
                    let mouse = new p5.Vector(this.x, this.y);
                    mouse.sub(p.pmouseX, p.pmouseY);
                    if (mouse.mag() > 5) 
                    {
                        mouse.normalize();
                        for (let i = 0; i < 3; i++) 
                        {
                            particles.push(new Particle(p, p.pmouseX, p.pmouseY, mouse.x, mouse.y));
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
                for (let i = 0; i < particles.length/2; i++) 
                {
                    var parts = particles[i];
                    var mass = parts.mass * parts.vel.mag() * 0.2;

                    p.drawingContext.shadowColor = p.color(colorScheme[parts.colorIndex]);
                    p.drawingContext.shadowBlur = mass;

                    p.stroke(255,0,0);
                    p.strokeWeight(mass * 0.05);

                    var shapeSize = this.diameter + diam;
                    p.fill(255,0,0);
                    p.ellipse(this.x, this.y,shapeSize);

                    if(this.diameter + diam > 100)
                    {
                        inOut = false;
                    }

                    if(this.diameter + diam < 50)
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
            p.pop();

            p.push();           

            p.noStroke();
                p.fill(0,0,200,100);
                p.ellipse(this.x, this.y,this.diameter + diam);

                p.strokeWeight(3);
                p.fill(0);
                p.stroke(0);
                p.textSize((this.diameter + diam)/3);
                p.text(this.bs,this.x-(this.diameter + diam)/3,this.y+(this.diameter + diam)/10);
            p.pop();
        }
    }

    p.reset = function()
    {
        p.setup();
        p.draw();
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
        compileGameData(p,"BUBBLEGAMETIME",0,times[times.length -1],false,2);
        compileGameData(p,"BUBBLEGAMELEVEL",1,level,false,2);
        compileGameData(p,"BUBBLEGAMERIGHT",2,right,false,2);
        compileGameData(p,"BUBBLEGAMEWRONG",3,wrong,false,2);
    }
}
