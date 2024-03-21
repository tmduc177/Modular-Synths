import { BaseComponent } from "../base-component.js";

export class BasePanel extends BaseComponent {
    constructor({ 
        grid_size, color, origin_x, origin_y,
        type = 'BasePanel'
    }) {
        super({grid_size, color, origin_x, origin_y, type})
    };
};