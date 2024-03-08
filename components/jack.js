import { binaryChoice, getRandomElement, strokePath } from "./helper-funcs.js";
const { Path, Point, Group } = paper;

var default_grid_size = 10;
var default_color = 'white'

export class Jack{
    constructor({
        grid_size = default_grid_size,
        color = default_color,
        origin_x = 0,
        origin_y = 0,
        border_edges = getRandomElement([0, 6]),
        border_fill = binaryChoice(0.5, true, false),
    }) {
        this.grid_size = grid_size;
        this.color = color;
        this.border_edges = border_edges;
        this.border_fill = border_fill;
        this.origin_point = new Point(origin_x, origin_y);
        this.group = new Group();

        this.draw();
    };

    listAttributes() {
        console.log(this);
    };

    draw() {
        var jack_hole = new Path.Circle(this.origin_point, this.grid_size);
        strokePath(jack_hole);
        var jack_ring = new Path.Circle(this.origin_point, this.grid_size * 1.25);
        var jack_ring_clone = jack_ring.clone();
        var border;
        if (this.border_edges) {
            border = new Path.RegularPolygon(this.origin_point, 6, this.grid_size * 1.75);
            border.rotate(30);
        } else {
            border = new Path.Circle(this.origin_point, this.grid_size * 1.5);
        };
        border = border.subtract(jack_ring_clone);
        border.fillColor = this.color;
    };
};