const { Group, Point } = paper;
import { BaseComponent } from "./base-component.js";
import { binaryChoice, getRandomElement, getRandomInt } from "./helper-funcs.js";
import { Dial } from "./dial.js";

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
                default:
                    console.log('layout not available');
                    break;
            };
        };
    };

    drawMatrix(options = {}) {
        const {
            row_quantity = getRandomInt(2, 5), 
            col_quantity = getRandomInt(2, 5), 
            stagger_matrix = binaryChoice(0.5, true, false)
        } = options
        var stagger = stagger_matrix 
        if ((row_quantity * col_quantity) > 10) {stagger = false}
        var stagger_col = stagger && (row_quantity > col_quantity) ? true : false;
        var stagger_row = stagger && !stagger_col ? true : false;
        var dial_matrix = new Group();
        var matrix_x_quantity = col_quantity
        var matrix_y_quantity = row_quantity
        this.dial_constraints.origin_x += this.grid_size;
        this.dial_constraints.origin_y += this.grid_size;
        var template = new Dial(this.dial_constraints);
        template.draw()
        var template_params = template.cloneDeterminants();
        var template_w = template.group.bounds.width;
        var template_h = template.group.bounds.height;
        var col_stagger_amount = stagger_col ? template_h / 2 : 0;
        var row_stagger_amount = stagger_row ? template_w / 2 : 0;
        function makeRow(first_row_obj, quantity, grid_size, obj_w, group) {
            for (var i = 1; i < quantity; i++) {
                var params = first_row_obj.cloneDeterminants()
                params.origin_x += i * (grid_size + obj_w);
                params.origin_y += col_stagger_amount;
                var cloned_obj = new Dial(params);
                cloned_obj.draw();
                group.addChild(cloned_obj.group);
            };
        };
        makeRow(template, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
        for (var i = 1; i < matrix_y_quantity; i++) {
            template_params.origin_y += this.grid_size + template_h;
            template_params.origin_x += row_stagger_amount;
            var row_starter = new Dial(template_params);
            row_starter.draw()
            makeRow(row_starter, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
            dial_matrix.addChild(row_starter.group);
        };
        this.group.addChild(template.group)
    };

    drawOrbit(options = {}) {
        const { orbit_quantity = getRandomInt(3, 6) } = options;
        var radial_array = new Group();
        var center_constraints = {...this.dial_constraints};
        center_constraints.has_jack = false;
        center_constraints.has_light = false;
        var center_r_factor = getRandomElement([3, 2]);
        var orbit_r_reverse_factor = getRandomElement([2, 1.5])
        var orbit_dials_r_factor = center_r_factor / orbit_r_reverse_factor;
        center_constraints.knob_radius_factor = center_r_factor
        var center_dial = new Dial(center_constraints);
        var orbit_params = center_dial.cloneDeterminants();
        orbit_params.knob_radius_factor = orbit_dials_r_factor
        center_dial.draw();
        var center_w = center_dial.group.bounds.width;
        var center_h = center_dial.group.bounds.height;
        var orbit_radius = (center_h / 2) + ((center_h / orbit_r_reverse_factor) / 2)
        if (center_w > center_h) {
            orbit_radius = (center_w / 2) + ((center_w / orbit_r_reverse_factor) / 2)
        };
        orbit_radius += this.grid_size * 3
        var arc_radian = (2 * Math.PI) / orbit_quantity
        var orbit_group = new Group()
        var rotation_center = new Point(center_dial.group.position.x, center_dial.group.position.y)
        for (var i = 0; i < orbit_quantity; i++) {
            orbit_params.origin_x = rotation_center.x + (orbit_radius * Math.cos(i * arc_radian));
            orbit_params.origin_y = rotation_center.y + (orbit_radius * Math.sin(i * arc_radian));
            var orbit_dial = new Dial(orbit_params);
            orbit_dial.draw();
            orbit_group.addChild(orbit_dial.group);
        };
        radial_array.addChildren(center_dial.group, orbit_group)
        this.group.addChild(radial_array)
    };
};

