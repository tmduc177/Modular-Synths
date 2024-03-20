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
        force_layout_params = false
    }) {
        super({grid_size, color, origin_x, origin_y, type});
        this.array_width = array_width;
        this.array_height = array_height;
        this.force_layout = force_layout;
        this.force_layout_params = force_layout_params;
        this.layouts = [
            this.drawMatrix
        ];
        this.jacks = [];
        this.exclude_props_on_clone.concat(['jacks', 'layout']);
        this.draw();
        this.makeGroup();
    };

    draw() {
        super.draw();
        
    }
};
