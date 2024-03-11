const { Point, Path, Group } = paper;
import { BaseComponent } from "./base-component.js";
import { decimalPoint, getRandomElement, getRandomInt, strokePath, binaryChoice } from "./helper-funcs.js";
import { Jack, StatusLight } from "./small-components.js";

const default_grid_size = 10

export class Dial extends BaseComponent {
    constructor({
        grid_size, origin_x, origin_y, color, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Dial',
        dial_radius_factor = getRandomElement([1.5, 2, 2.5, 3, 4]),
        dial_is_grooved = binaryChoice(0.5, true, false),
        outer_ring_size_factor = getRandomElement([0, 0.25, 0.3, 0.5]),
        start_angle = -135,
        rotation_arc = 270,
        indicator_edges = getRandomElement([0, 1, 3, 4]),
        indicator_is_filled = binaryChoice(0.5, true, false),
        indicator_size_factor = getRandomElement([1, 1.5, 2, 3]),
        highlight_quantity = getRandomElement([0, 2, 3, 4, 5, 6]),
        highlight_edges = getRandomElement([0, 3, 4]),
        highlight_size_factor = getRandomElement([0.5, 0.75, 1]),
        hightlight_is_filled = binaryChoice(0.5, true, false),
        marking_quantity_factor = getRandomInt(5,20),
        marking_size_factor = getRandomElement([1, 1.5, 2, 2.5, 4]),
        distance_from_dial_factor = 3,
        has_jack = binaryChoice(0.5, true, false),
        jack_edges = getRandomElement([0, 6]),
        has_light = binaryChoice(0.5, true, false),
        light_edges = binaryChoice(0.5, 0, 4)
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        this.dial_radius = dial_radius_factor * this.grid_size;
        this.dial_is_grooved = dial_is_grooved;
        if (outer_ring_size_factor) {
            this.outer_ring_radius = (outer_ring_size_factor * this.grid_size) + this.dial_radius
        };
        this.start_angle = start_angle;
        this.rotation_arc = rotation_arc;
        this.indicator_edges = indicator_edges;
        this.indicator_is_filled = indicator_is_filled;
        this.indicator_size = this.dial_radius / indicator_size_factor;
        this.highlight_quantity = highlight_quantity;
        if (this.highlight_quantity) {
            this.highlight_edges = highlight_edges;
            this.highlight_size = this.grid_size * highlight_size_factor;
            this.highlight_is_filled = hightlight_is_filled;
        }
        function getMarkingQuantity(hq) {
            var mq = marking_quantity_factor
            if (hq) {mq = binaryChoice(0.5, 0, hq + ((hq - 1) * Math.round(marking_quantity_factor / 5)))};
            return mq;
        };
        this.marking_quantity = getMarkingQuantity(this.highlight_quantity);
        if (this.marking_quantity) {
            this.marking_size = Math.floor(this.grid_size / marking_size_factor);
        };
        this.distance_from_dial = getRandomInt(this.grid_size, (this.grid_size * distance_from_dial_factor));
        this.distance_from_center = outer_ring_size_factor ? this.outer_ring_radius : this.dial_radius;
        if (this.highlight_size) {
            this.distance_from_center += this.highlight_size / 2 + this.distance_from_dial
        } else {
            this.distance_from_center += this.marking_size / 2 + this.distance_from_dial
        };
        this.has_jack = has_jack;
        if (this.has_jack) {
            this.jack_edges = jack_edges;
        };
        this.has_light = has_light;
        if (this.has_light) {
            this.light_edges = light_edges;
        }

        this.draw()
    };

    listAttributes() {
        console.log(this);
    };

    draw() {
        this.drawDial();
        this.drawAllMarkings();
        if (this.has_jack) {
            this.drawJack();
        };
        if (this.has_light) {
            this.drawLight();
        };
    };

    drawDial() {
        // Knob
        var knob = new Path.Circle(this.origin_point, this.dial_radius);
        if (this.dial_is_grooved) {
            var base_groove = new Path.Circle(this.origin_point, this.dial_radius * 0.75);
            // it seems that paper struggles with very precise points (very small objects / many places after the decimal points)
            // if points are too close then the whole thing couldnt render
            // somehow 23/15 works, although not perfectly, but will have to do for now
            // 23/15 only works for desktop
            base_groove.position.y -= decimalPoint((23/15), 2) * this.dial_radius;
            var first_groove = base_groove.clone()
            for (var i = 1; i < 8; i++) {
                var cloned_groove = first_groove.clone();
                cloned_groove.rotate(i * (360 / 8), this.origin_point);
                base_groove = base_groove.unite(cloned_groove)
            };
            knob = knob.subtract(base_groove)
        };
        strokePath(knob)
        this.group.addChild(knob)

        // Outer ring
        if (this.outer_ring_radius != this.dial_radius); {
            var outer_ring = new Path.Circle(this.origin_point, this.outer_ring_radius);
            outer_ring = outer_ring.subtract(knob);
            outer_ring.fillColor = this.color;
            this.group.addChild(outer_ring)
        };

        // Indicator
        var indicator;
        var indicator_radius = this.grid_size * getRandomElement([0.25, 0.3]);
        var highlight_stretch = getRandomElement([1, 2, 2.5]);
        switch (this.indicator_edges) {
            case 0:
                indicator = new Path.Circle(this.origin_point, indicator_radius);
                break;
            case 1:
                indicator_radius = (this.dial_radius * (1 / getRandomInt(2,4)));
                indicator = new Path();
                indicator.add(this.origin_point);
                indicator.add(this.origin_point.x, this.origin_point.y - (indicator_radius * 2));
                break;
            default:
                indicator = new Path.RegularPolygon(this.origin_point, this.indicator_edges, indicator_radius);
                var is_diamond = this.indicator_edges == 4 ? binaryChoice(0.5, true, false) : false;
                if (is_diamond) {
                    indicator.rotate(45);
                } else {
                    indicator.scale(1, highlight_stretch);
                    indicator_radius = indicator_radius * highlight_stretch;
                };
                break;
        };
        // This if statement is very dumb but somehow i could not get .intersect or .clipMask to work
        if (this.indicator_edges == 1) {
            indicator.position.y -= (this.dial_radius - (indicator_radius * 2));
            if (this.dial_is_grooved) {
                indicator.position.y += (this.dial_radius * 4/15);
            }
        } else {
            indicator.position.y -= Math.abs((this.dial_radius - indicator_radius - this.grid_size));
        };
        strokePath(indicator);
        if (this.indicator_is_filled) {indicator.fillColor = this.color};
        this.group.addChild(indicator);
        var dial_rotation_percentage = getRandomInt(0, 100) / 100;
        this.group.rotate((this.start_angle + (this.rotation_arc * dial_rotation_percentage)), this.origin_point);
    };

    drawAllMarkings() {
        var first_highlight;
        var first_marking;

        if (this.highlight_quantity) {
            var highlight_segments = this.highlight_quantity - 1;
            var highlight_step = this.rotation_arc / highlight_segments;
            var highlight_stretch = getRandomInt(Math.floor(this.highlight_size), this.distance_from_dial) / Math.floor(this.highlight_size)
            if (this.highlight_edges) {
                first_highlight = new Path.RegularPolygon(this.origin_point, this.highlight_edges, this.highlight_size / 2);
            } else {
                first_highlight = new Path.Circle(this.origin_point, this.highlight_size / 2);
            };
            if (this.highlight_edges >= 3) {
                first_highlight.rotate(180);
                first_highlight.scale(1, highlight_stretch);
            }
            first_highlight.position.y -= this.distance_from_center;
            first_highlight.rotate(this.start_angle, this.origin_point);
            strokePath(first_highlight);
            if (this.highlight_is_filled) {first_highlight.fillColor = this.color};
            this.group.addChild(first_highlight);
            for (var i = 1; i < this.highlight_quantity; i++) {
                var cloned_highlight = first_highlight.clone();
                cloned_highlight.rotate(i * highlight_step, this.origin_point);
                this.group.addChild(cloned_highlight);
            };
        };

        if (this.marking_quantity) {
            var marking_segments = this.marking_quantity - 1
            var marking_step = this.rotation_arc / marking_segments;
            first_marking = new Path();
            first_marking.add(this.origin_point);
            first_marking.add(this.origin_point.x, this.origin_point.y - this.marking_size);
            first_marking.position.y -= this.distance_from_center;
            first_marking.rotate(this.start_angle, this.origin_point);
            for (var i = 1; i < this.marking_quantity; i++) {
                var cloned_marking = first_marking.clone();
                cloned_marking.rotate(i * marking_step, this.origin_point);
                if (!this.highlight_quantity || (i % (marking_segments / highlight_segments) != 0)) {
                    strokePath(cloned_marking);
                    this.group.addChild(cloned_marking);
                };
            };
            if (!this.highlight_quantity) {
                strokePath(first_marking);
                this.group.addChild(first_marking);
            };
        };
    };

    drawJack() {
        var jack_center_x = this.group.position.x;
        var jack_center_y = this.group.position.y + (this.group.bounds.height / 2) + this.grid_size * 4.5
        var jack = new Jack({origin_x: jack_center_x, origin_y: jack_center_y, border_edges: this.jack_edges})
        this.group.addChild(jack.group)
    }

    drawLight() {
        var light_center_x = this.group.position.x;
        var light_center_y = this.group.position.y - (this.group.bounds.height / 2) - (this.grid_size * 4.5);
        var light = new StatusLight({origin_x: light_center_x, origin_y: light_center_y, edges: this.light_edges})
        this.group.addChild(light.group)
    };
};