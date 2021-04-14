var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
// Set individual pixel
function setPixel(imageData, x, y, _a) {
    var _b = _a.defaultRGB, defaultRGB = _b === void 0 ? 255 : _b, _c = _a.defaultA, defaultA = _c === void 0 ? 255 : _c, _d = _a.r, r = _d === void 0 ? defaultRGB : _d, _e = _a.g, g = _e === void 0 ? defaultRGB : _e, _f = _a.b, b = _f === void 0 ? defaultRGB : _f, _g = _a.a, a = _g === void 0 ? defaultA : _g;
    var pos = y * imageData.width * 4 + x * 4;
    imageData.data[pos] = r;
    imageData.data[pos + 1] = g;
    imageData.data[pos + 2] = b;
    imageData.data[pos + 3] = a;
}
// Functions to reduce x and y to single number
var fs = {
    xor: function (x, y) { return (x ^ y) % 9; },
    and: function (x, y) { return (x & y) % 9; },
    or: function (x, y) { return (x | y) % 9; }
};
// Functions to convert single number to a color
var toColors = {
    red: function (res) {
        return {
            defaultRGB: 0,
            r: res === 0 ? 255 : 0
        };
    },
    green: function (res) {
        return {
            defaultRGB: 0,
            g: res === 1 ? 255 : 0
        };
    },
    blue: function (res) {
        return {
            defaultRGB: 0,
            b: res === 2 ? 255 : 0
        };
    },
    rgb: function (res) {
        return {
            defaultRGB: 0,
            r: res === 0 ? 255 : 0,
            g: res === 1 ? 255 : 0,
            b: res === 2 ? 255 : 0
        };
    },
    rgbBalanced: function (res) {
        return {
            defaultRGB: 0,
            r: res === 0 ? 255 : res === 5 ? 64 : 0,
            g: res === 7 ? 64 : 0,
            b: res === 2 ? 255 : res === 6 ? 64 : 0
        };
    },
    nineColor: function (res) {
        var lut = [[0, 0, 0], [0, 0, 0], [0, 0, 255], [0, 255, 0], [0, 255, 255], [255, 0, 0], [255, 0, 255], [255, 255, 0], [255, 255, 255]];
        return {
            defaultRGB: 0,
            r: lut[res % 9][0],
            g: lut[res % 9][1],
            b: lut[res % 9][2]
        };
    },
    blackAndWhite: function (res) {
        var val = (res === 0 || res === 4 || res === 9 || res === 11 || res === 13) ? 0 : 255;
        return {
            r: val,
            g: val,
            b: val
        };
    }
};
function mixColors(fs) {
    return function (res) {
        var colorSum = {
            defaultRGB: 0,
            defaultA: 255,
            r: 0,
            g: 0,
            b: 0
        };
        fs.forEach(function (f) {
            var _a, _b, _c, _d, _e;
            var newColor = f(res);
            colorSum.defaultRGB += (_a = newColor.defaultRGB) !== null && _a !== void 0 ? _a : 0;
            colorSum.defaultA += (_b = newColor.defaultA) !== null && _b !== void 0 ? _b : 255;
            colorSum.r += (_c = newColor.r) !== null && _c !== void 0 ? _c : 0;
            colorSum.g += (_d = newColor.g) !== null && _d !== void 0 ? _d : 0;
            colorSum.b += (_e = newColor.b) !== null && _e !== void 0 ? _e : 0;
        });
        return {
            defaultRGB: ~~(colorSum.defaultRGB / fs.length),
            defaultA: ~~(colorSum.defaultA / fs.length),
            r: ~~(colorSum.r / fs.length),
            g: ~~(colorSum.g / fs.length),
            b: ~~(colorSum.b / fs.length)
        };
    };
}
// Draw each pixel
function draw(f, toColor) {
    if (f === void 0) { f = fs.xor; }
    if (toColor === void 0) { toColor = toColors.red; }
    if (!ctx)
        return console.error("ctx undefined!");
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            setPixel(imageData, x, y, toColor(f(x, y)));
        }
    }
    ctx.putImageData(imageData, 0, 0);
    console.log("Done");
}
// Run
draw();
