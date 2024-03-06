const { Point, Path } = paper;
import { getRandomElement, getRandomInt } from "./helper-funcs.js";

const dials = {
    "size_multiplier": [2, 3, 4, 5, 6, 8],
    "indicator_shape": ["circle", "short_triangle", "long_triangle", "rectangle", "diamond"],
    "markings_distance_multiplier": [1, 1.25, 1.5, 1.75],
    "markings_style": ["circle", "triangle", "rectangle", "connected_line", "perpendicular_line"],
    "markings_highlight": ["circle", "triangle", "rectangle", "perpendicular_line"],
    "arrangement": ["grid", "circle", "circle_with_center"]
}

export class SingleDial {
    constructor(grid_size) {
        this.grid_size = grid_size
        this.style = {
            size: getRandomElement(dials.size_multiplier),
            turn_limit: Math.random() > 0.5 ? true : false,
            inner_border: Math.random() > 0.5 ? true : false,
            indicator_shape: getRandomElement(dials.indicator_shape),
            indicator_fill: Math.random() > 0.5 ? true : false,
            markings_distance_multiplier: getRandomElement(dials.markings_distance_multiplier),
            markings_style: getRandomElement(dials.markings_style),
            markings_subdivisions: getRandomInt(32, 3),
            markings_highlight: Math.random() > 0.5 ? true : false,
            radius: 0,
            relative_center: 0
        };

        this.style.radius = this.style.size * grid_size / 2;
        this.style.relative_center = grid_size * 2 + this.style.radius;
        this.style.inner_border_radius = this.inner_border ? 0 : this.style.radius * 0.8;

        this.indicator = false;
        this.center = new Point(this.style.relative_center, this.style.relative_center);
    };

    draw(color) {
        this.drawBorder(color)
        this.drawIndicator(color)
    }

    drawBorder(color) {
        var dialBorder = new Path.Circle(this.center, this.style.radius);
        dialBorder.strokeColor = color;

        if (this.style.inner_border) {
            var innerDialBorder = new Path.Circle(this.center, this.style.inner_border_radius);
            innerDialBorder.strokeColor = color;    
        };
    }

    drawIndicator(color) {
        var indicator_size = this.grid_size / getRandomInt(3, 5)
        switch (this.style.indicator_shape) {
            default:
                this.indicator = new Path.Circle(this.center, indicator_size);
                break;
        };
        
        this.indicator.position.y -= this.style.radius * 0.5;

        if (this.style.indicator_fill) {
            this.indicator.fillColor = color;
        } else {
            this.indicator.strokeColor = color;
        };

        
    }
};
