// THIS RANDOM FUNCTION RETURNS AN INTERGER FROM __1__ TO MAX INCLUSIVE IF MIN IS DEFAULT
function getRandomInt(max, min = 1) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function defineSynthSize(max_width, max_height, default_grid_size) {
    var grid_max_width = Math.floor(max_width / default_grid_size); 
    var grid_max_height = Math.floor(max_height / default_grid_size);
    // Since the synth must be able to contain individual modules,
    // the synth size is dependent on the sizes of the modules.
    // A module must be able to contain at least an array of 4 dials
    // A dial is two times the size of the default grid 
    // A dial must be at least 2 default grid size away from another dial/button/slider/border
    // Therefore, the minimum size of a module can fall into one of these
    // (say that default grid size is 10)
    // ([width, height]) [60,180], [100, 100], [180, 60]
    var min_sizes = [
        [default_grid_size * 6, default_grid_size * 18],
        [default_grid_size * 10, default_grid_size * 10],
        [default_grid_size * 18, default_grid_size * 6],
    ];
    // The synth must also be not smaller than half the canvas' width and height
    var w_multiplier = getRandomInt(grid_max_width, Math.floor(grid_max_width / 2))
    var h_multiplier = getRandomInt(grid_max_height, Math.floor(grid_max_height / 2))

    var synth_width = w_multiplier * default_grid_size;
    var synth_height = h_multiplier * default_grid_size;

    if (min_sizes.includes([synth_width, synth_height])) {
        defineSynthSize(max_width, max_height, default_grid_size)
    } else {
        var synth_size = {w: synth_width, h: synth_height};
        return synth_size;
    };
};

function divideArea(length_to_divide, default_grid_size) {

}

export function defineModuleSizes(synth_size, default_grid_size) {
    if (synth_size.w < default_grid_size * 3) {

    } else {
        var lengths 
    }
}