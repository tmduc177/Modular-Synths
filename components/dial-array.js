const { Group, Point } = paper;
import { BaseComponent } from "./base-component.js";
import { binaryChoice, getRandomElement, getRandomInt } from "./helper-funcs.js";
import { Dial } from "./dial.js";

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
    var est_h = est_w + light_height + name_height + (params.grid_size * 2);
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
        this.layouts = [
            this.drawMatrix,
            this.drawOrbit,
            this.drawLeader
        ]
        this.exclude_props_on_clone.push['layouts']
        this.draw()
    };

    draw() {
        if (!this.force_layout) {
            const randomLayout = getRandomElement(this.layouts)
            randomLayout.call(this)
        } else {
            switch (this.force_layout) {
                case 'matrix':
                    this.drawMatrix(this.force_layout_params);
                    break;
                case 'orbit':
                    this.drawOrbit(this.force_layout_params);
                    break;
                case 'leader':
                    this.drawLeader(this.force_layout_params);
                    break;
                default:
                    console.log('layout not available');
                    break;
            };
        };
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
                var first_follower_y = template_params.origin_y - (template_size.est_h / 2) - (follower_rows * this.grid_size) - ((follower_size.est_h * ((2 * follower_rows) - 1)) / 2)
                break;
            case 'left':
                [follower_cols, follower_rows] = [follower_rows, follower_cols]
                var first_follower_x = template_params.origin_x + (template_size.est_w / 2) + (follower_size.est_w / 2) + this.grid_size;
                var first_follower_y = template_params.origin_y - (((follower_size.est_w / 2) + this.grid_size) * (follower_rows - 1));
                break;
            case 'right':
                [follower_cols, follower_rows] = [follower_rows, follower_cols]
                var first_follower_x = template_params.origin_x - (template_size.est_w / 2) - (follower_cols * this.grid_size) - ((((2 * follower_cols) - 1) * follower_size.est_w) / 2)
                var first_follower_y = template_params.origin_y - (((follower_size.est_w / 2) + this.grid_size) * (follower_rows - 1));
            default:
                console.log('invalid leader position')
                break;
        };
        follower_params.origin_x = first_follower_x;
        follower_params.origin_y = first_follower_y;
        this.drawMatrix({overwrite_params: follower_params, total_cols: follower_cols, total_rows: follower_rows});
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
                stagger = false,
        } = options;
        var first_dial_params = overwrite_params ? overwrite_params : this.dial_constraints;
        var first_dial = new Dial(first_dial_params);
        first_dial.draw();
        var first_dial_size = estimateSize(first_dial.cloneDeterminants());
        var shift_x = first_dial_size.est_w + this.grid_size;
        if (stagger == 'x') {shift_x += first_dial.est_w / 2}
        var shift_y = first_dial_size.est_h + this.grid_size;
        if (stagger == 'y') {shift_y += first_dial.est_h / 2};
        function makeRow(first_dial, duplicates, shift_x) {
            for (var i = 1; i < duplicates; i++) {
                var cloned_dial_params = first_dial.cloneDeterminants();
                cloned_dial_params.origin_x = cloned_dial_params.origin_x + (i * shift_x);
                var cloned_dial = new Dial(cloned_dial_params);
                cloned_dial.draw();
            }
        }
        makeRow(first_dial, total_cols, shift_x);
        for (var i = 1; i < total_rows; i++) {
            var cloned_first_dial_params = first_dial.cloneDeterminants();
            cloned_first_dial_params.origin_y = cloned_first_dial_params.origin_y + (i * shift_y);
            var cloned_first_dial = new Dial(cloned_first_dial_params);
            cloned_first_dial.draw();
            makeRow(cloned_first_dial, total_cols, shift_x);
        };
    };

    // drawMatrix(options = {}) {
    //     const {
    //         row_quantity = getRandomInt(2, 5), 
    //         col_quantity = getRandomInt(2, 5), 
    //         stagger_matrix = binaryChoice(0.5, true, false),
    //         overwrite_constraints = false
    //     } = options
    //     var stagger = stagger_matrix 
    //     if ((row_quantity * col_quantity) > 10) {stagger = false}
    //     var stagger_col = stagger && (row_quantity > col_quantity) ? true : false;
    //     var stagger_row = stagger && !stagger_col ? true : false;
    //     var matrix_x_quantity = col_quantity
    //     var matrix_y_quantity = row_quantity
    //     var dial_matrix = new Group();
    //     var template_constraints = overwrite_constraints ? overwrite_constraints : this.dial_constraints;
    //     var template = new Dial(template_constraints);
    //     template.draw()
    //     var template_params = template.cloneDeterminants();
    //     var template_w = template.group.bounds.width;
    //     var template_h = template.group.bounds.height;
    //     var col_stagger_amount = stagger_col ? template_h / 2 : 0;
    //     var row_stagger_amount = stagger_row ? template_w / 2 : 0;
    //     function makeRow(first_row_obj, quantity, grid_size, obj_w, group) {
    //         for (var i = 1; i < quantity; i++) {
    //             var params = first_row_obj.cloneDeterminants()
    //             params.origin_x += i * (grid_size + obj_w);
    //             params.origin_y += col_stagger_amount;
    //             var cloned_obj = new Dial(params);
    //             cloned_obj.draw();
    //             group.addChild(cloned_obj.group);
    //         };
    //     };
    //     makeRow(template, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
    //     for (var i = 1; i < matrix_y_quantity; i++) {
    //         template_params.origin_y += this.grid_size + template_h;
    //         template_params.origin_x += row_stagger_amount;
    //         var row_starter = new Dial(template_params);
    //         row_starter.draw()
    //         makeRow(row_starter, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
    //         dial_matrix.addChild(row_starter.group);
    //     };
    //     this.group.addChild(template.group)
    // };

    // drawOrbit(options = {}) {
    //     const { orbit_quantity = getRandomInt(3, 6) } = options;
    //     var radial_array = new Group();
    //     var center_constraints = {...this.dial_constraints};
    //     center_constraints.has_jack = false;
    //     center_constraints.has_light = false;
    //     var center_r_factor = getRandomElement([3, 2]);
    //     var orbit_r_reverse_factor = getRandomElement([2, 1.5])
    //     var orbit_dials_r_factor = center_r_factor / orbit_r_reverse_factor;
    //     center_constraints.knob_radius_factor = center_r_factor
    //     var center_dial = new Dial(center_constraints);
    //     var orbit_params = center_dial.cloneDeterminants();
    //     orbit_params.knob_radius_factor = orbit_dials_r_factor
    //     center_dial.draw();
    //     var center_w = center_dial.group.bounds.width;
    //     var center_h = center_dial.group.bounds.height;
    //     var orbit_radius = (center_h / 2) + ((center_h / orbit_r_reverse_factor) / 2)
    //     if (center_w > center_h) {
    //         orbit_radius = (center_w / 2) + ((center_w / orbit_r_reverse_factor) / 2)
    //     };
    //     orbit_radius += this.grid_size * 3
    //     var arc_radian = (2 * Math.PI) / orbit_quantity
    //     var orbit_group = new Group()
    //     var rotation_center = new Point(center_dial.group.position.x, center_dial.group.position.y)
    //     for (var i = 0; i < orbit_quantity; i++) {
    //         orbit_params.origin_x = rotation_center.x + (orbit_radius * Math.cos(i * arc_radian));
    //         orbit_params.origin_y = rotation_center.y + (orbit_radius * Math.sin(i * arc_radian));
    //         var orbit_dial = new Dial(orbit_params);
    //         orbit_dial.draw();
    //         orbit_group.addChild(orbit_dial.group);
    //     };
    //     radial_array.addChildren(center_dial.group, orbit_group)
    //     this.group.addChild(radial_array)
    // };

};

