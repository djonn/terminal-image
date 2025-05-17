import { splitEvery, maxBy, reduce } from "ramda";
import { type Image, type Pixel, getPixel, loadImage } from "./loading";
import styles from "ansi-styles";

// const IMAGE_URL = "img/20x20-black-circle.png";
// const IMAGE_URL = "img/2x2-rgb.png";
// const IMAGE_URL = "img/4x2-rgb.png";
// const IMAGE_URL = "img/170x90-cat.png";
const IMAGE_URL = "img/192x192-frieren.png";

const print2d = <T>(array: T[], width: number, fn: (x: T) => string) => {
  const height = array.length / width;

  const terminalWidth = process.stdout.columns;
  const terminalHeight = process.stdout.rows;

  if (width > terminalWidth || height > terminalHeight) {
    console.warn(
      "Dimensions being printed are greater than available terminal",
      { width, height },
    );
  }

  const line = array.map(fn);
  const chart = splitEvery(width, line);
  const text = chart.map((x) => x.join("")).join("\n");
  console.log(text);
};

const printImage_1x1Pixel = (
  image: Image,
  pixelFn: (pixel: Pixel) => string,
) => {
  print2d(image.pixels, image.width, pixelFn);
};

const averageLightness = ({ r, g, b, a }: Pixel): string =>
  r + g + b / 3 > 128 ? "x" : " ";

const dominantColor = (pixel: Pixel): string => {
  const [key, _value] = reduce(
    maxBy(([_k, v]) => v),
    ["", -100],
    Object.entries(pixel).filter(([k, _v]) => k !== "a"),
  );

  const charmap: { [key in keyof Omit<Pixel, "a">]: string } = {
    r: "R",
    g: "G",
    b: "B",
  };

  return charmap[key as keyof Omit<Pixel, "a">];
};

// -----------------------------

const printImage_1x2Pixel = (
  image: [Pixel, Pixel][],
  width: number,
  fn: (pixel: [Pixel, Pixel]) => string,
) => {
  print2d(image, width, fn);
};

const subDivide = (image: Image, sW: number, sH: number) => {
  // original -> o
  // segment  -> s
  // result   -> r

  const { width: oW, height: oH } = image;

  if (oW % sW !== 0 || oH % sH !== 0) {
    console.warn(
      "The image size is not perfectly divisible by the segment size. Some of the image will be cut",
    );
  }

  const rW = Math.floor(oW / sW);
  const rH = Math.floor(oH / sH);

  const result = [];
  for (let i = 0; i < rW * rH; i++) {
    const rX = i % rW;
    const rY = Math.floor(i / rW);

    const oX = rX * sW;
    const oY = rY * sH;

    const segment: Pixel[] = [];
    for (let sX = oX; sX < oX + sW; sX++) {
      for (let sY = oY; sY < oY + sH; sY++) {
        const pixel = getPixel(image, sX, sY);
        segment.push(pixel);
      }
    }
    result.push(segment);
  }
  return result;
};

const bwOneByTwo = (data: [Pixel, Pixel]) => {
  const isWhite = ({ r, g, b }: Pixel) => r + g + b / 3 > 128;

  const fg = isWhite(data[0]) ? styles.white.open : styles.black.open;
  const bg = isWhite(data[1]) ? styles.bgWhite.open : styles.bgBlack.open;

  return `${fg}${bg}▀${styles.reset.close}`;
};

const colorOneByTwo = (data: [Pixel, Pixel]) => {
  const fg = styles.color.ansi(
    styles.rgbToAnsi(data[0].r, data[0].g, data[0].b),
  );
  const bg = styles.bgColor.ansi(
    styles.rgbToAnsi(data[1].r, data[1].g, data[1].b),
  );

  return `${fg}${bg}▀${styles.reset.close}`;
};

// -------------------------------

const braille = (data: Pixel[]): string => {
  // The dots on unicode braille is numbered transposed in relation to how we do it
  // 0 4
  // 1 5
  // 2 6
  // 3 7
  const transposedData = [
    data[0],
    data[4],
    data[1],
    data[5],
    data[2],
    data[6],
    data[3],
    data[7],
  ];

  const isWhite = ({ r, g, b }: Pixel) => (r + g + b / 3 > 128 ? "0" : "1");
  const binaryString = data.map(isWhite).join("");

  // U+2800 Braille Pattern Blank
  // This is the first character in the list of 256 braille symbols
  const BRAILLE_CODEPOINT_OFFSET = 10240;

  const codePoint = Number.parseInt(binaryString, 2) + BRAILLE_CODEPOINT_OFFSET;
  return String.fromCodePoint(codePoint);
};

// -------------------------------

const image = await loadImage(IMAGE_URL);

// printImage_1x1Pixel(image, dominantColor);

// const subDivided = subDivide(image, 1, 2);
// printImage_1x2Pixel(subDivided as [Pixel, Pixel][], image.width, colorOneByTwo);

const subDivided = subDivide(image, 2, 4);
print2d(subDivided, image.width / 2, braille);
