const { Point, Path } = paper;
import { decimalPoint, getRandomElement, getRandomInt } from "./helper-funcs.js";

const dials = {
    "spacing_multiplier": [2, 3, 4],
    "size_multiplier": [2, 3, 4, 5, 6, 8],
    "indicator_shape": ["circle", "triangle", "rectangle", "diamond"],  
    "markings_distance_multiplier": [1.4],
    // "markings_style": ["circle", "triangle", "rectangle", "connected_line"],
    "markings_style": ["line", "circle", "triangle", "diamond"],
    "markings_highlight": ["circle", "triangle", "rectangle", "perpendicular_line"],
    "arrangement": ["grid", "circle", "circle_with_center"]
}

export class SingleDial {
    constructor(grid_size) {
        this.grid_size = grid_size

        this.style = {
            spacing_multiplier: getRandomElement(dials.spacing_multiplier),
            size: getRandomElement(dials.size_multiplier),
            turn_limit: Math.random() > 0.5 ? true : false,
            inner_border: Math.random() > 0.5 ? true : false,
            indicator_shape: getRandomElement(dials.indicator_shape),
            indicator_fill: Math.random() > 0.5 ? true : false,
            markings_distance_multiplier: getRandomElement(dials.markings_distance_multiplier),
            markings_style: getRandomElement(dials.markings_style),
            markings_quantity: getRandomInt(2, 16),
            markings_highlight: Math.random() > 0.5 ? true : false,
            center_coords: 0
        };

        this.radius = (this.style.size * grid_size) / 2;
        this.inner_border_radius = this.inner_border ? 0 : this.radius * 0.8;
        this.spacing = this.style.spacing_multiplier * this.grid_size

        this.center_coords = grid_size * this.style.spacing_multiplier + this.radius;
        this.center = new Point(this.center_coords, this.center_coords);
        this.indicator = false;
    };

    draw(color) {
        this.drawBorder(color);
        this.drawIndicator(color)
        this.drawMarkings(color);
    };

    drawBorder(color) {
        var dialBorder = new Path.Circle(this.center, this.radius);
        dialBorder.strokeColor = color;
        dialBorder.strokeWidth = 2

        if (this.style.inner_border) {
            var innerDialBorder = new Path.Circle(this.center, this.inner_border_radius);
            innerDialBorder.strokeColor = color;    
            innerDialBorder.strokeWidth = 2
        };
    };

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
                    new Point(this.center_coords - rectangle_width / 2, this.center_coords - rectangle_height / 2),
                    new Point(this.center_coords + rectangle_width / 2, this.center_coords + rectangle_height / 2)
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
            //     this.indicator.add(new Point(this.center_coords, this.center_coords - (indicator_radius * 4)));
            //     break;
            default:
                indicator_radius = decimalPoint(this.grid_size / getRandomInt(3, 5), 1)
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
        
    };

    drawMarkings(color) {
        var first_marking
        var marking_radius = 0
        switch (this.style.markings_style) {
            case "circle":
                marking_radius = 1.5
                first_marking = new Path.Circle(this.center, marking_radius);
                first_marking.position.y -= (this.radius + ((this.spacing - (marking_radius * 2)) / getRandomInt(2,3)))
                first_marking.fillColor = color
                break;
            case "triangle":
                marking_radius = 1.5
                first_marking = new Path.RegularPolygon(this.center, 3, marking_radius)
                first_marking.rotate(180)
                first_marking.position.y -= (this.radius + ((this.spacing - (marking_radius * 2)) / getRandomInt(2,3)))
                break;
            case "diamond":
                marking_radius = 1.5
                first_marking = new Path.RegularPolygon(this.center, 4, marking_radius)
                first_marking.rotate(45)
                first_marking.position.y -= (this.radius + ((this.spacing - (marking_radius * 2)) / getRandomInt(2,3)))
                break;
            // Ill figure this out later
            // case "connected_line":
            //     var line_start_angle = this.style.turn_limit ? 
            //     break;
            default:
                var marking_length = decimalPoint(this.spacing / getRandomInt(3, 4), 1);
                first_marking = new Path()
                first_marking.add(
                    this.center,
                    new Point(this.center_coords, this.center_coords - marking_length)
                );
                first_marking.position.y -= (this.radius + ((this.spacing - marking_length) / getRandomInt(2,3)));
                break;
        }

        if (this.style.markings_style != "connected_line") {
            var starting_angle = -180;
            var available_angle = 360;
            if (this.style.turn_limit) {
                starting_angle = -135;
                available_angle = 270;
            };
    
            first_marking.rotate(starting_angle, this.center);
            first_marking.strokeColor = color;
            first_marking.strokeWidth = 2;
    
            for(var i = 0; i <= this.style.markings_quantity; i++) {
                var cloned_marking = first_marking.clone();
                cloned_marking.rotate(i * (available_angle / this.style.markings_quantity) , this.center);
            };
        };
    };
};
