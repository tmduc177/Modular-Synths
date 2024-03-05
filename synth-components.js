// THIS RANDOM FUNCTION RETURNS AN INTERGER FROM __1__ TO MAX INCLUSIVE
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Since the synth must be able to contain individual modules,
// the synth size is dependent on the sizes of the modules.
// A module must be able to contain at least an array of 4 dials
// A dial is two times the size of the default grid 
// A dial must be at least 2 default grid size away from another dial/button/slider/border
// Therefore, the minimum size of a module can fall into one of these
// (say that default grid size is 10)
// ([width, height]) [60,180], [100, 100], [180, 60]
export function defineSynthSize(maxWidth, maxHeight, defaultGridSize) {
    var synthWidth = maxWidth - (getRandomInt(4) * (2 * defaultGridSize));
    var synthHeight = maxHeight - (getRandomInt(4) * (2 * defaultGridSize));
    var minSizes = [
        [defaultGridSize * 6, defaultGridSize * 18],
        [defaultGridSize * 10, defaultGridSize * 10],
        [defaultGridSize * 18, defaultGridSize * 6],
    ];
    
    if (minSizes.includes([synthWidth, synthHeight])) {
        defineSynthSize(maxWidth, maxHeight, defaultGridSize)
    } else {
        var synthSize = {w: synthWidth, h: synthHeight};
        return synthSize;
    };
};

