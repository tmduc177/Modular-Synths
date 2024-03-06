const { Point, Path } = paper;
import { getRandomElement, getRandomInt } from "./helper-funcs.js";

const dials = {
    "size_multiplier": [2, 3, 4, 5, 6, 8],
    "indicator_shape": ["circle", "triangle", "rectangle", "diamond"],
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
            rel_center_coords: 0
        };

        this.radius = (this.style.size * grid_size) / 2;
        this.inner_border_radius = this.inner_border ? 0 : this.radius * 0.8;

        this.rel_center_coords = grid_size * 2 + this.radius;
        this.center = new Point(this.rel_center_coords, this.rel_center_coords);
        this.indicator = false;
    };

    draw(color) {
        this.drawBorder(color)
        this.drawIndicator(color)
    }

    drawBorder(color) {
        var dialBorder = new Path.Circle(this.center, this.radius);
        dialBorder.strokeColor = color;
        dialBorder.strokeWidth = 2

        if (this.style.inner_border) {
            var innerDialBorder = new Path.Circle(this.center, this.inner_border_radius);
            innerDialBorder.strokeColor = color;    
            innerDialBorder.strokeWidth = 2
        };
    }

    drawIndicator(color) {
        var indicator_radius;
        var center_offset = 0;
        switch (this.style.indicator_shape) {
            case "triangle":
                indicator_radius = this.radius >= 20 ? 10 : this.radius / getRandomInt(2,3);
                this.indicator = new Path.RegularPolygon(this.center, 3, indicator_radius);
                center_offset = (0.8 * this.radius) - indicator_radius;
                break;
            case "rectangle":
                var rectangle_height = getRandomInt(2,3) * this.radius / 4;
                var rectangle_width = this.radius / 5;
                this.indicator = new Path.Rectangle(
                    new Point(this.rel_center_coords - rectangle_width / 2, this.rel_center_coords - rectangle_height / 2),
                    new Point(this.rel_center_coords + rectangle_width / 2, this.rel_center_coords + rectangle_height / 2)
                );
                center_offset = (0.75 * this.radius) - (rectangle_height / 2);
                break;
            case "diamond":
                indicator_radius = Math.floor((this.grid_size / getRandomInt(2, 3)) * 10) / 10;
                this.indicator = new Path.RegularPolygon(this.center, 4, indicator_radius);
                this.indicator.rotate(45);
                center_offset = this.radius * 0.5;
                break;
            // line is buggy, sometimes it appears and sometimes it doesnt, havent figured out why
            // case "line":
            //     indicator_radius = this.radius / 4
            //     this.indicator = new Path();
            //     this.indicator.add(this.center);
            //     this.indicator.add(new Point(this.rel_center_coords, this.rel_center_coords - (indicator_radius * 4)));
            //     break;
            default:
                indicator_radius = Math.floor((this.grid_size / getRandomInt(3, 5)) * 10) / 10;
                this.indicator = new Path.Circle(this.center, indicator_radius);
                center_offset = this.radius * 0.5;
                break;
        };
        
        this.indicator.position.y -= center_offset;

        if (this.style.indicator_fill) {
            this.indicator.fillColor = color;
        } else {
            this.indicator.strokeColor = color;
        };

        this.indicator.strokeWidth = 2
        
    }
};
