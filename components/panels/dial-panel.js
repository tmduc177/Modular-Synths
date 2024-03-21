const { Path, Point, Group } = paper;
import { DialArray } from "../arrays/dial-array.js";
import { JackArray } from "../arrays/jack-array.js";
import { applyStroke, getRandomElement } from "../helper-funcs.js";
import { BasePanel } from "./base-panel.js";

export class DialPanel extends BasePanel {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'DialPanel',
        dials_position = getRandomElement(['top', 'bottom', 'left', 'right']),
        dial_constraints,
        force_dial_layout,
        force_dial_layout_params,
        jack_constraints,
        force_jack_layout,
        force_jack_layout_params,
        connection_array
    }) {
        super({grid_size, color, origin_x, origin_y, type});
        /******************************************************************************* */
        this.dials_position = dials_position;
        this.dial_constraints = dial_constraints;
        this.force_dial_layout = force_dial_layout;
        this.force_dial_layout_params = force_dial_layout_params;
        this.jack_constraints = jack_constraints;
        this.force_jack_layout = force_jack_layout;
        this.force_jack_layout_params = force_jack_layout_params;
        this.connection_array = connection_array;
        /******************************************************************************* */
    };

    draw() {
        var dial_array = new DialArray({
            origin_x: this.dial_constraints.origin_x ? this.dial_constraints.origin_x : 0,
            origin_y: this.dial_constraints.origin_y ? this.dial_constraints.origin_y : 0,
            component_constraints: this.dial_constraints,
            force_layout: this.force_dial_layout,
            force_layout_params: this.force_dial_layout_params
        });
        var jack_array = new JackArray({
            origin_x: this.jack_constraints.origin_x ? this.jack_constraints.origin_x : 0,
            origin_y: this.jack_constraints.origin_y ? this.jack_constraints.origin_y: 0,
            component_constraints: this.jack_constraints,
            force_layout: this.force_jack_layout,
            force_layout_params: this.force_jack_layout_params,
            connection_array: this.connection_array
        });
        var dial_array_size = dial_array.getGroupSize()
        var jack_array_size = jack_array.getGroupSize()
        if (['top', 'bottom'].includes(this.dials_position)) {
            var divider_length = dial_array_size.w > jack_array_size.w ? dial_array_size.w : jack_array_size.w
            var divider_start = new Point(this.origin_x - (divider_length / 2), this.origin_y)
            var divider_end = new Point(this.origin_x + (divider_length / 2), this.origin_y)
        } else {
            var divider_length = dial_array_size.h > jack_array_size.h ? dial_array_size.h : jack_array_size.h
            var divider_start = new Point(this.origin_x, this.origin_y - (divider_length / 2))
            var divider_end = new Point(this.origin_x, this.origin_y + (divider_length / 2))
        }
        var divider = new Path.Line(divider_start, divider_end)
        applyStroke(divider)
        var dxf = 0; var dyf = 0;  var jxf = 0; var jyf = 0;
        switch (this.dials_position) {
            default: console.log('invalid dials position'); break;
            case 'top': dyf = -1; jyf = 1; break;
            case 'bottom': dyf = 1; jyf = -1; break;
            case 'left': dxf = -1; jxf = 1; break;
            case 'right': dxf = 1; jxf = -1; break;
        };
        console.log('dials position', this.dials_position)
        console.log('dxf, dyf, jxf, jyf', dxf, dyf, jxf, jyf)
        console.log(dial_array_size, jack_array_size)
        dial_array.move(dxf * (dial_array_size.w / 2 + this.grid_size), dyf * (dial_array_size.h / 2 + this.grid_size))
        jack_array.move(jxf * (jack_array_size.w / 2 + this.grid_size), jyf * (jack_array_size.h / 2 + this.grid_size))
    };
};