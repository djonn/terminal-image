import styles from "ansi-styles";
import { pipe, splitEvery } from "ramda";
import { type Array2D, map as map2D, subDivide } from "./array2d";
import { type Pixel, loadImage } from "./loading";

const print2d = <T>(arr: Array2D<T>) => {
  const height = arr.data.length / arr.width;

  const terminalWidth = process.stdout.columns;
  const terminalHeight = process.stdout.rows;

  if (arr.width > terminalWidth || height > terminalHeight) {
    console.warn(
      "Dimensions being printed are greater than available terminal",
    );
  }

  const line = arr.data;
  const chart = splitEvery(arr.width, line);
  const text = chart.map((x) => x.join("")).join("\n");
  console.log(text);
};

// -----------------------------

const bwOneByTwo = (data: Array2D<Pixel>) => {
  const isWhite = ({ r, g, b }: Pixel) => r + g + b / 3 > 128;

  // biome-ignore lint/style/noNonNullAssertion: reason
  const fg = isWhite(data.data[0]!) ? styles.white.open : styles.black.open;
  // biome-ignore lint/style/noNonNullAssertion: reason
  const bg = isWhite(data.data[1]!) ? styles.bgWhite.open : styles.bgBlack.open;

  // Uses a "Upper Half Block" character
  return `${fg}${bg}▀${styles.reset.close}`;
};

const colorOneByTwo = (data: Array2D<Pixel>) => {
  const fg = styles.color.ansi(
    // biome-ignore lint/style/noNonNullAssertion: reason
    styles.rgbToAnsi(data.data[0]!.r, data.data[0]!.g, data.data[0]!.b),
  );
  const bg = styles.bgColor.ansi(
    // biome-ignore lint/style/noNonNullAssertion: reason
    styles.rgbToAnsi(data.data[1]!.r, data.data[1]!.g, data.data[1]!.b),
  );

  // Uses a "Upper Half Block" character
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

const printDoublePrecisionBWCircle = async () => {
  const image = await loadImage("img/20x20-black-circle.png");
  const subDivided = subDivide(1, 2, image);
  const mapped = map2D(bwOneByTwo, subDivided);
  print2d(mapped);
};

const printDoublePrecisionColorCat = async () => {
  const image = await loadImage("img/170x90-cat.png");
  const subDivided = subDivide(1, 2, image);
  const mapped = map2D(colorOneByTwo, subDivided);
  print2d(mapped);
};

const printFrierenInBraille = async () => {
  const image = await loadImage("img/192x192-frieren.png");
  const subDivide2x4 = <T>(arr: Array2D<T>) => subDivide(2, 4, arr);
  const mapToBraille = <T>(arr: Array2D<Array2D<Pixel>>) => map2D(braille, arr);
  pipe(subDivide2x4<Pixel>, mapToBraille, print2d)(image);
};

// -------------------------------

await printFrierenInBraille();
