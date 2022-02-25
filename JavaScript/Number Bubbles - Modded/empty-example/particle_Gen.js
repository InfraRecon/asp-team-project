function Particle(p, x, y, vx, vy) 
{
    this.colorScheme = ["#0A1B28", "#071F43", "#357D7E", "#35EEEE", "#919DF0"];
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(vx, vy);
    this.vel.mult(p.random(10));
    this.vel.rotate(p.radians(p.random(-25, 25)));
    this.mass = p.random(1, 30);
    this.airDrag = p.random(0.92, 0.98);
    this.colorIndex = p.int(p.random(this.colorScheme.length));
    this.life = 0;
    this.lifeSteps = p.random(-1, 1);

    this.move = function() {
        this.pos.rotate(p.radians(this.life * 0.002));
        this.vel.mult(this.airDrag);
        this.pos.add(this.vel);
        this.life += this.lifeSteps;
    }
}