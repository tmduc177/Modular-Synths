const { Rectangle, Point, Path } = paper;
import { defineSynthSize } from "./components/synth-container.js";
import { ConnectionArray } from "./components/connection-array.js";
import { Dial } from "./components/dial.js";
import { DialArray } from "./components/dial-array.js";
import { getRandomInt } from "./components/helper-funcs.js";
import { BaseGrid } from "./components/grid.js";

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
    var base_grid = new BaseGrid({total_width: main_canvas.width, total_height: main_canvas.height})

    var connections = new ConnectionArray()
    var newDial = new Dial({origin_x: 600, origin_y: 200});
    newDial.draw()
    newDial.group.bounds.selected = true
    console.log('actual size ', newDial.getGroupSize())
    console.log('estimated size ', newDial.estimateSize())
    // var newSlider = new Slider({origin_x: 400, origin_y: 200, has_jack: true, connection_array: connections});
    // var newPadBtn = new PadBtn({origin_x: 100, origin_y: 500});
    // var newToggle = new Toggle({origin_x: 400, origin_y: 500});
    // connections.connectRandomPair();
    // connections.cords.bringToFront();
    // connections.cords.opacity = 0.75;
    // var newDialArray = new DialArray({
    //     connection_array: connections,
    //     dial_constraints: {
    //         origin_x: 200,
    //         origin_y: 100,
    //         has_light: false,
    //     },
    //     force_layout: 'leader',
    //     force_layout_params: {
    //         leader_position: 'top'
    //     }
    // })
    connections.connectRandomMulti({pair_quantity: getRandomInt(1, connections.jacks.length / 2)})
    connections.cords.bringToFront()
    connections.cords.opacity = 0.75
}
