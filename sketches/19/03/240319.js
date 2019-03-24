var particles = [];

var Particle = class Particle {

    constructor() {
        this.x = random(width);
        this.y = height + 8;
        this.vx = 0;
        this.vy = random(-4, -1);
        this.alpha = 255;
    }

    finished() {
        return this.alpha < 0;
    }

    pastEdge() {
		if (this.y < -8) {
			this.y = height + 8;
		}
	}

    move() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 1;
    }

	show() {
        noStroke();
        fill(255, this.alpha);
		ellipse(this.x, this.y, 16);
	}

};


function setup() {
	createCanvas(windowWidth, windowHeight);
    smooth();
}


function draw() {
    background(20);

    for (let i = 0; i < 5; i++) {
        const p = new Particle();
        particles.push(p);
    }

    for (const particle of particles) {
        particle.move();
        particle.show();
        particle.pastEdge();
    }

    particles = particles.filter(p => !p.finished());
}


function mousePressed() {
    frameRate(20);
}


function mouseClicked() {
    frameRate(60);
}


new p5();
