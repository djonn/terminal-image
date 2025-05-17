import type Array2D from "../array2d";
import type { Pixel } from "../loading";

/**
 * @param arr 2d array with dimensions of 2x4
 * @returns 2d array with each cell containing one braile character
 */
export const braille = (arr: Array2D<Pixel>): string => {
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
