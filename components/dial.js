const { Point, Path, Group } = paper;
import { BaseComponent } from "./base-component.js";
import { decimalPoint, getRandomElement, getRandomInt, strokePath, binaryChoice } from "./helper-funcs.js";
import { Jack, StatusLight } from "./small-components.js";

export class Dial extends BaseComponent {
    constructor({
        grid_size, origin_x, origin_y, color, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Dial',
        knob_radius_factor = getRandomElement([1.5, 2, 2.5, 3, 4]),
        knob_is_grooved = binaryChoice(0.5, true, false),
        outer_ring_size_factor = getRandomElement([0, 0.25, 0.3, 0.5]),
        indicator_sides = getRandomElement([0, 1, 3, 4]),
        indicator_size_factor = getRandomElement([0.2, 0.25, 0.3]),
        indicator_is_filled = binaryChoice(0.5, true, false),
        indicator_is_diamond = binaryChoice(0.5, true, false),
        indicator_stretch_factor = getRandomElement([1, 1.5, 2, 3]),
        notch_distance_factor = getRandomElement([1.5,]),
        mark_quantity = getRandomElement([0, 2, 3, 4, 5, 6]),
        mark_sides = getRandomElement([0, 3, 4]),
        mark_size_factor = getRandomElement([1, 1.5]),
        mark_stretch_factor = getRandomElement([1, 2, 3]),
        mark_is_filled = binaryChoice(0.5, true, false),
        tick_chance_with_mark = binaryChoice(0.5, true, false),
        tick_quantity_factor = getRandomInt(5,20),
        tick_size_factor = getRandomElement([0.5, 0.75, 1]),
        has_jack = binaryChoice(0.5, true, false),
        jack_edges = getRandomElement([0, 6]),
        has_light = binaryChoice(0.5, true, false),
        light_edges = binaryChoice(0.5, 0, 4)
    }) {
        super({grid_size, origin_x, origin_y, color, padding_top, padding_bottom, padding_right, padding_left, type});
        /* ------------------------------------------------------ */
        this.knob_radius_factor = knob_radius_factor;
        this.knob_is_grooved = knob_is_grooved;
        this.outer_ring_size_factor = outer_ring_size_factor;
        this.start_angle = -135;
        this.rotation_arc = 270;
        this.indicator_sides = indicator_sides;
        this.indicator_size_factor = indicator_size_factor;
        this.indicator_is_filled = indicator_is_filled;
        this.indicator_is_diamond = indicator_is_diamond;
        this.indicator_stretch_factor = indicator_stretch_factor;
        this.notch_distance_factor = notch_distance_factor;
        this.mark_quantity = mark_quantity;
        this.mark_sides = mark_sides;
        this.mark_size_factor = mark_size_factor;
        this.mark_stretch_factor = mark_stretch_factor;
        this.mark_is_filled = mark_is_filled;
        this.tick_chance_with_mark = tick_chance_with_mark;
        this.tick_quantity_factor = tick_quantity_factor;
        this.tick_size_factor = tick_size_factor;
        this.has_jack = has_jack;
        this.jack_edges = jack_edges;
        this.has_light = has_light;
        this.light_edges = light_edges;
        /* ------------------------------------------------------ */
        this.draw()
    };

    draw() {
        console.log(this)
        super.draw();
        this.drawKnob();
        this.drawNotches();
        if (this.has_jack) {this.drawJack()};
        if (this.has_light) {this.drawLight()};
    };

    drawKnob() {
        var knob_radius = this.grid_size * this.knob_radius_factor;
        var knob = new Path.Circle(this.origin_point, knob_radius);
        if (this.knob_is_grooved) {knob = this.groovifyKnob(knob, knob_radius)};
        strokePath(knob);
        this.group.addChild(knob)
        if (this.outer_ring_size_factor) {
            var outer_ring = this.drawOuterRing(knob, knob_radius)
            this.group.addChild(outer_ring)
        };
        var indicator = this.drawIndicator(knob_radius);
        this.group.addChild(indicator)
        this.group.rotate(getRandomInt(this.start_angle, this.start_angle + this.rotation_arc))
    };

    groovifyKnob(knob_path, knob_radius) {
        var base_groove = new Path.Circle(this.origin_point, knob_radius)
        base_groove.position.y -= decimalPoint((28/15), 2) * knob_radius;
        var first_groove = base_groove.clone();
        for (var i = 1; i < 8; i++) {
            var cloned_groove = first_groove.clone();
            cloned_groove.rotate(i * (360 / 8), this.origin_point);
            base_groove = base_groove.unite(cloned_groove);
        };
        knob_path = knob_path.subtract(base_groove);
        return knob_path;
    };

    drawOuterRing(knob_path, knob_radius) {
        var outer_ring_radius = (this.grid_size * this.outer_ring_size_factor) + knob_radius;
        var outer_ring = new Path.Circle(this.origin_point, outer_ring_radius);
        var cloned_knob_path = knob_path.clone();
        outer_ring = outer_ring.subtract(cloned_knob_path)
        outer_ring.fillColor = this.color;
        return outer_ring;
    };

