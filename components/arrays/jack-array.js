const { Point, Group } = paper
import { BaseComponent } from '../bases-and-canvas-elements/base-component.js'
import { Jack } from '../controls/small-components.js'

export class JackArray extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'JackArray',
        array_width = 500,
        array_height = 500,
        force_layout = false,
        force_layout_params = false,
        component_constraints
    }) {
        super({grid_size, color, origin_x, origin_y, type, force_layout, force_layout_params, array_width, array_height, component_constraints});
        this.layouts = this.layouts.concat(['drawMatrix', 'drawOrbit', 'drawLeader'])
        this.draw();
    };

    draw() {
        super.draw();
        this.makeGroup();
    };
};
