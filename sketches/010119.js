function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (mouseIsPressed) {
    noStroke();
    fill(Math.floor((Math.random()*255)), Math.floor((Math.random()*255)), Math.floor((Math.random()*255)));
  } else {
    noStroke();
    fill(Math.floor((Math.random()*255)), Math.floor((Math.random()*255)), Math.floor((Math.random()*255)), 80);
  }
  ellipse(mouseX, mouseY, (Math.random()*100), (Math.random()*100));
  frameRate(30);
}
