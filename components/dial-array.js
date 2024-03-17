const { Group } = paper;
import { BaseComponent } from "./base-component.js";
import { binaryChoice, getRandomElement, getRandomInt } from "./helper-funcs.js";
import { Dial } from "./dial.js";

export class DialArray extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'DialArray',
        array_width = 500,
        array_height = 500,
        dial_constraints,
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        /************************************************************/
        this.array_width = array_width;
        this.array_height = array_height;
        this.dial_constraints = dial_constraints;
        /************************************************************/
        this.layouts = [
            this.drawMatrix
        ]
        this.exclude_props_on_clone.push['layouts']
        this.draw()
    };

    draw() {
        const randomLayout = getRandomElement(this.layouts)
        randomLayout.call(this)
    };

    drawMatrix() {
        var dial_matrix = new Group();
        var matrix_x_quantity = getRandomInt(2, 5);
        var matrix_y_quantity = getRandomInt(2, 5);
        this.dial_constraints.origin_x += this.grid_size;
        this.dial_constraints.origin_y += this.grid_size;
        var template = new Dial(this.dial_constraints);
        template.draw()
        var template_params = template.cloneDeterminants();
        var template_w = template.group.bounds.width;
        var template_h = template.group.bounds.height;
        function makeRow(first_row_obj, quantity, grid_size, obj_w, group) {
            for (var i = 1; i < quantity; i++) {
                var params = first_row_obj.cloneDeterminants()
                params.origin_x += i * (grid_size + obj_w);
                var cloned_obj = new Dial(params);
                cloned_obj.draw();
                group.addChild(cloned_obj.group);
            };
        };
        makeRow(template, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
        for (var i = 1; i < matrix_y_quantity; i++) {
            template_params.origin_y += this.grid_size + template_h;
            var row_starter = new Dial(template_params);
            row_starter.draw()
            makeRow(row_starter, matrix_x_quantity, this.grid_size, template_w, dial_matrix);
            dial_matrix.addChild(row_starter.group);
        };
        dial_matrix.addChild(template.group)
    };
};

