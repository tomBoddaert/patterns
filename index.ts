const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas?.getContext('2d');

interface color {
    defaultRGB?: number,
    defaultA?: number,
    r?: number,
    g?: number,
    b?: number,
    a?: number
}

// Set individual pixel
function setPixel(imageData: ImageData, x: number, y: number, { defaultRGB = 255, defaultA = 255, r = defaultRGB, g = defaultRGB, b = defaultRGB, a = defaultA }: color) {
    const pos = y * imageData.width * 4 + x * 4;
    imageData.data[pos] = r;
    imageData.data[pos + 1] = g;
    imageData.data[pos + 2] = b;
    imageData.data[pos + 3] = a;
}

// Functions to reduce x and y to single number
const fs: { [key: string]: (x: number, y: number) => number } = {
    xor: (x, y) => (x ^ y) % 9,
    and: (x, y) => (x & y) % 9,
    or: (x, y) => (x | y) % 9
}

// Functions to convert single number to a color
const toColors: { [key: string]: (res: number) => color } = {
    red: (res) => {return {
        defaultRGB: 0,
        r: res === 0 ? 255 : 0
    }},
    green: (res) => {return {
        defaultRGB: 0,
        g: res === 1 ? 255 : 0
    }},
    blue: (res) => {return {
        defaultRGB: 0,
        b: res === 2 ? 255 : 0
    }},
    rgb: (res) => {return {
        defaultRGB: 0,
        r: res === 0 ? 255 : 0,
        g: res === 1 ? 255 : 0,
        b: res === 2 ? 255 : 0,
    }},
    rgbBalanced: (res) => {return {
        defaultRGB: 0,
        r: res === 0 ? 255 : res === 5 ? 64 : 0,
        g: res === 7 ? 64 : 0,
        b: res === 2 ? 255 : res === 6 ? 64 : 0
    }},
    nineColor: (res) => {
        let lut = [[0, 0, 0], [0, 0, 0], [0, 0, 255], [0, 255, 0], [0, 255, 255], [255, 0, 0], [255, 0, 255], [255, 255, 0], [255, 255, 255]];
        return {
            defaultRGB: 0,
            r: lut[res % 9][0],
            g: lut[res % 9][1],
            b: lut[res % 9][2]
    }},
    blackAndWhite: (res) => {
        let val = (res === 0 || res === 4 || res === 9 || res === 11 || res === 13) ? 0 : 255;
        return {
            r: val,
            g: val,
            b: val
        }
    }
}

function mixColors(fs: Function[]) {
    return (res: number): color => {
        let colorSum: color = {
            defaultRGB: 0,
            defaultA: 255,
            r: 0,
            g: 0,
            b: 0
        }
        fs.forEach(f => {
            let newColor: color = f(res);
            colorSum.defaultRGB += newColor.defaultRGB ?? 0;
            colorSum.defaultA += newColor.defaultA ?? 255;
            colorSum.r += newColor.r ?? 0;
            colorSum.g += newColor.g ?? 0;
            colorSum.b += newColor.b ?? 0;
        });
        return {
            defaultRGB: ~~(colorSum.defaultRGB / fs.length),
            defaultA: ~~(colorSum.defaultA / fs.length),
            r: ~~(colorSum.r / fs.length),
            g: ~~(colorSum.g / fs.length),
            b: ~~(colorSum.b / fs.length)
        }
    }
}

// Draw each pixel
function draw(f = fs.xor, toColor = toColors.red) {
    if (!ctx) return console.error("ctx undefined!");

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            setPixel(imageData, x, y, toColor(f(x, y)));
        }
    }

    ctx.putImageData(imageData, 0, 0);

    console.log("Done");
}

// Run
draw(); 