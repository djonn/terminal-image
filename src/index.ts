import { splitEvery, maxBy, reduce } from "ramda";
import { type Image, type Pixel, loadImage } from "./loading";
import styles from "ansi-styles";
import { type Array2D, subDivide } from "./array2d";

// const IMAGE_URL = "img/20x20-black-circle.png";
// const IMAGE_URL = "img/2x2-rgb.png";
// const IMAGE_URL = "img/4x2-rgb.png";
// const IMAGE_URL = "img/170x90-cat.png";
const IMAGE_URL = "img/192x192-frieren.png";

const print2d = <T>(arr: Array2D<T>, fn: (x: T) => string) => {
  const height = arr.data.length / arr.width;

  const terminalWidth = process.stdout.columns;
  const terminalHeight = process.stdout.rows;

  if (arr.width > terminalWidth || height > terminalHeight) {
    console.warn(
      "Dimensions being printed are greater than available terminal",
    );
  }

  const line = arr.data.map(fn);
  const chart = splitEvery(arr.width, line);
  const text = chart.map((x) => x.join("")).join("\n");
  console.log(text);
};

const printImage_1x1Pixel = (
  image: Image,
  pixelFn: (pixel: Pixel) => string,
) => {
  print2d(image, pixelFn);
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
  image: Array2D<[Pixel, Pixel]>,
  fn: (pixel: [Pixel, Pixel]) => string,
) => {
  print2d(image, fn);
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

const braille = (arr: Array2D<Pixel>): string => {
  // The dots on unicode braille is numbered transposed in relation to how we do it
  // 0 4
  // 1 5
  // 2 6
  // 3 7
  const transposedData = [
    arr.data[0],
    arr.data[4],
    arr.data[1],
    arr.data[5],
    arr.data[2],
    arr.data[6],
    arr.data[3],
    arr.data[7],
  ] as Pixel[];

  const isWhite = ({ r, g, b }: Pixel) => (r + g + b / 3 > 128 ? "0" : "1");
  const binaryString = transposedData.map(isWhite).join("");

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
print2d(subDivided, braille);
