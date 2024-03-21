import { BaseComponent } from "../base-component.js";
import { getRandomElement } from "../helper-funcs.js";
const { Group } = paper

export class BaseComponentArray extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'BaseComponentArray',
        array_width = 500,
        array_height = 500,
        force_layout = false,
        force_layout_params,
        component_constraints,
    }) {
        super({grid_size, color, origin_x, origin_y, type});
        /***********************************************************************/
        this.array_width = array_width;
        this.array_height = array_height;
        this.force_layout = force_layout;
        this.force_layout_params = force_layout_params;
        this.component_constraints = component_constraints;
        /***********************************************************************/
        this.centered = false;
        this.components = [];
        this.exclude_props_on_clone.concat(['layout', 'components', 'centered']);
        this.layouts = [];
    };

    callLayout(layout_name) {
        layout_name = 'draw' + layout_name.charAt(0).toUpperCase() + layout_name.slice(1);
        if (typeof this[layout_name] === 'function') {
            this[layout_name]();
        } else {
            console.error('layout doesnt exist');
        };
    };

    draw() {
        super.draw();
        if (!this.force_layout) {
            const random_layout = getRandomElement(this.layouts);
            if (typeof this[random_layout] === 'function') {
                this[random_layout]();
            } else {
                console.error('layout doesnt exist')
            }
        } else {
            this.callLayout(this.force_layout);
        };
        this.drawn = true;
        this.makeGroup();
    };

    move(by_x, by_y) {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].move(by_x, by_y);
        };
    };

    makeGroup() {
        for (var i = 0; i < this.components.length; i++) {
            this.group.addChild(this.components[i].group);
        };
    };
    
    centerAroundOrigin() {
        if (this.centered) {
            console.log('already centered')
            return void 0;
        } else {
            var array_center_before = this.group.position;
            var array_initial_center = this.components[0].origin_point;
            var shift_x = -(array_center_before.x - array_initial_center.x);
            var shift_y = -(array_center_before.y - array_initial_center.y);
            this.move(shift_x, shift_y);
            this.centered = true;
        };
    };
};