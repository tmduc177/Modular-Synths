import { BaseComponent } from "./base-component.js";
import { binaryChoice, getRandomElement, getRandomInt, strokePath, getRandomString } from "./helper-funcs.js";
const { Path, Point, Group, PointText } = paper;

export class Jack extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Jack',
        border_edges = getRandomElement([0, 6]),
        border_fill = binaryChoice(0.5, true, false),
        connection_array
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        /***********************************************************/
        this.border_edges = border_edges;
        this.border_fill = border_fill;
        this.connection_array = connection_array;
        /***********************************************************/
        this.connected = false;
        this.connected_to = false;
        this.exclude_props_on_clone.concat(['connected', 'connected_to'])
    };

    draw(options = {}) {
        const { force_name } = options
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
        this.connection_array.addJackObj(this)
        this.drawName({force_name: force_name})
    };

    drawName(options = {}) {
        const { force_name } = options;
        var text_x = this.group.position.x
        var text_y = this.group.position.y + (this.group.bounds.height / 2) + this.grid_size
        var jack_name = new PointText(new Point(text_x, text_y))
        jack_name.justification = 'center'
        jack_name.fontFamily = 'monospace'
        jack_name.fontWeight = 'bold'
        jack_name.content = force_name ? force_name : getRandomString();
        jack_name.fillColor = this.color
        this.group.addChild(jack_name)
    }
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

export class Cord extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Cord',
        cord_color = getRandomElement(['white', '#2C8BFF', '#FF4B4B']),
        in_co_ords = [],
        out_co_ords = []
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type})
        this.cord_color = cord_color;
        this.in_co_ords = in_co_ords;
        this.out_co_ords = out_co_ords;
        this.exclude_props_on_clone.concat(['in_point', 'out_point'])
        this.in_point = new Point(this.in_co_ords[0], this.in_co_ords[1])
        this.out_point = new Point(this.out_co_ords[0], this.out_co_ords[1])
        this.draw();
    };

    draw() {
        super.draw();
        var heads = this.drawHeads();
        var cord = this.drawCord();
        this.group.addChildren([heads, cord]);
    };

    drawHeads() {
        var heads = new Group();
        var head_in = new Path.Circle(this.in_point, this.grid_size * 0.75);
        var head_out = new Path.Circle(this.out_point, this.grid_size * 0.75);
        heads.addChildren([head_in, head_out]);
        heads.fillColor = this.cord_color;
        return heads;
    };

    drawCord() {
        var cord = new Path.Line(this.in_point, this.out_point);
        this.sagCord(cord);
        strokePath(cord, {stroke_width: 5});
        cord.strokeColor = this.cord_color;
        return cord;
    };

    sagCord(cord) {
        var higher_end = cord.segments[0].point.y > cord.segments[1].point.y ? 1 : 0;
        var lower_end = higher_end ? 0 : 1;
        var start_point = cord.segments[higher_end];
        var end_point = cord.segments[lower_end];
        var delta_x = Math.abs(start_point.point.x - end_point.point.x)
        var delta_y = Math.abs(start_point.point.y - end_point.point.y);
        delta_y = Math.floor(delta_y) > this.grid_size ? Math.floor(delta_y) : getRandomInt(this.grid_size * 3, 100);
        if (delta_x > this.grid_size) {
            var sag_amount = getRandomInt(delta_y / 2 , delta_y);
            start_point.handleOut = new Point(0, sag_amount);
            start_point.handleIn = new Point(0, sag_amount);
            end_point.handleOut = new Point(0, sag_amount);
            end_point.handleIn = new Point(0, sag_amount);
        };
    };
};