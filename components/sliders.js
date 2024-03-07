const { Path, Point, Group } = paper
import { decimalPoint, getRandomElement, getRandomInt, strokePath } from "./helper-funcs.js";

const slider_specs = {
    knob_styles: ['circle', 'concave_rec', 'trapezoid', 'thin', 'rounded_rec'],
    knob_sizes: [2, 3, 4]
}

export class SingleSlider {
    constructor(
        grid_size,
        is_horizontal = Math.random() > 0.8 ? true : false,
        knob_style = getRandomElement(slider_specs.knob_styles),
        knob_size = getRandomElement(slider_specs.knob_sizes),
        knob_fill = Math.random() > 0.5 ? true : false,
        knob_percentage = decimalPoint(Math.random(), 2) / 10, //multiply by groove length to get knob x y 
        groove_rounded_corners = Math.random() > 0.5 ? true : false,
        groove_fill = Math.random() > 0.5 ? true : false,
        highlight_quantity = Math.random() > 0.5 ? getRandomElement([2,3,4,5]) : 0,
        has_light = Math.random() > 0.5 ? true : false,
        has_jack = Math.random() > 0.5 ? true : false
    ) {
        this.grid_size = grid_size;
        this.is_horizontal = is_horizontal;
        this.knob_style = knob_style;
        this.knob_size = knob_size;
        this.knob_fill = knob_fill;
        this.knob_percentage = knob_percentage
        this.groove_rounded_corners = groove_rounded_corners
        this.groove_fill = groove_fill
        this.highlight_quantity = highlight_quantity
        switch (this.highlight_quantity) {
            case 0:
                this.markings_quantity = Math.random() > 0.5 ? getRandomInt(5, 12) : 0
                break;
            case 2:
                this.markings_quantity = getRandomInt(2, 5) * 2
                break;
            case 3:
                this.markings_quantity = Math.random() > 0.5 ? getRandomInt(2, 4) * 3 : 0;
                break;
            case 4:
                this.markings_quantity = Math.random() > 0.75 ? getRandomInt(2, 3) * 4 : 0;
                break;
            default:
                this.markings_quantity = 0
                break;
        }
        this.has_light = has_light
        if (this.has_light) {
            if (this.is_horizontal) {
                this.light_position = getRandomElement(['left', 'right']);
                this.light_is_round = true;
            } else {
                this.light_position = getRandomElement(['top', 'bottom']);
                this.light_is_round = Math.random() > 0.5 ? true : false;
            }
        };
        this.has_jack = has_jack
        if (this.has_jack) {
            if (this.is_horizontal) {
                this.jack_position = getRandomElement(['left', 'right']);
            } else {
                this.jack_position = getRandomElement(['top', 'bottom']);
            }
        }

        this.group = new Group();
        this.center = new Point(0, 0);
        this.width = 0;
        this.height = 0;
    }

    listAttributes() {
        console.log(this)
    }

    draw(color) {
        this.center = this.group.position;
        this.width = this.group.bounds.width;
        this.height = this.group.bounds.height;
    }
}