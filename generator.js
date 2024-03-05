const { Rectangle, Point, Path } = paper;
import { defineSynthSize } from "./synth-components.js";

var bottomCanvasHeight = window.innerHeight;
var bottomCanvasWidth = window.innerWidth;

var drawableCanvasHeight = bottomCanvasHeight * 0.9;
var drawableCanvasWidth = bottomCanvasWidth * 0.9;

var defaultStrokeColor = 'white';
const grid_size = 10;

if (bottomCanvasWidth < 768) {
    drawableCanvasWidth = bottomCanvasWidth * 0.8
}

window.onload = function() {
    var backgroundFill = document.getElementById('background-fill');
    paper.setup(backgroundFill);
    backgroundFill.width = bottomCanvasWidth
    backgroundFill.height = bottomCanvasHeight

    var mainCanvas = document.getElementById('main-canvas');
    paper.setup(mainCanvas);
    mainCanvas.width = drawableCanvasWidth;
    mainCanvas.height = drawableCanvasHeight;

    // var myPath = new Path();
    // myPath.strokeColor = 'black';
    // myPath.add(new Point(0, 0));
    // myPath.add(new Point(100, 50));

    var synthSize = defineSynthSize(drawableCanvasWidth, drawableCanvasHeight, grid_size);
    var synthContainer = new Rectangle(new Point(1,1), new Point(synthSize.w - 1, synthSize.h - 1));
    var synthContainerPath = new Path.Rectangle(synthContainer)
    synthContainerPath.strokeColor = defaultStrokeColor;
}