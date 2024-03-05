var bottomCanvasHeight = window.innerHeight
var bottomCanvasWidth = window.innerWidth

var drawableCanvasHeight = bottomCanvasHeight * 0.9
var drawableCanvasWidth = bottomCanvasWidth * 0.9

if (bottomCanvasWidth < 768) {
    drawableCanvasWidth = bottomCanvasWidth * 0.8
}

console.log('bottom width ', bottomCanvasWidth)
console.log('bottom height ', bottomCanvasHeight)
console.log('---')
console.log('top width ', drawableCanvasWidth)
console.log('top height ', drawableCanvasHeight)

window.onload = function() {
    var canvas1 = document.getElementById('canvas1');
    paper.setup(canvas1);
    canvas1.width = bottomCanvasWidth
    canvas1.height = bottomCanvasHeight

    // Create and draw on the first canvas
    var path1 = new paper.Path();
    path1.strokeColor = 'black';
    path1.add(new paper.Point(50, 50));
    path1.add(new paper.Point(150, 150));
    paper.view.draw();

    // Setup Paper.js for the second canvas
    var canvas2 = document.getElementById('canvas2');
    paper.setup(canvas2);
    canvas2.width = drawableCanvasWidth;
    canvas2.height = drawableCanvasHeight;

    // Create and draw on the second canvas
    var path2 = new paper.Path();
    path2.strokeColor = 'red';
    path2.add(new paper.Point(150, 50));
    path2.add(new paper.Point(50, 150));
    paper.view.draw();
}