    drawIndicator(knob_radius) {
        var indicator;
        var indicator_radius = this.grid_size * this.indicator_size_factor;
        if (this.indicator_sides > 2) {
            indicator = new Path.RegularPolygon(this.origin_point, this.indicator_sides, indicator_radius)
        } else if (this.indicator_sides == 1) {
            var indicator_end = new Point(this.origin_point.x, this.origin_point.y - (indicator_radius * 2))
            indicator = new Path.Line(this.origin_point, indicator_end)
        } else {
            indicator = new Path.Circle(this.origin_point, indicator_radius)
        };
        if (this.indicator_sides == 4 && this.indicator_is_diamond) {indicator.rotate(45)};
        if (this.indicator_edges == 1) {
            indicator.position.y -= (knob_radius - (indicator_radius * 2));
            if (this.dial_is_grooved) {indicator.position.y += (knob_radius * 4/15)};
        } else {
            indicator.position.y -= Math.abs((knob_radius - indicator_radius - this.grid_size));
        }; 
        var stretch = this.indicator_sides ? this.indicator_stretch_factor : 1;
        indicator.scale(1, stretch, indicator.bounds.topCenter)
        strokePath(indicator);
        if (this.indicator_is_filled) {
            indicator.fillColor = this.color;
        };
        return indicator;
    };

    drawNotches() {
        var notches = new Group();
        var outer_ring_radius = (1 + this.outer_ring_size_factor) * (this.knob_radius_factor * this.grid_size);
        var distance = outer_ring_radius * this.notch_distance_factor;
        var delta_distance = distance - outer_ring_radius;
        var mark_radius = (delta_distance / 3) / this.mark_size_factor;
        var mark_stretch_factor = this.mark_stretch_factor;
        var tick_quantity = this.tick_quantity_factor;
        var tick_size = this.tick_size_factor * this.grid_size;
        if (this.mark_quantity) {
            var rounded_tick_quantity = this.mark_quantity + ((this.mark_quantity - 1) * Math.round(this.tick_quantity_factor / 5))
            tick_quantity = this.tick_chance_with_mark ? rounded_tick_quantity : 0;
            var marks = this.drawMarks(this.mark_quantity, distance, this.mark_sides, mark_radius, mark_stretch_factor);
            notches.addChild(marks);
        };
        if (tick_quantity) {
            var ticks = this.drawTicks(tick_quantity, distance, tick_size, this.mark_quantity);
            notches.addChild(ticks);
        };
        this.group.addChild(notches);
    };

    drawMarks(quantity, distance, sides, radius, stretch_factor) {
        var marks = new Group();
        var first_mark;
        var arc = this.rotation_arc / (quantity - 1)
        if (sides) {
            first_mark = new Path.RegularPolygon(this.origin_point, sides, radius);
            first_mark.rotate(180);
            first_mark.scale(1, stretch_factor);
        } else {
            first_mark = new Path.Circle(this.origin_point, radius);
        };
        strokePath(first_mark);
        if (this.mark_is_filled) {first_mark.fillColor = this.color};
        first_mark.position.y -= distance;
        first_mark.rotate(this.start_angle, this.origin_point);
        for (var i = 1; i < quantity; i++) {
            var cloned_mark = first_mark.clone();
            cloned_mark.rotate(i * arc, this.origin_point);
            marks.addChild(cloned_mark);
        }
        marks.addChild(first_mark);
        return marks;
    };

    drawTicks(quantity, distance, length, mark_quantity) {
        var ticks = new Group();
        var first_tick;
        var first_tick_end = new Point(this.origin_point.x, this.origin_point.y - length);
        var arc = this.rotation_arc / (quantity - 1);
        var to_exclude = [];
        if (mark_quantity) {
            for (var i = 1; i < mark_quantity; i++) {
                to_exclude.push(i * (Math.round(this.tick_quantity_factor / 5) + 1));
            };
        }
        first_tick = new Path.Line(this.origin_point, first_tick_end);
        first_tick.position.y -= (distance - length / 2);
        first_tick.rotate(this.start_angle, this.origin_point);
        for (var i = 1; i < quantity; i++) {
            var cloned_tick = first_tick.clone();
            cloned_tick.rotate(i * arc, this.origin_point);
            if (!to_exclude.includes(i)) {
                strokePath(cloned_tick);
            };
            ticks.addChild(cloned_tick);
        };
        if (!mark_quantity) {
            strokePath(first_tick);
            ticks.addChild(first_tick);
        };
        return ticks;
    };

    drawJack() {
        var jack_center_x = this.group.position.x;
        var jack_center_y = this.group.position.y + (this.group.bounds.height / 2) + this.grid_size * 4.5;
        var jack = new Jack({origin_x: jack_center_x, origin_y: jack_center_y, border_edges: this.jack_edges});
        this.group.addChild(jack.group);
    };

    drawLight() {
        var light_center_x = this.group.position.x;
        var light_center_y = this.group.position.y - (this.group.bounds.height / 2) - (this.grid_size * 4.5);
        var light = new StatusLight({origin_x: light_center_x, origin_y: light_center_y, edges: this.light_edges});
        this.group.addChild(light.group);
    };
};