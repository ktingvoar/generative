setup = () => {
    createCanvas(windowWidth, windowHeight);
    background(10);
};


draw = () => {

    stroke(255);

    if (windowWidth > windowHeight) {
        line(mouseX, 0, mouseX, windowHeight);
    } else if (windowHeight > windowWidth) {
        frameRate(30);
        line(0, mouseY, windowHeight, mouseY);
    }

};


windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
    background(10);
};


new p5();
