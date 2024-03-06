export function getRandomElement(source_array) {
    return source_array[Math.floor(Math.random() * source_array.length)];
};

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function decimalPoint(number ,decimal_point) {
    return Math.floor(number * (10 ** decimal_point)) / (10 ** decimal_point)
}