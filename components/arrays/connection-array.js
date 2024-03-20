const { Path, Point, Group } = paper;
import { default_grid_size, default_color } from "../bases-and-canvas-elements/base-component.js";
import { getRandomInt } from "../helper-funcs.js";
import { Cord } from "../small-components.js";

export class ConnectionArray {
    constructor() {
        this.jacks = []
        this.cords = new Group();
    };

    addJack(jack_group) {
        var pseudo_jack = {
            x: jack_group.position.x,
            y: jack_group.position.y,
            connected: false,
            to: false
        };
        this.jacks.push(pseudo_jack)
    };

    addJacks(jacks) {
        for (var i = 0; i < jacks.length; i++) {
            this.addJack(jacks[i]);
        };
    };

    connectPair(in_index, out_index) {
        this.jacks[in_index].connected = true;
        this.jacks[in_index].to = out_index;
        this.jacks[out_index].connected = true;
        this.jacks[out_index].to = in_index;
        var cord_obj = new Cord({
            in_co_ords: [this.jacks[in_index].x, this.jacks[in_index].y], 
            out_co_ords: [this.jacks[out_index].x, this.jacks[out_index].y]
        });
        this.cords.addChild(cord_obj.group)
    };

    connectRandomPair() {
        var in_index = this.getRandomUnconnectedJack()
        var out_index = this.getRandomUnconnectedJack({exclude: in_index})
        this.connectPair(in_index, out_index)
    };

    getRandomUnconnectedJack(options = {}) {
        const { exclude } = options;
        var jack_index = getRandomInt(0, this.jacks.length - 1);
        if (jack_index == exclude || this.jacks[jack_index].connected == true) {
            jack_index = this.getRandomUnconnectedJack(options);
        };
        return jack_index;
    };

    connectRandomMulti(options = {}) {
        const { pair_quantity = 1 } = options;
        var total_possible_pairs = Math.floor(this.jacks.length / 2);
        var final_pair_quantity = pair_quantity < total_possible_pairs ? pair_quantity : total_possible_pairs;
        for (var i = 1; i <= final_pair_quantity; i++) {
            this.connectRandomPair();
        };
    };
};