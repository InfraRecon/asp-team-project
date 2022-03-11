import {compileGameData} from '../../storage.js';

var p5Sketch;

window.runSketch = function () {
    if (typeof p5Sketch !== 'undefined') {
        p5Sketch.remove();
    }

    p5Sketch = new p5(numGridSketch, "sketchContainer");
};

window.stopSketch = function() {
    p5Sketch.remove();
}

var numGridSketch = function(p)
{
    var times = [];
    var timer = 0;
    var tab = 0;
    
    p.Array2D = function(cols, rows) 
    {
      var arr = new Array(cols);
      for (var i = 0; i < arr.length; i++) 
      {
        arr[i] = new Array(rows);
      }
      return arr;
    }

    var cols = 3;
    var rows = 3;
    var spacing = 150;
    var grid;
    var gridSet = [];
    var shuffleButton;
    var shuffled = false;

    p.setup = function() 
    {
        p.createCanvas(cols * spacing, rows * spacing);
        grid = new p.Array2D(cols, rows);
        for (var i = 0; i < cols; i++) 
        {
            for (var j = 0; j < rows; j++) 
            {
                grid[i][j] = i + j * cols + 1;
                if (grid[i][j] == cols * rows) 
                {
                    grid[i][j] = 0;
                }
            }
        }

        p.checkGrid(grid);
        shuffleButton = p.createButton("Shuffle");
        shuffleButton.mousePressed(p.shuffleBoard);
    }

    p.mousePressed = function() 
    {
      if (p.mouseX < p.width && p.mouseX > 0 && p.mouseY < p.height && p.mouseY > 0) 
      {
        p.slide(p.mouseX, p.mouseY);
        p.checkGrid(grid);
      }
    }

    p.slide = function(x, y) 
    {
      var mx = p.floor(x / spacing);
      var my = p.floor(y / spacing);
      var num = grid[mx][my];
      var neighbours;
      if (mx == 0) 
      {
        neighbours = [
          grid[mx + 1][my],
          grid[mx][my + 1],
          grid[mx][my - 1]
        ];
      } 
      else if (mx == cols - 1) 
      {
        neighbours = [
          grid[mx - 1][my],
          grid[mx][my + 1],
          grid[mx][my - 1]
        ];
      } 
      else 
      {
        neighbours = [
          grid[mx + 1][my],
          grid[mx - 1][my],
          grid[mx][my + 1],
          grid[mx][my - 1]
        ];
      }
      for (var i = 0; i < neighbours.length; i++) 
      {
        if (neighbours[i] == 0) 
        {
          var temp = grid[mx][my];
          if (mx != cols - 1) {
            if (neighbours[i] == grid[mx + 1][my]) 
            {
              grid[mx][my] = 0;
              grid[mx + 1][my] = temp;
            }
          }
          if (mx != 0) {
            if (neighbours[i] == grid[mx - 1][my]) 
            {
              grid[mx][my] = 0;
              grid[mx - 1][my] = temp;
            }
          }
          if (neighbours[i] == grid[mx][my + 1]) 
          {
            grid[mx][my] = 0;
            grid[mx][my + 1] = temp;
          }
          if (neighbours[i] == grid[mx][my - 1]) 
          {
            grid[mx][my] = 0;
            grid[mx][my - 1] = temp;
          }
        }
      }
        tab++;
    }

    p.shuffleBoard = function() 
    {
        for (var i = 0; i < cols; i++) 
        {
            for (var j = 0; j < rows; j++) 
            {
            grid[i][j] = i + j * cols + 1;
                if (grid[i][j] == cols * rows) 
                {
                grid[i][j] = 0;
                }
            }
        }

        for (var k = 0; k < 10000; k++) 
        {
            p.slide(p.random(p.width), p.random(p.height));
        }

        shuffled = true;
    }

    p.checkGrid = function(gridTemp)
    {
        //Converts the grid of any sized array to a single array
        if(gridSet == "")
        {
            for (var i = 0; i < cols; i++) 
            {
                for (var j = 0; j < rows; j++) 
                {
                    gridSet.push(grid[i][j]);
                }
            }
        }

        //creates a temporary grid that stores the changinbg grid temporaryliy
        var gridTemp = [];
        for (var i = 0; i < cols; i++) 
        {
            for (var j = 0; j < rows; j++) 
            {
                gridTemp.push(grid[i][j]);
            }
        }

        //Checks if the arrays match for evry value with a counter
        if(shuffled)
        {
            var count = 0;
            for (var i = 0; i < cols * rows; i++) 
            {
                if(gridTemp[i] == gridSet[i])
                {
                    count++;

                    if (count == cols * rows)
                    {
                        times.push(p.timeClock(true));
                        p.localStore();
                        console.log("Complete");
                    }
                }
            }
        }

        console.log(gridTemp);
        console.log(gridSet);
    }

    p.draw = function() 
    {
        p.background(200);
        for (var i = 0; i < cols; i++) 
        {
            for (var j = 0; j < rows; j++) 
            {
                var x = i * spacing;
                var y = j * spacing;

                p.fill(255);
                p.ellipse(x+spacing/2, y+spacing/2, spacing, spacing);
                var xt = x + spacing / 2;
                var yt = y + spacing / 2;
                var num = grid[i][j];

                if (num != 0) 
                {
                    p.fill(100);
                    p.textSize(64);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(num, xt, yt);
                }
            }
        }
        
        p.timeClock(times);
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
        compileGameData(p,"GRIDGAMETIME",0,times[times.length -1],false,4);
        compileGameData(p,"GRIDGAMETAB",1,tab,false,4);
    }
}
