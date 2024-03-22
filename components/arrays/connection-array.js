const { Group } = paper;
import { getRandomInt } from "../helper-funcs.js";
import { Cord } from "../small-components.js";

export class ConnectionArray {
    constructor() {
        this.jacks = []
        this.jack_objs = []
        this.cords = new Group();
    };

    addJackObj(jack_obj) {
        this.jack_objs.push(jack_obj);
    };

    addJackObjs(jack_objs) {
        for (var i = 0; i < jack_objs.length; i++) {
            this.addJackObj(jack_objs[i]);
        };
    };

    connectPair(in_index, out_index) {
        this.jack_objs[in_index].connected = true;
        this.jack_objs[in_index].to = out_index;
        this.jack_objs[out_index].connected = true;
        this.jack_objs[out_index].to = in_index;
        var cord_obj = new Cord({
            in_co_ords: [this.jack_objs[in_index].origin_x, this.jack_objs[in_index].origin_y], 
            out_co_ords: [this.jack_objs[out_index].origin_x, this.jack_objs[out_index].origin_y]
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
        var jack_index = getRandomInt(0, this.jack_objs.length - 1);
        if (jack_index == exclude || this.jack_objs[jack_index].connected == true) {
            jack_index = this.getRandomUnconnectedJack(options);
        };
        return jack_index;
    };

    connectRandomMulti(options = {}) {
        const { pair_quantity = 1 } = options;
        var total_possible_pairs = Math.floor(this.jack_objs.length / 2);
        var final_pair_quantity = pair_quantity < total_possible_pairs ? pair_quantity : total_possible_pairs;
        for (var i = 1; i <= final_pair_quantity; i++) {
            this.connectRandomPair();
        };
    };
};