import paper from "paper"
const { Rectangle, Point } = paper ;
import { defineSynthSize } from "./synth-components.js";

var bottomCanvasHeight = window.innerHeight;
var bottomCanvasWidth = window.innerWidth;

var drawableCanvasHeight = bottomCanvasHeight * 0.9;
var drawableCanvasWidth = bottomCanvasWidth * 0.9;

console.log('fill width ', bottomCanvasWidth);
console.log('fill height ', bottomCanvasHeight);
console.log('canvas width ', drawableCanvasWidth)
console.log('canvas height ', drawableCanvasHeight)

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

    var synthSize = defineSynthSize(drawableCanvasWidth, drawableCanvasHeight, grid_size);
    var synthContainer = new Rectangle(new Point(0,0), new Point(synthSize.w, synthSize.h));
    synthContainer.strokeColor = defaultStrokeColor;
}