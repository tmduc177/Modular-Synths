const { Path, Point, Group } = paper
import { BaseComponent } from "./base-component.js";
import { binaryChoice, getBottomRight, getRandomElement, getTopLeft, strokePath } from "./helper-funcs.js";

export class Toggle extends BaseComponent{
    constructor({
        grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left,
        type = 'Toggle',
        style = getRandomElement([1, 2, 3]),
        is_horizontal = binaryChoice(0.5, true, false),
        track_w_factor = 2,
        track_h_factor = 4,
        ridges_factor = 6,
    }) {
        super({grid_size, color, origin_x, origin_y, padding_top, padding_bottom, padding_right, padding_left, type});
        /********************************************************************/
        this.style = style;
        this.is_horizontal = is_horizontal;
        this.track_w_factor = track_w_factor;
        this.track_h_factor = track_h_factor;
        this.ridges_factor = ridges_factor;
        /********************************************************************/
        this.draw()
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
        if (this.is_horizontal) {this.group.rotate(90)};
    };


    drawToggle1() {
        var toggle = new Group();
        var track_w = this.grid_size * this.track_w_factor;
        var track_h = this.grid_size * this.track_h_factor;
        var track_top_left = getTopLeft(track_w, track_h, this.origin_point)
        var track_bottom_right = getBottomRight(track_w, track_h, this.origin_point)
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
        var ridge_gap = selector_h / (this.ridges_factor + 1)
        first_ridge.position.y += ridge_gap;
        for (var i = 1; i < this.ridges_factor; i++) {
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
        
    };

    drawToggle3() {

    }
};