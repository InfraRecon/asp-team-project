import {compileGameData} from '../../storage.js';

var p5Sketch;

window.runSketch = function () {
    if (typeof p5Sketch !== 'undefined') {
        p5Sketch.remove();
    }

    p5Sketch = new p5(tetrisSketch, "sketchContainer");
};

window.stopSketch = function() {
    p5Sketch.remove();
}

var tetrisSketch = function(p)
{
    let playfield, fallingPiece, ghostPiece, paused;
    let ghostMode = true;

    const width = 10;
    const height = 20;
    
        
    var times = [];
    var timer = 0;
    var tabs = 0;

    p.setup = function() 
    {
        playfield = new Playfield(p, width, height,times,tabs);

        let totalWidth = playfield.cellSize * width + playfield.borderSize*2;
        let totalHeight = playfield.cellSize * height + playfield.borderSize*2;

        p.createCanvas(totalWidth, totalHeight);

        p.spawnNewPiece();
    }


    let prev = 0;
    p.draw = function() 
    {

        //============================
        // Get time passed since last frame
        //============================

        let curr = p.millis();
        let delta = curr - prev;
        prev = curr;

        //============================
        // Update
        //============================

        if (!paused)
            fallingPiece.update(delta);

        // move down piece and spawn a new one
        // if necessary
        if (fallingPiece.timeToFall()) 
        {
            fallingPiece.resetBuffer();
            fallingPiece.moveDown();

            if (!playfield.isValid(fallingPiece)) 
            {
                fallingPiece.moveUp();
                p.spawnNewPiece();
            }
        }

        // copy falligPiece's location and
        // orientation, then hardDrop() it
        // if ghostMode is on

        ghostPiece.copy(fallingPiece)
        p.hardDrop(ghostPiece, playfield);


        playfield.clearLines();

        //============================
        // Draw
        //============================

        p.background(251);

        playfield.show();
        if (ghostMode) ghostPiece.show();
        fallingPiece.show();
        
        p.timeClock(times);
        tabs = playfield.getTabs();

    }


    p.spawnNewPiece = function() 
    {
        if (fallingPiece) {
            playfield.addToGrid(fallingPiece);
        }

        const pieces = ['O', 'J', 'L', 'S', 'Z', 'T', 'I']
        const choice = p.random(pieces);
        fallingPiece = new Piece(p,choice, playfield);

        ghostPiece = new Piece(p,choice, playfield);
        ghostPiece.isghost = true;
        ghostPiece.cells = fallingPiece.cells;

        p.redraw();

    }

    p.hardDrop = function(piece, playfield) 
    {

        // move down as long as current position is valid
        while (playfield.isValid(piece)) 
        {
            piece.moveDown();
        }

        // in the last iteration the position isn't valid,
        // so move up
        piece.moveUp();

    }


    p.toggleGhost = function() 
    {
        ghostMode = !ghostMode;
    }


    p.keyPressed = function() 
    {

        // for alphabet keys
        switch (p.key.toLowerCase()) 
        {
            case ' ':
                p.hardDrop(fallingPiece, playfield);
                p.spawnNewPiece();
                break;

            case 'r':
                p.spawnNewPiece();
                playfield.resetGrid();
                break;

            case 'p':
                paused = !paused;
                break;


            // Rotation
            // --------

            case 'z':w
                fallingPiece.rotateCCW();
                // if not valid, rotate back
                if (!playfield.isValid(fallingPiece))
                    fallingPiece.rotateCW();
                break;

            case 'x':
                fallingPiece.rotateCW();
                // if not valid, rotate back
                if (!playfield.isValid(fallingPiece))
                    fallingPiece.rotateCCW();
                break;


            // Testing
            // -------

            case 'w':
                fallingPiece.y--;
                break;

            case 'n':
                p.spawnNewPiece();
                break;

        }

        // non-ASCII keys
        switch (p.keyCode) 
        {
            // movement controls in html file
            // to handle repeated movement

            case p.UP_ARROW:
                fallingPiece.rotateCW();

                // if not valid, rotate back
                if (!playfield.isValid(fallingPiece))
                    fallingPiece.rotateCCW();

                break;

        }
    }
    
    console.log('keyboard')
    document.addEventListener('keydown', event => {
        if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
            event.preventDefault();
        }
        switch (event.keyCode) {

          // Down arrow
          case 40:
            fallingPiece.moveDown();
            if (!playfield.isValid(fallingPiece))
              fallingPiece.moveUp()
            else
              fallingPiece.resetBuffer()
            break;

          // Left arrow
          case 37:
            fallingPiece.moveLeft();
            if (!playfield.isValid(fallingPiece))
              fallingPiece.moveRight()
            break;

          // Right Arrow
          case 39:
            fallingPiece.moveRight();
            if (!playfield.isValid(fallingPiece))
              fallingPiece.moveLeft()
            break;         
        }

    });
    
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
        compileGameData(p,"BLOCKGAMETIME",0,times[times.length -1],false,1);
        compileGameData(p,"BLOCKGAMETAB",1,tabs,false,1);
    }
}
