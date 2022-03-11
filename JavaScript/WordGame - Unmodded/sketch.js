import {compileGameData} from '../storage.js';

var p5Sketch;

window.runSketch = function () {
    if (typeof p5Sketch !== 'undefined') {
        p5Sketch.remove();
    }

    p5Sketch = new p5(wordSketch, "sketchContainer");
};

window.stopSketch = function() {
    p5Sketch.remove();
}

var wordSketch = function(p)
{
    var freq = {};
    var letterSize;
    var gravity = 2;
    var s;
    var wb;
    var letters = [];
    var bottom;
    var modes = {
        PLAY: 1,
        END: 2
    };
    var mode;
    var voice = new p5.Speech();
    
    var times = [];
    
    var timer = 0;
    var wordsRight = 0;
    var wordsWrong = 0;
    

    p.preload = function() 
    {
        freq = p.loadJSON('LetterFrequency.json');
    }
 
    p.setup = function() 
    {
        p.createCanvas(500, 600);
        bottom = p.height;
        letterSize = p.width * 0.1;
        letters[0] = new p.letter();
        s = new p.selector();
        wb = new p.wordBox();
        p.textFont('Roboto Slab');
        p.textAlign(p.CENTER, p.CENTER);
        //voice.interrupt = true;
        mode = modes.PLAY;
    }

    p.draw = function () 
    {
        switch (mode) 
        {
            case modes.PLAY:
                p.play();
                break;
            case modes.END:
                p.end();
                break;
        }
    }

    p.play = function() 
    {
        p.background(255);
        s.update();
        p.fill(0);
        p.noStroke();
        for (var i = 0; i < letters.length; i++) {
            letters[i].move();
            letters[i].display();
        }
        if (letters[letters.length - 1].y > (p.textAscent() + p.textDescent()) * 1.25)
        letters.push(new p.letter());
        p.noStroke();
        p.fill(0);
        p.rect(0, bottom, p.width, p.height - bottom);
        wb.update();
        p.timeClock(times);
    }

    p.end = function() 
    {
        p.background(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(255);
        p.noStroke();
        p.text('Your words:', p.width / 2, p.height * 0.05);
        p.textAlign(p.LEFT);
        p.text(p.join(wb.words, ', '), p.width * 0.05, p.height * 0.1, p.width * 0.9, p.height * 0.85);
    }

    p.wordBox = function() {
        this.word = '';
        this.words = [];
        this.height = p.height * 0.1;

        this.update = function() {
            p.noStroke();
            p.fill(0);
            p.rect(0, 0, p.width, this.height);
            p.fill(255);
            p.text(this.word, p.width / 2, this.height / 2);
        }
    }

    p.checkWord = function() 
    {
        if (wb.words.indexOf(wb.word) == -1) 
        {
            if (RiTa.containsWord(wb.word)) 
            {
                var score = 0;
                for (var i = 0; i < wb.word.length; i++) 
                {
                    var c = wb.word.charAt(i).toLowerCase();
                    score += 2 + (1.0 / freq[c]) * wb.word.length;
                }
                wb.words.push(wb.word);
                bottom = p.min(bottom + score, p.height);
                gravity = p.min(3, gravity + 0.1);
                voice.speak(wb.word.toLowerCase());
                //print(wb.word, gravity);
                times.push(p.timeClock(true));
                wordsRight++;
                p.localStore();
            } 
            else 
            {
                voice.speak(wb.word.toLowerCase() + ' is not a word');
                bottom -= (wb.word.length * 50);
                times.push(p.timeClock(true));
                wordsWrong++;
                p.localStore();
            }
        } 
        else 
        {
            voice.speak(wb.word + ' was already used');
            bottom -= (wb.word.length * 2);
        }
        wb.word = '';
    }

    p.selector = function() {
        this.d = p.textWidth('W') * 1.25;
        this.x = p.mouseX;
        this.y = bottom - this.d;
        this.update = function() {
            this.x = p.constrain(p.mouseX, this.d / 2, p.width - this.d / 2);
            this.y = bottom - this.d;
            if (this.y < wb.height + this.d / 2) {
                mode = modes.END;
            }
            p.noFill();
            p.stroke(0, 200);
            p.strokeWeight(2);
            p.ellipse(this.x, this.y, this.d);
        }

    }

    p.letter = function() {
        this.randoChar = function() {
            var roll = p.random(100);
            var sum = 0;
            var keys = Object.keys(freq);
            for (var i = 0; i < keys.length; i++) {
                sum += freq[keys[i]];
                if (sum >= roll) {
                    return keys[i].toUpperCase();
                }
            }
        }
        this.c = this.randoChar();
        p.textSize(letterSize);
        this.width = p.textWidth(this.c);
        this.x = p.random(this.width / 2, p.width - this.width / 2);
        this.y = p.float(-p.textAscent() + p.textDescent());
        this.display = function() {
            p.textSize(letterSize);
            p.text(this.c, this.x, this.y);
        }
        this.move = function() {
            this.y += gravity;
            var d = p.dist(s.x, s.y, this.x, this.y);
            if (d <= this.width) {
                voice.speak(this.c);
                wb.word += this.c;
                letters.splice(letters.indexOf(this), 1);
            } else if (this.y >= bottom) {
                letters.splice(letters.indexOf(this), 1);
                bottom--;
            }
        }
    }

    p.mousePressed = function() {
        if (mode == modes.PLAY)
            p.checkWord();
        if (mode == modes.END)
            mode = modes.PLAY;
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
                console.log(times);
        compileGameData(p,"WORDGAMETIME",0,times[times.length -1],false,3);
        compileGameData(p,"WORDGAMERIGHT",1,wordsRight,false,3);
        compileGameData(p,"WORDGAMEWRONG",2,wordsWrong,false,3);
    }
}