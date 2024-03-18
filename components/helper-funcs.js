const { Point } = paper;

export function getRandomElement(source_array) {
    return source_array[Math.floor(Math.random() * source_array.length)];
};

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function decimalPoint(number ,decimal_point) {
    return Math.floor(number * (10 ** decimal_point)) / (10 ** decimal_point)
}

export function strokePath(vector_object, options = {}) {
    const { stroke_width = 2, stroke_color = "white" } = options;
    vector_object.strokeWidth = stroke_width
    vector_object.strokeColor = stroke_color
}

export function binaryChoice(choice_1_chance, choice_1, choice_2) {
    return Math.random() < choice_1_chance ? choice_1 : choice_2
}

export function getTopLeft(w, h, center_point) {
    return new Point(center_point.x - (w / 2),center_point.y - (h / 2))
}

export function getBottomRight(w, h, center_point) {
    return new Point(center_point.x + (w / 2),center_point.y + (h / 2))
}

export function getRandomString(options = {}) {
    const {length = 3} = options;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var random_string = '';
    for (var i = 0; i < length; i++) {
        random_string += getRandomElement(characters)
    };
    return random_string;
};