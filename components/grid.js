const { Path, Point, Group, PointText } = paper
import { BaseComponent } from "./base-component.js";
import { applyStroke } from "./helper-funcs.js";

export class BaseGrid extends BaseComponent {
    constructor({
        grid_size, color, origin_x, origin_y,
        type = 'BaseGrid',
        total_width = 500,
        total_height = 500, 
        marks_interval = 50,
        multiple = 5
    }) {
        super({grid_size, color, origin_x, origin_y, type})
        this.total_height = total_height;
        this.total_width = total_width;
        this.multiple = multiple;
        this.marks_interval = marks_interval
        this.top_left = new Point(0, 0);
        this.top_center = new Point(total_width / 2, 0);
        this.top_right = new Point(total_width, 0);
        this.center_left = new Point(0, total_height / 2);
        this.center_right = new Point(total_width, total_height / 2);
        this.bottom_left = new Point(0, total_height);
        this.bottom_center = new Point(total_width / 2, total_height);
        this.bottom_right = new Point(total_width, total_height);
        this.draw();
    };

    draw() {
        var verticals = new Group();
        var horizontals = new Group();
        var first_vertical = new Path.Line(this.top_left, this.bottom_left);
        applyStroke(first_vertical, {scale_down_by: 8})
        for (var i = 0; i < (this.total_width / this.grid_size); i++) {
            var cloned_vertical = first_vertical.clone()
            cloned_vertical.position.x += i * this.grid_size;
            if (i % 5 == 0) {applyStroke(cloned_vertical, {scale_down_by: 4})}
            verticals.addChild(cloned_vertical)
        };
        verticals.addChild(first_vertical);
        var first_horizontal = new Path.Line(this.top_left, this.top_right);
        applyStroke(first_horizontal, {scale_down_by: 8})
        for (var i = 0; i < (this.total_height / this.grid_size); i++) {
            var cloned_horizontal = first_horizontal.clone();
            cloned_horizontal.position.y += i * this.grid_size;
            if (i % 5 == 0) {applyStroke(cloned_horizontal, {scale_down_by: 4})}
            horizontals.addChild(cloned_horizontal);
        };
        horizontals.addChild(first_horizontal);
        var vert_marks = this.drawMarks('x')
        var hor_marks = this.drawMarks('y')
        var Grid = new Group([verticals, horizontals, vert_marks, hor_marks]);
        Grid.opacity = 0.5
        this.group.addChild(Grid);
    };

    drawMarks(axis) {
        var marks = new Group();
        var axis_length = axis == 'x' ? this.total_height : this.total_width;
        var pair = axis == 'x' ? [0, 1] : [1, 0];
        for (var i = 0; i < axis_length; i += this.marks_interval) {
            var mark = new PointText(new Point(pair[0] * i, pair[1] * i + this.grid_size));
            mark.fontFamily = 'monospace';
            mark.fontWeight = 'bold';
            mark.fillColor = 'white'
            mark.content = i;
            marks.addChild(mark)
        };
        return marks;
    };
};