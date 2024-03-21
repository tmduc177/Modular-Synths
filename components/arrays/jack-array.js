import { getRandomElement, getRandomInt } from '../helper-funcs.js';
import { Jack } from '../small-components.js'
import { BaseComponentArray } from './base-component-array.js';

function estimateJackRadius(jack_params) {
    var multiplier = jack_params.border_edges ? 1.75 : 1.5;
    return jack_params.grid_size * multiplier;
};

export class JackArray extends BaseComponentArray {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'JackArray',
        array_width = 500,
        array_height = 500,
        force_layout = false,
        force_layout_params = false,
        component_constraints,
        connection_array
    }) {
        super({grid_size, color, origin_x, origin_y, type, force_layout, force_layout_params, array_width, array_height, component_constraints});
        this.connection_array = connection_array
        this.layouts = ['drawMatrix']
        this.draw();
    };

    drawMatrix(options = {}) {
        const {
            col_quantity = getRandomInt(2, 5),
            row_quantity = getRandomInt(2, 5),
            stagger = getRandomElement([false, 'x', 'y'])
        } = options;
        var template_constraints = {...this.component_constraints}
        template_constraints.connection_array = this.connection_array
        var template = new Jack(template_constraints)
        template.draw()
        this.components.push(template)
        var jack_radius = estimateJackRadius(template.cloneDeterminants())
        var stagger_x = stagger == 'x' ? jack_radius : false
        var stagger_y = stagger == 'y' ? jack_radius : false
        function makeRow(first_row_object, duplicates, shift_x, stagger_y, object_list) {
            for (var i = 1; i < duplicates; i++) {
                var cloned_jack_params = first_row_object.cloneDeterminants()
                cloned_jack_params.origin_x += shift_x * i
                if (stagger_y && ((i % 2) - 1) == 0)  {cloned_jack_params.origin_y += stagger_y}
                var cloned_jack = new Jack(cloned_jack_params)
                cloned_jack.draw()
                object_list.push(cloned_jack)
            }
        };
        makeRow(template, col_quantity, (this.grid_size + jack_radius) * 1.75, stagger_y, this.components)
        for (var i = 1; i < row_quantity; i++) {
            var cloned_template_params = template.cloneDeterminants();
            cloned_template_params.origin_y += (this.grid_size + jack_radius) * i * 1.75;
            if (stagger_x && ((i % 2) - 1) == 0) {cloned_template_params.origin_x += stagger_x}
            var cloned_template = new Jack(cloned_template_params)
            cloned_template.draw()
            this.components.push(cloned_template)
            makeRow(cloned_template, col_quantity, (this.grid_size + jack_radius) * 1.75, stagger_y, this.components)
        };
    };
};
