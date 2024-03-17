const { Path, Point, Group } = paper;

export const default_grid_size = 10;
export const default_color = 'white';

export class BaseComponent{
    constructor({
        type = 'BaseComponent',
        grid_size = default_grid_size,
        color = default_color,
        origin_x = 0,
        origin_y = 0,
        padding_top = 0,
        padding_bottom = 0,
        padding_left = 0,
        padding_right = 0,
    }) {
        this.type = type
        this.grid_size = grid_size;
        this.color = color;
        this.origin_x = origin_x;
        this.origin_y = origin_y;
        this.origin_point = new Point(origin_x, origin_y);
        this.padding_top = padding_top
        this.padding_bottom = padding_bottom
        this.padding_left = padding_left
        this.padding_right = padding_right
        this.exclude_props_on_clone = ['type', 'origin_point', 'exclude_props_on_clone']
        this.group = new Group()
    };

    logProperties() {
        console.log(this);
    };

    draw() {
    }

    cloneDeterminants() {
        return Object.keys(this).reduce((properties, key) => {
            if (!this.exclude_props_on_clone.includes(key)) {
                properties[key] = this[key];
            };
            return properties;
        }, {});
    };
};