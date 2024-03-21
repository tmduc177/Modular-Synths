const { Path, Point, Group } = paper;
import { DialArray } from "../arrays/dial-array.js";
import { JackArray } from "../arrays/jack-array.js";
import { applyStroke } from "../helper-funcs.js";
import { BasePanel } from "./base-panel.js";

export class DialPanel extends BasePanel {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'DialPanel',
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

        var initial_origin = dial_array.origin_point
        console.log(dial_array.origin_x)

        dial_array.centerAroundOrigin()
        jack_array.centerAroundOrigin()
        var dial_array_size = dial_array.getGroupSize();
        var jack_array_size = jack_array.getGroupSize();
        dial_array.move(-(dial_array_size.w / 2) - (this.grid_size * 2), 0)
        jack_array.move((jack_array_size.w / 2) + (this.grid_size * 2), 0)

        var divider_length = dial_array_size.h > jack_array_size.h ? dial_array_size.h : jack_array_size.h

        var divider_start = new Point(initial_origin.x, initial_origin.y - (divider_length / 2))
        var divider_end = new Point(initial_origin.x, initial_origin.y + (divider_length / 2))
        var divider = new Path.Line(divider_start, divider_end)
        applyStroke(divider)
    };
};