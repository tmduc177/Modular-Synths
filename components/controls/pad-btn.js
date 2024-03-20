const { Path, Point, Group } = paper
import { BaseComponent } from "../bases-and-canvas-elements/base-component.js";
import { binaryChoice, strokePath } from "../helper-funcs.js";

export class PadBtn extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'PadBtn',
        length_factor = 5,
        is_raised = binaryChoice(0.5, true, false),
        raised_is_circle = binaryChoice(0.5, true, false),
        unraised_and_has_light = binaryChoice(0.5, true, false)
    }) {
        super({grid_size, color, origin_x, origin_y, type});
        /********************************************************************/
        this.length_factor = length_factor;
        this.is_raised = is_raised;
        this.raised_is_circle = raised_is_circle;
        this.unraised_and_has_light = unraised_and_has_light
        /********************************************************************/
        // this.draw();
    };

    draw() {
        super.draw();
        this.drawEdge();
    };

    drawEdge() {
        var length = this.length_factor * this.grid_size;
        var top_left = new Point(this.origin_point.x - (length / 2), this.origin_point.y - (length / 2));
        var bottom_right = new Point(this.origin_point.x + (length / 2), this.origin_point.y + (length / 2));
        var edge = new Path.Rectangle(top_left, bottom_right);
        if (this.is_raised) {
            var raised = this.drawRaised(edge);
            this.group.addChild(raised);
        } else {
            if(this.unraised_and_has_light) {
                var light = this.drawIndicator();
                this.group.addChild(light);
            };
        };
        strokePath(edge);
        this.group.addChild(edge);
    };

    drawRaised(edge) {
        var raised = new Group();
        var raised_edge;
        if (this.raised_is_circle) {
            var radius = ((this.length_factor / 2) - (1/3)) * this.grid_size;
            raised_edge = new Path.Circle(this.origin_point, radius);
        } else {
            var length = (this.length_factor * this.grid_size) / 1.75;
            var top_left = new Point(this.origin_point.x - (length / 2), this.origin_point.y - (length / 2));
            var bottom_right = new Point(this.origin_point.x + (length / 2), this.origin_point.y + (length / 2));
            var raised_edge = new Group();
            var border = new Path.Rectangle(top_left, bottom_right);
            var diagonal = new Path.Line(edge.bounds.topLeft, border.bounds.topLeft);
            raised_edge.addChildren([
                border, diagonal,
                diagonal.clone().rotate(90, this.origin_point),
                diagonal.clone().rotate(180, this.origin_point),
                diagonal.clone().rotate(-90, this.origin_point)
            ]);
        };
        strokePath(raised_edge, {stroke_width: 1});
        var light = this.drawIndicator();
        var clipping_mask = edge.clone().subtract(light.clone());
        raised.addChild(clipping_mask);
        raised.addChild(raised_edge);
        raised.clipped = true;
        strokePath(raised, {stroke_width: 1});
        return raised;
    };

    drawIndicator() {
        var width = this.grid_size / 2;
        var height = (this.length_factor / 2) * (this.grid_size / 1.25) ;
        var top_left = new Point(this.origin_point.x - (width / 2), this.origin_point.y - (height / 2));
        var bottom_right = new Point(this.origin_point.x + (width / 2), this.origin_point.y + (height / 2));
        var light = new Path.Rectangle(top_left, bottom_right);
        light.position.y -= (((this.length_factor * this.grid_size) / 2) - (height / 2))
        strokePath(light, {stroke_width: 1})
        var light_is_on = binaryChoice(0.5, true, false);
        if (light_is_on) {light.fillColor = this.color}
        return light;
    };
};