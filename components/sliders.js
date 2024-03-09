const { Path, Point, Group, Size } = paper
import { binaryChoice, decimalPoint, getRandomElement, getRandomInt, strokePath } from "./helper-funcs.js";

var default_grid_size = 10
var default_color = 'white'

export class Slider {
    constructor({
        grid_size = default_grid_size,
        color = default_color,
        origin_x = 0,
        origin_y = 0,
        is_horizontal = binaryChoice(0.2, true, false),
        knob_edges = getRandomElement([0, 4]),
        knob_h_factor = getRandomElement([1, 1.5, 2, 3, 4]),
        knob_w_factor = getRandomElement([1.5, 2, 2.5, 3, 4]),
        knob_radius_factor = getRandomElement([1, 1.5, 2]),
        indicator_is_disconnected = binaryChoice(0.5, true, false),
        track_length_factor = getRandomElement([4, 6, 8, 10]),
        track_rounded_corners = binaryChoice(0.5, true, false),
        track_fill = binaryChoice(0.5, true, false),
        highlight_quantity = getRandomInt(0,5),
        has_light = binaryChoice(0.5, true, false),
        has_jack = binaryChoice(0.5, true, false),
        jack_edges = binaryChoice(0.5, 0, 6)
    }) {
        this.grid_size = grid_size;
        this.color = color;
        this.origin_point = new Point(origin_x, origin_y)
        this.is_horizontal = is_horizontal;
        this.knob_edges = knob_edges;
        if (this.knob_edges) {
            this.knob_h_factor = knob_h_factor; 
            this.knob_w_factor = knob_w_factor;
            this.knob_width = this.knob_w_factor * this.grid_size;
            this.knob_height = this.knob_h_factor * this.grid_size;
            this.knob_top_left = new Point(
                this.origin_point.x - (this.knob_width / 2),
                this.origin_point.y - (this.knob_height / 2),
            );
            this.knob_bottom_right = new Point(
                this.origin_point.x + (this.knob_width / 2),
                this.origin_point.y + (this.knob_height / 2),
            );
            if (this.knob_h_factor > 1) {
                this.knob_ridges = binaryChoice(0.5, 0, getRandomInt(2,6));
            };
        } else {
            this.knob_radius = knob_radius_factor * this.grid_size
        }
        this.indicator_is_disconnected = indicator_is_disconnected;
        if (this.indicator_is_disconnected) {this.indicator_gap_factor = getRandomElement([0.25, 0.5])}
        this.track_length = this.grid_size * track_length_factor;
        this.track_rounded_corners = track_rounded_corners;
        this.track_fill = track_fill;
        this.highlight_quantity = highlight_quantity;
        function getMarkingQuantity(hq) {
            var mq = getRandomInt(5, 20);
            if (hq) {mq = binaryChoice(0.5, 0, hq + ((hq - 1) * getRandomInt(1,5)))}
            return mq
        };
        getMarkingQuantity(highlight_quantity)
        this.has_light = has_light
        this.light_position = this.is_horizontal ? getRandomElement([0, 180]) : getRandomElement([-90, 90])
        this.light_is_round = this.is_horizontal ? true : binaryChoice(0.5, true, false)
        this.has_jack = has_jack
        if (this.has_jack) {
            this.jack_edges = jack_edges
            if (this.is_horizontal) {
                this.jack_position = getRandomElement(['left', 'right']);
            } else {
                this.jack_position = getRandomElement(['top', 'bottom']);
            }
        }
        this.group = new Group();

        this.draw();
    };

    listAttributes() {
        console.log(this)
    }

    draw() {
        this.listAttributes()
        this.drawKTM()
        if (this.has_light) {this.drawLight()}
        if (this.has_jack) {this.drawJack()}
    }

    drawKTM() {
        var knob = new Group();
        var knob_outline;
        var knob_edge;
        var ridges;
        var indicator;
        function createRidges(origin_x, origin_y, knob_width, knob_height, ridge_quantity) {
            var ridges = new Group();
            var gap = knob_height / (ridge_quantity + 1);
            var origin_ridge_y = origin_y;
            var start_ridge_x = origin_x - (knob_width / 2);
            var end_ridge_x = origin_x + (knob_width / 2);
            var first_ridge = new Path.Line(
                new Point(start_ridge_x, origin_ridge_y), 
                new Point(end_ridge_x, origin_ridge_y)
            );            
            first_ridge.position.y -= ((knob_height / 2) - gap);
            ridges.addChild(first_ridge);
            for (var i = 1; i < ridge_quantity; i++) {
                var cloned_ridge = first_ridge.clone();
                cloned_ridge.position.y += (gap * i);
                ridges.addChild(cloned_ridge);
            };
            return ridges;
        }   
        
        // Knob edges
        if (this.knob_edges) {
            knob_edge = new Path.Rectangle(this.knob_top_left, this.knob_bottom_right);
        } else {
            knob_edge = new Path.Circle(this.origin_point, this.knob_radius);
        };
        strokePath(knob_edge);
        knob.addChild(knob_edge);
        
        // Knob ridges
        if (this.knob_ridges) {
            ridges = createRidges(this.origin_point.x, this.origin_point.y, this.knob_width, this.knob_height, this.knob_ridges);
            strokePath(ridges, {stroke_width: 1});
            knob.addChild(ridges);
        };

        // Knob Indicator
        var indicator_offset = this.knob_edges ? (this.knob_width / 2) : this.knob_radius;
        var indicator_start_point = new Point(this.origin_point.x - indicator_offset, this.origin_point.y);
        indicator = new Path.Line(
            new Point(indicator_start_point),
            new Point(this.origin_point.x + indicator_offset, this.origin_point.y)
        );
        strokePath(indicator);
        knob.addChild(indicator);
        if (this.indicator_is_disconnected) {
            var gap_length = indicator_offset * 2 * this.indicator_gap_factor;
            var line_factor = (1 - this.indicator_gap_factor) / 2;
            indicator.scale(line_factor, indicator_start_point);
            console.log(indicator);
            var right_indicator = indicator.clone();
            right_indicator.position.x += (indicator_offset * 2 * line_factor) + gap_length;
            knob.addChild(right_indicator);
        }

        // Track


        this.group.addChild(knob);
    };

    drawLight() {

    };

    drawJack() {

    };
};