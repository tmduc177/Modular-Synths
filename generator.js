const { Rectangle, Point, Path } = paper;
import { defineSynthSize } from "./components/synth-container.js";
import { Slider } from "./components/slider.js";
import { Dial } from "./components/dial.js";
import { StatusLight } from "./components/small-components.js";

var bottom_canvas_height = window.innerHeight;
var bottom_canvas_width = window.innerWidth;

var drawable_canvas_height = bottom_canvas_height * 0.9;
var drawable_canvas_width = bottom_canvas_width * 0.9;

var defaultStrokeColor = 'white';
const grid_size = 10;

if (bottom_canvas_width < 768) {
    drawable_canvas_width = bottom_canvas_width * 0.8
}

window.onload = function() {
    var background_fill = document.getElementById('background-fill');
    paper.setup(background_fill);
    background_fill.width = bottom_canvas_width
    background_fill.height = bottom_canvas_height

    var main_canvas = document.getElementById('main-canvas');
    paper.setup(main_canvas);
    main_canvas.width = drawable_canvas_width;
    main_canvas.height = drawable_canvas_height;

    // var myPath = new Path();
    // myPath.strokeColor = 'black';
    // myPath.add(new Point(0, 0));
    // myPath.add(new Point(100, 50));

    var synth_size = defineSynthSize(drawable_canvas_width, drawable_canvas_height, grid_size);
    // var synth_container = new Rectangle(new Point(1,1), new Point(synth_size.w - 1, synth_size.h - 1));
    // // var synth_container_path = new Path.Rectangle(synth_container)
    // // synth_container_path.strokeColor = defaultStrokeColor;

    var newDial = new Dial({origin_x: 100, origin_y: 200});
    var newSlider = new Slider({origin_x: 400, origin_y: 200});
    var cloned_dial_props = newDial.cloneDeterminants()
    cloned_dial_props.origin_x = 700
    cloned_dial_props.origin_y = 200
    var newerDial = new Dial(cloned_dial_props)
    var cloned_slider_props = newSlider.cloneDeterminants()
    cloned_slider_props.origin_x = 1000
    cloned_slider_props.origin_y = 200
    var newerSlider = new Slider(cloned_slider_props)
}
