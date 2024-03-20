const { Group, Point } = paper;
import { BaseComponent } from "../bases-and-canvas-elements/base-component.js";
import { binaryChoice, getRandomElement, getRandomInt } from "../bases-and-canvas-elements/helper-funcs.js";
import { Dial } from "../controls/dial.js";

function estimateSize(params) {
    var outer_ring_radius = (1 + params.outer_ring_size_factor) * (params.knob_radius_factor * params.grid_size);
    var notches_distance = outer_ring_radius * params.notch_distance_factor;
    var delta_distance = notches_distance - outer_ring_radius;
    var mark_radius = (delta_distance / 3) / params.mark_size_factor;
    var mark_stretch_factor = params.mark_stretch_factor;
    var tick_length = params.tick_size_factor * params.grid_size;
    var mark_length = params.mark_quantity ? mark_radius * 2 * mark_stretch_factor : 0;
    var notch_length = mark_length ? (mark_length > tick_length ? mark_length : tick_length) : tick_length;
    var light_height = params.has_light ? params.grid_size : 0;
    var name_height = params.grid_size;
    var est_w = (notches_distance * 2) + notch_length;
    var est_h = est_w + light_height + name_height + params.grid_size;
    return {est_w: est_w, est_h: est_h};
}


export class DialArray extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'DialArray',
        array_width = 500,
        array_height = 500,
        force_layout = false,
        force_layout_params,
        dial_constraints,
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        /************************************************************/
        this.array_width = array_width;
        this.array_height = array_height;
        this.force_layout = force_layout;
        this.force_layout_params = force_layout_params;
        this.dial_constraints = dial_constraints;
        /************************************************************/
        this.exclude_props_on_clone.concat(['drawn'])
        this.layouts = [
            this.drawMatrix,
            this.drawOrbit,
            this.drawLeader
        ];
        this.dials = [];
        this.exclude_props_on_clone.push['layouts', 'dials'];
        this.draw();
        this.makeGroup();
    };

    draw() {
        if (!this.force_layout) {
            const randomLayout = getRandomElement(this.layouts)
            randomLayout.call(this)
        } else {
            switch (this.force_layout) {
                case 'matrix': this.drawMatrix(this.force_layout_params); break;
                case 'orbit': this.drawOrbit(this.force_layout_params); break;
                case 'leader': this.drawLeader(this.force_layout_params); break;
                default: console.log('layout not available'); break;
            };
        };
        this.drawn = true;
    };

    drawLeader(options = {}) {
        var { 
            leader_position = getRandomElement(['top', 'bottom', 'left', 'right']),
            follower_cols = getRandomInt(1, 2),
            follower_rows = getRandomInt(2, 4)
        } = options;
        var big_dial_constraints = {...this.dial_constraints};
        big_dial_constraints.knob_radius_factor = getRandomElement([2, 3]);
        var { template_params, template_size } = this.createBigDialTemplate(big_dial_constraints);
        var leader = new Dial(template_params);
        leader.draw();
        this.dials.push(leader)
        var follower_params = {...template_params}
        var follower_size_factor = getRandomElement([1.5, 2]);
        follower_params.knob_radius_factor = follower_params.knob_radius_factor / follower_size_factor;
        follower_params.indicator_size_factor = follower_params.indicator_size_factor / follower_size_factor;
        var follower_size = estimateSize(follower_params);
        switch (leader_position) {
            case 'top':
                var first_follower_x = template_params.origin_x - (((follower_size.est_w + this.grid_size) / 2) * (follower_cols - 1));
                var first_follower_y = template_params.origin_y + (template_size.est_h / 2) + (follower_size.est_h / 2);
                break;
            case 'bottom':
                var first_follower_x = template_params.origin_x - (((follower_size.est_w + this.grid_size) / 2) * (follower_cols - 1));
                var first_follower_y = template_params.origin_y - (template_size.est_h / 2) - (follower_rows * this.grid_size) - ((follower_size.est_h * ((2 * follower_rows) - 1)) / 2);
                break;
            case 'left':
                [follower_cols, follower_rows] = [follower_rows, follower_cols];
                var first_follower_x = template_params.origin_x + (template_size.est_w / 2) + (follower_size.est_w / 2) + this.grid_size;
                var first_follower_y = template_params.origin_y - (((follower_size.est_w / 2) + this.grid_size) * (follower_rows - 1));
                break;
            case 'right':
                [follower_cols, follower_rows] = [follower_rows, follower_cols];
                var first_follower_x = template_params.origin_x - (template_size.est_w / 2) - (follower_cols * this.grid_size) - ((((2 * follower_cols) - 1) * follower_size.est_w) / 2);
                var first_follower_y = template_params.origin_y - (((follower_size.est_w / 2) + this.grid_size) * (follower_rows - 1));
            default:
                console.log('invalid leader position');
                break;
        };
        follower_params.origin_x = first_follower_x;
        follower_params.origin_y = first_follower_y;
        this.drawMatrix({overwrite_params: follower_params, total_cols: follower_cols, total_rows: follower_rows, stagger: false});
    };

    createBigDialTemplate(constraints) {
        var template_constraints = constraints ? constraints : this.dial_constraints;
        var template_dial = new Dial(template_constraints);
        var template_params = template_dial.cloneDeterminants();
        var template_size = estimateSize(template_params);
        template_dial = null;
        return {template_params: template_params, template_size: template_size};
    }

    drawMatrix(options = {}) {
        const { overwrite_params = false,
                total_cols = getRandomInt(2, 4),
                total_rows = getRandomInt(2, 4),
                stagger = getRandomElement([false, 'x', 'y']),
        } = options;
        var first_dial_params = overwrite_params ? overwrite_params : this.dial_constraints;
        var first_dial = new Dial(first_dial_params);
        first_dial.draw();
        this.dials.push(first_dial)
        var first_dial_size = estimateSize(first_dial.cloneDeterminants());
        var shift_x = first_dial_size.est_w + this.grid_size;
        var shift_y = first_dial_size.est_h + this.grid_size;
        var stagger_y = stagger == 'y' ? (first_dial_size.est_h / 2) : 0;
        var stagger_x = stagger == 'x' ? (first_dial_size.est_w / 2) : 0;
        function makeRow(first_dial, duplicates, shift_x, stagger_y, grid_size, object_list) {
            for (var i = 1; i < duplicates; i++) {
                var cloned_dial_params = first_dial.cloneDeterminants();
                cloned_dial_params.origin_x += (i * shift_x);
                if (stagger_y) {cloned_dial_params.origin_y += (i * stagger_y)};
                var cloned_dial = new Dial(cloned_dial_params);
                cloned_dial.draw();
                object_list.push(cloned_dial)
            }
        }
        makeRow(first_dial, total_cols, shift_x, stagger_y, this.grid_size, this.dials);
        for (var i = 1; i < total_rows; i++) {
            var cloned_first_dial_params = first_dial.cloneDeterminants();
            cloned_first_dial_params.origin_y += (i * shift_y);
            if (stagger_x) {cloned_first_dial_params.origin_x += (i * stagger_x)};
            var cloned_first_dial = new Dial(cloned_first_dial_params);
            cloned_first_dial.draw();
            this.dials.push(cloned_first_dial)
            makeRow(cloned_first_dial, total_cols, shift_x, stagger_y, this.grid_size, this.dials);
        };
    };

    drawOrbit(options = {}) {
        const { orbit_quantity = getRandomInt(2, 8) } = options;
        var center_constraints = {...this.dial_constraints};
        var center_r_factor = getRandomElement([3, 2]);
        var orbit_r_scaler = getRandomElement([1.5, 2]);
        center_constraints.knob_radius_factor = center_r_factor;
        var { template_params, template_size } = this.createBigDialTemplate(center_constraints);
        var center = new Dial(template_params);
        center.draw();
        this.dials.push(center)
        var orbit_params = center.cloneDeterminants();
        orbit_params.knob_radius_factor = orbit_params.knob_radius_factor / orbit_r_scaler;
        orbit_params.indicator_size_factor = orbit_params.indicator_size_factor / orbit_r_scaler;
        var est_orbit_size = estimateSize(orbit_params);
        var orbit_radius = (template_size.est_h / 2) + (est_orbit_size.est_h / 2);
        var arc_radian = (2 * Math.PI) / orbit_quantity;
        var rotation_center = center.origin_point;
        var arc_buffer = 0;
        if (orbit_quantity != 6) {arc_buffer = Math.PI / ((6 - orbit_quantity) * 2)};
        for (var i = 0; i < orbit_quantity; i++) {
            orbit_params.origin_x = rotation_center.x + (orbit_radius * Math.cos((i * arc_radian) + arc_buffer));
            orbit_params.origin_y = rotation_center.y + (orbit_radius * Math.sin((i * arc_radian) + arc_buffer));
            var orbit_dial = new Dial(orbit_params);
            orbit_dial.draw();
            this.dials.push(orbit_dial)
        };
    };

    move(x, y) {
        for (var i = 0; i < this.dials.length; i++) {
            this.dials[i].move(x, y)
        };
    };

    makeGroup() {
        for (var i = 0; i < this.dials.length; i++) {
            this.group.addChild(this.dials[i].group)
        };
    };

    getSize() {
        if (this.drawn) {
            return {w: this.group.bounds.width, h: this.group.bounds.height};
        } else {
            console.log('not drawn');
        };
    };

    centerAroundOrigin() {
        var array_center_before = this.group.position
        var drawing_initial_center = this.dials[0].origin_point
        var shift_x = -(array_center_before.x - drawing_initial_center.x)
        var shift_y = -(array_center_before.y - drawing_initial_center.y)
        this.move(shift_x, shift_y)
    };
};

