const { Point, Group } = paper;
import { defaults } from "./default-values.js"

export class BaseComponent{
    constructor({
        type = 'BaseComponent',
        grid_size = defaults.grid_size,
        color = defaults.color,
        origin_x = 0,
        origin_y = 0
    }) {
        this.type = type
        this.grid_size = grid_size;
        this.color = color;
        this.origin_x = origin_x;
        this.origin_y = origin_y;
        this.origin_point = new Point(origin_x, origin_y);
        this.drawn = false;
        this.exclude_props_on_clone = ['type', 'origin_point', 'exclude_props_on_clone', 'group', 'drawn'];
        this.group = new Group();
    };

    logProperties() {
        console.log(this);
    };

    draw() {
        if (this.drawn == true) {
            console.log('already drawn');
            return void 0;
        }
        this.drawn = true;
    };

    cloneDeterminants() {
        return Object.keys(this).reduce((properties, key) => {
            if (!this.exclude_props_on_clone.includes(key)) {
                properties[key] = this[key];
            };
            return properties;
        }, {});
    };

    move(by_x, by_y) {
        this.origin_x += by_x;
        this.origin_y += by_y;
        this.origin_point = new Point(this.origin_x, this.origin_y);
        if (this.drawn) {
            this.group.position.x += by_x;
            this.group.position.y += by_y;
        };
    };

    getGroupSize() {
        if (this.drawn) {
            return {w: this.group.bounds.width, h: this.group.bounds.height};
        } else {
            console.log('not drawn')
        }''
    };
};