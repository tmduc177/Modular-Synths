const { Point, Path } = paper;
import { decimalPoint, getRandomElement, getRandomInt, strokePath } from "./helper-funcs.js";

const dials = {
    "spacing_multiplier": [2, 3, 4],
    "size_multiplier": [2, 3, 4, 5, 6, 8],
    "indicator_shape": ["circle", "triangle", "rectangle", "diamond"],  
    "markings_distance_multiplier": [1.4],
    "markings_highlight": ["circle", "triangle", "rectangle", "perpendicular_line"],
    "highlights_style" : ["circle", "triangle", "diamond", "rectangle"],
    "arrangement": ["grid", "circle", "circle_with_center"]
}

export class SingleDial {
    constructor(
        grid_size,
        spacing_multiplier = getRandomElement(dials.spacing_multiplier),
        size = getRandomElement(dials.size_multiplier),
        turn_limit = Math.random() > 0.5 ? true : false,
        inner_border = Math.random() > 0.5 ? true : false,
        indicator_shape = getRandomElement(dials.indicator_shape),
        indicator_fill = Math.random() > 0.5 ? true : false,
        highlights = Math.random() > 0.5 ? true : false,
        highlights_style = getRandomElement(dials.highlights_style),
        highlights_fill = Math.random() > 0.5 ? true : false,
        highlights_quantity = getRandomInt(2, 6),
        markings_distance_multiplier = getRandomElement(dials.markings_distance_multiplier),
        center_coords = [0, 0]
    ) {
        this.grid_size = grid_size
        this.style = {
            spacing_multiplier: spacing_multiplier,
            size: size,
            turn_limit: turn_limit,
            inner_border: inner_border,
            indicator_shape: indicator_shape,
            indicator_fill: indicator_fill,
            center_coords: center_coords,
            highlights: highlights,
            highlights_quantity: highlights_quantity,
            highlights_style: highlights_style,
            highlights_fill: highlights_fill,
            markings_distance_multiplier: markings_distance_multiplier,
            markings_quantity: highlights_quantity * getRandomInt(2,4),
        };
        
        this.radius = (this.style.size * grid_size) / 2;
        this.inner_border_radius = this.inner_border ? 0 : this.radius * 0.8;
        this.spacing = this.style.spacing_multiplier * this.grid_size
        this.full_radius = this.radius + this.spacing

        // this.center_coords = grid_size * this.style.spacing_multiplier + this.radius;
        this.center_x = grid_size * this.style.spacing_multiplier + this.radius + center_coords[0];
        this.center_y = grid_size * this.style.spacing_multiplier + this.radius + center_coords[1];
        this.center = new Point(this.center_x, this.center_y);
        this.indicator = false;
        this.starting_angle = this.style.turn_limit ? -135 : 180;
        this.available_angle =  this.style.turn_limit ? 270 : 360; 
    };

    draw(color) {
        this.drawBorder();
        this.drawIndicator(color);
        if (this.style.highlights) {
            this.drawHighlights(color)
        }
        this.drawMarkings();
    };

    drawBorder() {
        var dialBorder = new Path.Circle(this.center, this.radius);
        strokePath(dialBorder)

        if (this.style.inner_border) {
            var innerDialBorder = new Path.Circle(this.center, this.inner_border_radius);
            strokePath(innerDialBorder)
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
                    new Point(this.center_x - rectangle_width / 2, this.center_y - rectangle_height / 2),
                    new Point(this.center_x + rectangle_width / 2, this.center_y + rectangle_height / 2)
                );
                center_offset = (0.75 * this.radius) - (rectangle_height / 2);
                break;
            case "diamond":
                indicator_radius = decimalPoint(this.grid_size / getRandomInt(2, 3));
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
        };
        strokePath(this.indicator)
    };

    drawMarkings() {
        var first_marking;
        var marking_length = decimalPoint(this.spacing / getRandomInt(3, 4), 1);
        first_marking = new Path();
        first_marking.add(
            this.center,
            new Point(this.center_x, this.center_y - marking_length)
        );
        var random_multiplier = getRandomInt(1, 3) / 2
        first_marking.position.y -= (this.radius + (marking_length * random_multiplier));
        first_marking.rotate(this.starting_angle, this.center);

        for(var i = 0; i <= this.style.markings_quantity; i++) {
            var cloned_marking = first_marking.clone();
            cloned_marking.rotate(i * (this.available_angle / this.style.markings_quantity), this.center);
            // either im dumb or somehow a combined statement doesnt work
            if (!this.style.highlights) {
                strokePath(cloned_marking)
            } else {
                if (i % (this.style.markings_quantity / this.style.highlights_quantity) != 0) {
                    strokePath(cloned_marking)
                };
            };
        };

        if (!this.style.highlights) {
            strokePath(first_marking)
        };
    };

    drawHighlights(color) {
        var first_highlight;
        var highlight_radius = this.grid_size / getRandomInt(2,4);
        var length_multiplier = getRandomInt(4, 6) / 2

        function shiftY(full_radius, small_radius, highlight_radius) {
            var available_space = full_radius - small_radius - (2 * highlight_radius)
            return full_radius - highlight_radius - (getRandomInt(2, 3) * (available_space / 5))
        }

        if (this.style.highlights_style == "circle") {
            first_highlight = new Path.Circle(this.center, highlight_radius)
        } else {
            var edges = 4 
            var rotation = 0
            switch (this.style.highlights_style) {
                case "triangle":
                    edges = 3
                    rotation = 180
                    break;
                case "diamond":
                    rotation = 45
                    length_multiplier = 1
                    break;
                default:
                    break;
            }
            first_highlight = new Path.RegularPolygon(this.center, edges, highlight_radius)
            first_highlight.rotate(rotation)
            first_highlight.scale(1, length_multiplier)
            highlight_radius = highlight_radius * length_multiplier
        }

        first_highlight.position.y -= shiftY(this.full_radius, this.radius, highlight_radius)
        first_highlight.rotate(this.starting_angle, this.center)

        if (this.style.highlights_fill) {
            first_highlight.fillColor = color;
        } else {
            strokePath(first_highlight)
        };

        for (var i = 0; i <= this.style.highlights_quantity; i++) {
            var cloned_highlight = first_highlight.clone();
            cloned_highlight.rotate(i * (this.available_angle / this.style.highlights_quantity), this.center)
        }
    };
};
