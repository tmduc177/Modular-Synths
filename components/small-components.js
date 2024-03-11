import { BaseComponent } from "./base-component.js";
import { binaryChoice, getRandomElement, strokePath } from "./helper-funcs.js";
const { Path, Point, Group } = paper;

export class Jack extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Jack',
        border_edges = getRandomElement([0, 6]),
        border_fill = binaryChoice(0.5, true, false),
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        this.border_edges = border_edges;
        this.border_fill = border_fill;
        this.draw();
    };

    draw() {
        super.draw();
        var jack_hole = new Path.Circle(this.origin_point, this.grid_size);
        strokePath(jack_hole);
        this.group.addChild(jack_hole)
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
        this.group.addChild(border)
    };
};

export class StatusLight extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'StatusLight',
        edges = binaryChoice(0.5, 0, getRandomElement([4])),
        on_status = binaryChoice(0.5, true, false)
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        this.edges = edges;
        this.on_status = on_status;
        this.draw()
    }

    draw() {
        super.draw();
        var light;
        if (this.edges) {
            light = new Path.RegularPolygon(this.origin_point, this.edges, this.grid_size / 2);
            light.scale(2, 1)
        } else {
            light = new Path.Circle(this.origin_point, this.grid_size / 2);
        };
        strokePath(light);
        if (this.on_status) {
            light.fillColor = this.color;
        };
        this.group.addChild(light);
    };
};