const { Path, Point, Group } = paper
import { BaseComponent } from "../bases-and-canvas-elements/base-component.js";
import { binaryChoice, getBottomRight, getRandomElement, getTopLeft, strokePath } from "../helper-funcs.js";

export class Toggle extends BaseComponent{
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'Toggle',
        style = getRandomElement([1, 2, 3]),
        is_horizontal = binaryChoice(0.5, true, false),
        hex_size_factor = 3,
        hex_selector_size_factor = 1,
        track_w_factor = 2,
        track_h_factor = 4,
        ridges_factor_1 = 6,
        ridges_factor_2 = 10,
    }) {
        super({grid_size, color, origin_x, origin_y, type});
        /********************************************************************/
        this.style = style;
        this.is_horizontal = is_horizontal;
        this.hex_size_factor = hex_size_factor;
        this.hex_selector_size_factor = hex_selector_size_factor;
        this.track_w_factor = track_w_factor;
        this.track_h_factor = track_h_factor;
        this.ridges_factor_1 = ridges_factor_1;
        this.ridges_factor_2 = ridges_factor_2;
        /********************************************************************/
        // this.draw()
    };

    draw() {
        super.draw()
        var toggle;
        switch (this.style) {
            case 2: toggle = this.drawToggle2(); break;
            case 3: toggle = this.drawToggle3(); break;
            default: toggle = this.drawToggle1(); break;
        };
        this.group.addChild(toggle);
        var on_mark_l = this.grid_size
        var on_mark = new Path.Line(this.origin_point, new Point(this.origin_point.x + on_mark_l, this.origin_point.y));
        on_mark.position.x -= on_mark_l / 2;
        on_mark.position.y -= ((toggle.bounds.height / 2) + this.grid_size);
        strokePath(on_mark);
        var off_mark_radius = on_mark_l / 2;
        var off_mark = new Path.Circle(this.origin_point, off_mark_radius);
        off_mark.position.y += ((toggle.bounds.height / 2)) + this.grid_size + off_mark_radius;
        strokePath(off_mark)
        this.group.addChildren([on_mark, off_mark]);
        if (this.is_horizontal) {this.group.rotate(90)};
    };


    drawToggle1() {
        var toggle = new Group();
        var track_w = this.grid_size * this.track_w_factor;
        var track_h = this.grid_size * this.track_h_factor;
        var track_top_left = getTopLeft(track_w, track_h, this.origin_point);
        var track_bottom_right = getBottomRight(track_w, track_h, this.origin_point);
        var track = new Path.Rectangle(track_top_left, track_bottom_right);
        strokePath(track);
        toggle.addChild(track);
        var selector_w = this.grid_size * this.track_w_factor * 0.7;
        var selector_h = ((this.grid_size * this.track_h_factor) / 2) * 0.85;
        var selector_top_left = getTopLeft(selector_w, selector_h, this.origin_point);
        var selector_bottom_right = getBottomRight(selector_w, selector_h, this.origin_point);
        var selector = new Path.Rectangle(selector_top_left, selector_bottom_right);
        strokePath(selector);
        var selector_group = new Group([selector]);
        var first_ridge = new Path.Line(selector.bounds.topLeft, selector.bounds.topRight);
        strokePath(first_ridge, {stroke_width: 1});
        var ridge_gap = selector_h / (this.ridges_factor_1 + 1)
        first_ridge.position.y += ridge_gap;
        for (var i = 1; i < this.ridges_factor_1; i++) {
            var cloned_ridge = first_ridge.clone();
            cloned_ridge.position.y += (i * ridge_gap);
            selector_group.addChild(cloned_ridge);
        };
        selector_group.addChild(first_ridge);
        var move_choice = binaryChoice(0.5, 1, -1);
        selector_group.position.y = selector_group.position.y + (move_choice * (selector_h / 2))
        toggle.addChild(selector_group);
        return toggle;
    };

    drawToggle2() {
        var toggle = new Group();
        var track_w = this.grid_size * 1.5 * this.track_w_factor;
        var track_h = this.grid_size * 1.5 * this.track_h_factor;
        var track_top_left = getTopLeft(track_w, track_h, this.origin_point);
        var track_bottom_right = getBottomRight(track_w, track_h, this.origin_point);
        var track = new Path.Rectangle(track_top_left, track_bottom_right);
        strokePath(track)
        toggle.addChild(track);
        var selector_w = track_w * 0.8;
        var selector_h = track_h * 0.9;
        var selector_top_left = getTopLeft(selector_w, selector_h, this.origin_point)
        var selector_bottom_right = getBottomRight(selector_w, selector_h, this.origin_point)
        var selector = new Path.Rectangle(selector_top_left, selector_bottom_right);
        strokePath(selector);
        toggle.addChild(selector);
        var ridges = new Group();
        var ridge_gap = (selector_h * 0.75) / (this.ridges_factor_2 + 1)
        var first_ridge = new Path.Line(selector_top_left, selector.bounds.topRight)
        first_ridge.position.y += ridge_gap
        strokePath(first_ridge, {stroke_width: 1})
        for (var i = 1; i < this.ridges_factor_2; i++) {
            var cloned_ridge = first_ridge.clone();
            cloned_ridge.position.y += (i * ridge_gap);
            ridges.addChild(cloned_ridge);
        };
        ridges.addChild(first_ridge);
        toggle.addChild(ridges);
        return toggle;
    };

    drawToggle3() {
        var toggle = new Group();
        var toggle_base_group = new Group();
        var toggle_edge_group = new Group();
        var toggle_edge_radius = this.grid_size * this.hex_size_factor
        var toggle_edge = new Path.RegularPolygon(this.origin_point, 6, toggle_edge_radius);
        toggle_edge.fillColor = this.color;
        var toggle_base_edge_mask = new Path.Circle(this.origin_point, toggle_edge_radius * 0.8);
        toggle_base_edge_mask = toggle_edge.subtract(toggle_base_edge_mask)
        toggle_edge_group.addChildren([toggle_base_edge_mask, toggle_edge]);
        toggle_edge_group.clipped = true;
        var toggle_base_ring = new Path.Circle(this.origin_point, toggle_edge_radius * 0.6);
        strokePath(toggle_base_ring);
        toggle_base_group.addChildren([toggle_edge_group, toggle_base_ring]);
        var selector_group = new Group();
        var selector_radius = this.grid_size * this.hex_selector_size_factor;
        var selector_top = new Path.Circle(this.origin_point, selector_radius);
        var selector_base = new Path.Arc({
            from: [selector_top.bounds.leftCenter.x, selector_top.bounds.leftCenter.y],
            through: [selector_top.bounds.bottomCenter.x, selector_top.bounds.bottomCenter.y],
            to: [selector_top.bounds.rightCenter.x, selector_top.bounds.rightCenter.y]
        });
        selector_base.position.y += ((toggle_edge_radius * 0.25) - selector_radius)
        selector_top.position.y -= ((toggle_edge_radius * 0.7) - selector_radius);
        var selector_left_edge = new Path.Line(selector_top.bounds.leftCenter, selector_base.bounds.topLeft);
        var selector_right_edge = new Path.Line(selector_top.bounds.rightCenter, selector_base.bounds.topRight);
        selector_group.addChildren([selector_base, selector_left_edge, selector_right_edge, selector_top]);
        var rotate_choice = binaryChoice(0.5, 0, 1);
        selector_group.rotate(rotate_choice * 180, this.origin_point);
        var toggle_base_mask = toggle_edge.clone().subtract(selector_top.clone());
        toggle_base_group.addChild(toggle_base_mask);
        toggle_base_mask.sendToBack();
        toggle_base_group.clipped = true;
        strokePath(selector_group);
        toggle.addChildren([toggle_base_group, selector_group]);
        return toggle;
    }
};