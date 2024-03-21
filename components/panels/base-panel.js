const { Group } = paper;
import { BaseComponent } from "../base-component.js";

export class BasePanel extends BaseComponent {
    constructor({ 
        grid_size, color, origin_x, origin_y,
        type = 'BasePanel'
    }) {
        super({grid_size, color, origin_x, origin_y, type})
        this.component_arrays = [];
        this.group = new Group();
        this.exclude_props_on_clone.concat(['group', 'component_arrays'])
        this.drawn = false;
    };

// TODO: refactor?
    makeGroup() {
        if (!this.drawn) {
            console.error('not drawn');
            return void 0;
        };
        for (var i = 0; i < this.component_arrays.length; i++) {
            this.group.addChild(this.component_arrays[i].group);
        };
    };

    addComponentArray(component_array) {
        this.component_arrays.push(component_array);
    };

    move(by_x, by_y) {
        if (!this.drawn) {
            console.error('not drawn');
            return void 0;
        };
        for (var i = 0; i < this.component_arrays.length; i++) {
            this.component_arrays[i].move(by_x, by_y);
        };
    };
};