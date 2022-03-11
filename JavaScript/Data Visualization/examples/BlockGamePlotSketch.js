import {setDataOnGraph} from '../../storage.js';

window.BlockGamePlotSketch = function(p)
{   
    // Global variables
    var timePoints = [];
    var tabPoints = [];
    
    var timeData;
    var tabData;
    
	var movingPlot, i;
	var step = 0;
	var stepsPerCycle = 100;
	var lastStepTime = 0;
	var clockwise = true;
	var scale = 5;
    
    // Global variables
	var table, periodPlot;
    
	    var canvas;
    var saveIcon;
    var buttonType = "saveButton"
    var x = 400;
    var y = 10;
    var xSize = 50;
    var ySize = 50;
    
    p.preload = function() 
    {
        saveIcon = p.loadImage("174314.png");
    }
	// Initial setup
	p.setup = function() 
    {
        p.graphSetup();
        
        p.textData();
        
        var saveImage = p.image(saveIcon,x,y,xSize,ySize);
	};
    
    // Execute the sketch
	p.draw = function() 
    {
        p.graphDraw();
	};

	p.mouseClicked = function() 
    {
        try
        {
            if (movingPlot.isOverBox(p.mouseX, p.mouseY)) 
            {
                // Change the movement sense
                clockwise = !clockwise;

                if (clockwise) 
                {
                    step += movingPlot.getPointsRef().length + 1;
                    movingPlot.setTitleText("Clockwise movement");
                }
                else 
                {
                    step -= movingPlot.getPointsRef().length + 1;
                    movingPlot.setTitleText("Anti-clockwise movement");
                }
            }
        }
        catch
        {
            console.log("No Data")    
        }
        
        if(buttonType == "saveButton" && 
           p.mouseX > x && 
           p.mouseX < x + xSize && 
           p.mouseY > y && 
           p.mouseY < y + ySize)
        {
            console.log("checked");
            p.saveResults();
        }
	};

	function calculatePoint(i, n, rad) 
    {
		var delta = 0.1 * p.cos(p.TWO_PI * 10 * i / n);
		var ang = p.TWO_PI * i / n;
		return new GPoint(rad * (1 + delta) * p.sin(ang), rad * (1 + delta) * p.cos(ang));
	}
    
    p.createResolutionInfo = function(textData,posX,posY)
    {
        p.fill(0);
        console.log(textData);
        p.text(textData,posX,posY);
    }
    
    p.graphSetup = function()
    {
        // Create the canvas
		canvas = p.createCanvas(700, 2800);
		p.background(255,255);

		// Prepare the points for the plot
        timeData = new setDataOnGraph(p,"BLOCKGAMETIME",0,1);
        tabData = new setDataOnGraph(p,"BLOCKGAMETAB",1,1);
        
        console.log(timeData);
        console.log(tabData);
        
		for (var i = 0; i < timeData.length; i++) 
        {
			timePoints[i] = new GPoint(i, p.round(timeData[i]));
            tabPoints[i] = new GPoint(i, p.round(tabData[i]));
		}

		// Create a new plot and set its position on the screen
		var plot = new GPlot(p);
		plot.setPos(0, 600);
        plot.setDim(500, 300);
        
		// Set the plot title and the axis labels
		plot.setPoints(timePoints);
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");
		plot.setTitleText("Block Game Acheivements");
        
        plot.addLayer("layer 2", tabPoints);
		plot.getLayer("layer 2").setLineColor(p.color(150, 255, 0));
        
        // Draw it!
		plot.defaultDraw();
        /////////////////
        /////////////////
        
        
        // Create the canvas
		var firstPlotPos = [0, 1000];
		var panelDim = [250, 250];
		var margins = [60, 70, 40, 30];

		// Create four plots to represent the 4 panels
		var plot1 = new GPlot(p);
		plot1.setPos(firstPlotPos);
		plot1.setMar(0, margins[1], margins[2], 0);
		plot1.setDim(panelDim);
		plot1.setAxesOffset(0);
		plot1.setTicksLength(-4);
		plot1.getXAxis().setDrawTickLabels(false);

		var plot3 = new GPlot(p);
		plot3.setPos(firstPlotPos[0], firstPlotPos[1] + margins[2] + panelDim[1]);
		plot3.setMar(margins[0], margins[1], 0, 0);
		plot3.setDim(panelDim);
		plot3.setAxesOffset(0);
		plot3.setTicksLength(-4);


		// Set the points, the title and the axis labels
		plot1.setPoints(timePoints);
		plot1.getYAxis().setAxisLabelText("cos(i)");
		plot1.setTitleText("Block Game Multiple Plots");
		plot1.getTitle().setRelativePos(1);
		plot1.getTitle().setTextAlignment(p.CENTER);

		plot3.setPoints(tabPoints);
		plot3.getXAxis().setAxisLabelText("sin(i)");
		plot3.getYAxis().setAxisLabelText("i");
		plot3.setInvertedYScale(true);


		// Draw the plots
		plot1.beginDraw();
		plot1.drawBox();
		plot1.drawXAxis();
		plot1.drawYAxis();
		plot1.drawTopAxis();
		plot1.drawRightAxis();
		plot1.drawTitle();
		plot1.drawPoints();
		plot1.drawLines();
		plot1.endDraw();

		plot3.beginDraw();
		plot3.drawBox();
		plot3.drawXAxis();
		plot3.drawYAxis();
		plot3.drawTopAxis();
		plot3.drawRightAxis();
		plot3.drawPoints();
		plot3.drawLines();
		plot3.endDraw();
        
        
        ////////////////////////
        ////////////////////////
        
        // Prepare the first set of points
		var nPoints1 = timePoints.length / 10;
		var points1 = [];

		for ( i = 0; i < timePoints.length; i++) 
        {
			points1[i] = calculatePoint(step, stepsPerCycle, scale);
			step = (clockwise) ? step + 1 : step - 1;
		}

		lastStepTime = p.millis();

		// Prepare the second set of points
		var nPoints2 = timePoints.length + 1;
		var points2 = [];

		for ( i = 0; i < timePoints.length; i++) 
        {
			points2[i] = calculatePoint(i, stepsPerCycle, 0.9 * scale);
		}

		// Create the plot
		movingPlot = new GPlot(p);
		movingPlot.setPos(0, 1600);
		movingPlot.setDim(500, 500);
		// or all in one go
		// plot = new GPlot(p, 25, 25, 300, 300);

		// Set the plot limits (this will fix them)
		movingPlot.setXLim(-1.2 * scale, 1.2 * scale);
		movingPlot.setYLim(-1.2 * scale, 1.2 * scale);

		// Set the plot title and the axis labels
		movingPlot.setTitleText("Clockwise movement");
		movingPlot.getXAxis().setAxisLabelText("x axis");
		movingPlot.getYAxis().setAxisLabelText("y axis");

		// Activate the panning effect
		movingPlot.activatePanning();

		// Add the two set of points to the plot
		movingPlot.setPoints(points1);
		movingPlot.addLayer("surface", points2);

		// Change the second layer line color
        movingPlot.getLayer("surface").setLineColor(p.color(100, 255, 100));
        
        //////////////////////////
        //////////////////////////
        
        // Create the plot
		periodPlot = new GPlot(p);
        periodPlot.setPos(0, 2200);
		periodPlot.setDim(500, 300);
		periodPlot.setTitleText("Game Stats");
		periodPlot.getYAxis().setAxisLabelText("Dots Collected");
		periodPlot.getXAxis().setNTicks(10);
		periodPlot.setPoints(timePoints.length);
		periodPlot.setLineColor(p.color(0));
        periodPlot.addLayer("Time", timePoints);
		periodPlot.getLayer("Time").setLineColor(p.color(255, 100, 100,100));
        
        periodPlot.addLayer("Tabs", tabPoints);
        periodPlot.getLayer("Tabs").setLineColor(p.color(100, 255, 255,100));
        
		periodPlot.activatePointLabels();
    }
    
    p.graphDraw = function()
    {
        // Draw the plot
		movingPlot.beginDraw();
		movingPlot.drawBackground();
		movingPlot.drawBox();
		movingPlot.drawXAxis();
		movingPlot.drawYAxis();
		movingPlot.drawTopAxis();
		movingPlot.drawRightAxis();
		movingPlot.drawTitle();
		movingPlot.getMainLayer().drawPoints();
		movingPlot.getLayer("surface").drawFilledContour(GPlot.HORIZONTAL, 0);
		movingPlot.endDraw();

		// Add and remove new points every 10th of a second
		if (p.millis() - lastStepTime > 100) 
        {
			if (clockwise) 
            {
				// Add the point at the end of the array
				movingPlot.addPoint(calculatePoint(step, stepsPerCycle, scale));
				step++;

				// Remove the first point
				movingPlot.removePoint(0);
			} 
            else 
            {
				// Add the point at the beginning of the array
				movingPlot.addPointAtIndexPos(0, calculatePoint(step, stepsPerCycle, scale));
				step--;

				// Remove the last point
				movingPlot.removePoint(movingPlot.getPointsRef().length - 1);
			}

			lastStepTime = p.millis();
		}
        
        ///////////////////
        ///////////////////
        
        // Draw the plot
		periodPlot.beginDraw();
		periodPlot.drawBox();
		periodPlot.drawXAxis();
		periodPlot.drawYAxis();
		periodPlot.drawTitle();
		periodPlot.drawGridLines(GPlot.VERTICAL);
		periodPlot.drawFilledContours(GPlot.HORIZONTAL, 0);
		periodPlot.drawLegend(["Time Stamps", "Level", "Dots Collected"], [0.07, 0.32, 0.48], [0.95, 0.95, 0.95]);
		periodPlot.drawLabels();
		periodPlot.endDraw();
    }
    
    p.textData = function()
    {
        var x = 10;
        var y = 110 - 20;
        
        var passed = 0;
        var passedResult = 0;
        var failed = 0;
        var testTotal = 0;

        var meanTime = 0;
        for(var i = 0; i < timeData.length; i++)
        {
            meanTime += p.float(timeData[i]);
            
            if(p.int(timeData[i]) < 30*(i+1))
            {
               passed +=1;
            }
            else if (p.int(timeData[i]) > 30*(i+1))
            {
                failed += 1;
            }
        }
        testTotal = passed + failed;
        
        passedResult = passed/testTotal*100;
        p.textSize(25);
        if (passedResult <= 30)
        {
            p.createResolutionInfo("Grade: Concerning ",10,30);
        }
        
        if (passedResult <= 40 && passedResult > 30)
        {
            p.createResolutionInfo("Grade: Below Average ",10,30);
        }
        
        if (passedResult <= 50 && passedResult > 40)
        {
            p.createResolutionInfo("Grade: Passed",10,30);
        }
        
        if (passedResult <= 60 && passedResult > 50)
        {
            p.createResolutionInfo("Grade: Above Average ",10,30);
        }
        
                
        if (passedResult <= 80 && passedResult > 60)
        {
            p.createResolutionInfo("Grade: Great ",10,30);
        }
        
        if (passedResult > 80)
        {
            p.createResolutionInfo("Grade: Excellent ",10,30);
        }
        
        p.textSize(15);
        p.createResolutionInfo("Block Game | Summary:",x,y-30);
        
        p.createResolutionInfo("Overall Result:",x * 20 + 20 ,y-30);
        p.createResolutionInfo(passed/testTotal*100+"%",x * 20 + 20,y);
        
        p.createResolutionInfo("Times:",x,y);
        p.createResolutionInfo(timeData,x,y + 20);
        
            p.createResolutionInfo("Total Time Played:",x + 20,y * 2);
            p.createResolutionInfo(timeData[timeData.length-1],x + 20,y * 2 + 20);
            
            meanTime = p.round(meanTime/timeData.length,2);
        
            p.createResolutionInfo("Mean Time:",x * 20 + 20,y * 2);
            p.createResolutionInfo(meanTime,x * 20 + 20,y * 2 + 20);
        
        p.createResolutionInfo("Blocks Destroyed:",x,y * 3);
        p.createResolutionInfo(tabData,x,y * 3 + 20);
        
            p.createResolutionInfo("Maximum Blocks Destroyed:",x + 20,y * 4);
            p.createResolutionInfo(tabData[tabData.length-1],x + 20,y * 4 + 20);
    }
    
    p.saveResults = function()
    {
        p.save(canvas, 'myResults.jpg');
    }
};
