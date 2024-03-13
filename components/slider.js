const { Path, Point, Group } = paper
import { BaseComponent } from "./base-component.js";
import { binaryChoice, decimalPoint, getRandomElement, getRandomInt, strokePath } from "./helper-funcs.js";
import { Jack, StatusLight } from "./small-components.js";

export class Slider extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Slider',
        is_horizontal = binaryChoice(0.5, true, false),
        knob_edges = getRandomElement([0, 4]),
        knob_h_factor = getRandomElement([1, 1.5, 2, 3, 4]),
        knob_w_factor = getRandomElement([1.5, 2, 2.5, 3, 4]),
        knob_radius_factor = getRandomElement([1, 1.5, 2]),
        knob_ridges = binaryChoice(0.5, 0, getRandomInt(2,6)),
        indicator_is_disconnected = binaryChoice(0.5, true, false),
        indicator_gap_factor = getRandomElement([0.25, 0.5]),
        track_length_factor = getRandomInt(15, 30),
        track_is_filled = binaryChoice(0.5, true, false),
        mark_quantity = getRandomInt(0,5),
        mark_w_factor = 1,
        tick_quantity_factor = getRandomInt(4,20),
        tick_with_mark_chance = binaryChoice(0.5, true, false),
        tick_w_factor = 0.5,
        has_jack = binaryChoice(0.5, true, false),
        jack_edges = binaryChoice(0.5, 0, 6),
        has_light = binaryChoice(0.5, true, false),
        light_edges = binaryChoice(0.5, 0, 4)
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        /********************************************************************/
        this.is_horizontal = is_horizontal;
        this.knob_edges = knob_edges;
        this.knob_h_factor = knob_h_factor;
        this.knob_w_factor = knob_w_factor;
        this.knob_ridges = knob_ridges;
        this.knob_radius_factor = knob_radius_factor;
        this.indicator_is_disconnected = indicator_is_disconnected;
        this.indicator_gap_factor = indicator_gap_factor;
        this.track_length_factor = track_length_factor;
        this.track_is_filled = track_is_filled;
        this.mark_quantity = mark_quantity;
        this.mark_w_factor = mark_w_factor;
        this.tick_quantity_factor = tick_quantity_factor;
        this.tick_with_mark_chance = tick_with_mark_chance;
        this.tick_w_factor = tick_w_factor;
        this.has_light = has_light;
        this.light_edges = light_edges;
        this.has_jack = has_jack;
        this.jack_edges = jack_edges;
        /********************************************************************/
        this.track_length = track_length_factor * this.grid_size;
        this.knob_radius = knob_radius_factor * this.grid_size;
        this.mark_w = mark_w_factor * this.grid_size * 2;
        this.tick_w = tick_w_factor * this.grid_size;
        this.exclude_props_on_clone.concat(['track_length', 'knob_radius', 'mark_w', 'tick_w'])
        this.draw()
    };

    draw() {
        console.log(this)
        super.draw();
        this.drawKnob();
        var knob_shadow = this.group.children[0].children[0].clone();
        var track = this.drawTrack();
        var notches = new Group();
        if (this.mark_quantity) {
            var marks = this.drawNotches(this.mark_quantity, this.mark_w, 2);
            notches.addChild(marks);
        }
        var tick_quantity = this.tick_quantity_factor;
        if (this.mark_quantity) {
            var rounded_tick_quantity = this.mark_quantity + ((this.mark_quantity - 1) * Math.round(this.tick_quantity_factor / 4));
            tick_quantity = this.tick_with_mark_chance ? rounded_tick_quantity : 0;
        };
        if (tick_quantity) {
            var ticks = this.drawNotches(tick_quantity, this.tick_w, 1);
            notches.addChild(ticks);
        };
        var bottom_layer = new Group([track, notches]);
        var bottom_layer_shadow = new Path.Rectangle(
            bottom_layer.bounds.topLeft.add(new Point(-2, -2)), 
            bottom_layer.bounds.bottomRight.add(new Point(2, 2))
        );
        var bottom_layer_mask = bottom_layer_shadow.subtract(knob_shadow)
        bottom_layer.addChild(bottom_layer_mask);
        bottom_layer_mask.sendToBack();
        bottom_layer.clipped = true;
        this.group.addChild(bottom_layer)
        if (this.is_horizontal) {
            this.group.rotate(90)
        }
        if (this.has_light) {this.drawLight()};
        if (this.has_jack) {this.drawJack()};
    };

    drawKnob() {

        var knob = new Group();
        var knob_edge;
        var knob_w = this.knob_w_factor * this.grid_size;
        var knob_h = this.knob_h_factor * this.grid_size;
        if (this.knob_edges) {
            var top_left = new Point(this.origin_point.x - (knob_w / 2), this.origin_point.y - (knob_h / 2));
            var bottom_right = new Point(this.origin_point.x + (knob_w / 2), this.origin_point.y + (knob_h / 2));
            knob_edge = new Path.Rectangle(top_left, bottom_right);
        } else {
            knob_edge = new Path.Circle(this.origin_point, this.knob_radius)
        };
        strokePath(knob_edge);
        knob.addChild(knob_edge);
        if (this.knob_ridges && this.knob_edges) {
            var ridges = this.drawRidges(knob_w, knob_h);
            knob.addChild(ridges);
        };
        var indicator = this.drawIndicator();
        var knob_y_percentage = decimalPoint(Math.random(), 2);
        knob.addChild(indicator);
        knob.position.y += (this.track_length / 2);
        knob.position.y -= (knob_y_percentage * this.track_length);
        this.group.addChild(knob);
    };

    drawRidges(knob_w, knob_h) {
        var ridges = new Group();
        var gap = knob_h / (this.knob_ridges + 1);
        var origin_ridge_y = this.origin_point.y;

        var start_ridge_x = this.origin_point.x - (knob_w / 2);
        var end_ridge_x = this.origin_point.x + (knob_w / 2);
        var first_ridge = new Path.Line(
            new Point(start_ridge_x, origin_ridge_y),
            new Point(end_ridge_x, origin_ridge_y)
        );
        first_ridge.position.y -= ((knob_h / 2) - gap);
        for (var i = 1; i < this.knob_ridges; i ++) {
            var cloned_ridge = first_ridge.clone();
            cloned_ridge.position.y += (i * gap);
            ridges.addChild(cloned_ridge);
        };
        ridges.addChild(first_ridge);
        strokePath(ridges, {stroke_width: 1});
        return ridges;
    };

    drawIndicator() {
        var indicator = new Group();
        var indicator_offset = this.knob_edges ? ((this.knob_w_factor * this.grid_size) / 2) : this.knob_radius;
        var start_point = new Point(this.origin_point.x - indicator_offset, this.origin_point.y);
        var end_point = new Point(this.origin_point.x + indicator_offset, this.origin_point.y);
        var first_indicator = new Path.Line(start_point, end_point);
        strokePath(indicator);
        if (this.indicator_is_disconnected) {
            var gap_length = indicator_offset * 2 * this.indicator_gap_factor;
            var line_factor = (1 - this.indicator_gap_factor) / 2;
            first_indicator.scale(line_factor, start_point);
            var right_indicator = first_indicator.clone();
            right_indicator.position.x += (indicator_offset * 2 * line_factor) + gap_length;
            indicator.addChild(right_indicator);
        }
        indicator.addChild(first_indicator)
        strokePath(indicator);
        return indicator;
    };

    drawTrack() {
        var top_left = new Point(this.origin_point.x - (this.grid_size / 4), this.origin_point.y - (this.track_length / 2));
        var bottom_right = bottom_right = new Point(this.origin_point.x + (this.grid_size / 4), this.origin_point.y + (this.track_length / 2));
        var track = new Path.Rectangle(top_left, bottom_right);
        strokePath(track);
        if (this.track_is_filled) {track.fillColor = this.color};
        return track;
    };

    drawNotches(quantity, width, stroke_thickness) {
        var notches = new Group();
        var left_notches = new Group();
        var start_point = new Point(this.origin_point.x - this.grid_size, this.origin_point.y - this.track_length / 2);
        var end_point = new Point(this.origin_point.x - this.grid_size - width, this.origin_point.y - this.track_length / 2);
        var first_notch = new Path.Line(start_point, end_point);
        var gap = 0;
        strokePath(first_notch, {stroke_width: stroke_thickness});
        left_notches.addChild(first_notch)
        if (quantity - 1) {
            gap = this.track_length / (quantity - 1);            
        };
        for (var i = 1; i < quantity; i++) {
            var cloned_notch = first_notch.clone();
            cloned_notch.position.y += (i * gap)
            left_notches.addChild(cloned_notch);
        };
        var right_notch = left_notches.clone();
        right_notch.scale(-1, 1, this.origin_point);
        notches.addChild(left_notches)
        notches.addChild(right_notch);
        return notches;
    };

    drawLight() {
        var light_center_x = this.group.position.x;
        var light_center_y = this.group.position.y - (this.group.bounds.height / 2) - (this.grid_size * 4.5);
        var light = new StatusLight({origin_x: light_center_x, origin_y: light_center_y, edges: this.light_edges})
        this.group.addChild(light.group)
    };

    drawJack() {
        var jack_center_x = this.group.position.x;
        var jack_center_y = this.group.position.y + (this.group.bounds.height / 2) + (this.grid_size * 4.5)
        var jack = new Jack({origin_x: jack_center_x, origin_y: jack_center_y, border_edges: this.jack_edges})
        this.group.addChild(jack.group)
    };
};
