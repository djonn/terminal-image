import type Array2D from "../array2d";
import {
  subtract,
  multiply,
  rgb,
  type Pixel,
  add,
  normalize,
  XTERM_COLOR_PALETTE,
} from "../pixel";

/**
 * Returns a dithering functions meant for mapping a 2d array
 * Allows specifying a color palette, defaults to 256 color from XTERM
 *
 * @see {_dithering}
 */
export const ditheringFn = (palette: Pixel[] = XTERM_COLOR_PALETTE) => {
  return (oldPixel: Pixel, index: [number, number], array: Array2D<Pixel>) =>
    _dithering(palette, oldPixel, index, array);
};

/**
 * Dithered using the Floyd-Steinberg algorithm
 *
 * @param arr 2d array of any dimension
 * @returns 2d array with each cell containing one braile character
 */
const _dithering = (
  palette: Pixel[],
  oldPixel: Pixel,
  [x, y]: [number, number],
  array: Array2D<Pixel>,
): Pixel => {
  const newPixel = findClosestColor(oldPixel, palette);
  const error = subtract(oldPixel, newPixel);

  distributeError(array, x + 1, y, error, 7 / 16);
  distributeError(array, x - 1, y + 1, error, 3 / 16);
  distributeError(array, x, y + 1, error, 5 / 16);
  distributeError(array, x + 1, y + 1, error, 1 / 16);

  return newPixel;
};

const findClosestColor = (pixel: Pixel, palette: Pixel[]): Pixel => {
  const euclideanDistance = (a: Pixel, b: Pixel) => {
    const redPart = (a.r - b.r) ** 2;
    const greenPart = (a.g - b.g) ** 2;
    const bluePart = (a.b - b.b) ** 2;

    return Math.sqrt(redPart + greenPart + bluePart);
  };

  return palette
    .map((p): [Pixel, number] => [p, euclideanDistance(pixel, p)])
    .reduce(
      (acc, cur) => {
        if (typeof acc === "undefined") return cur;
        return acc[1] <= cur[1] ? acc : cur;
      },
      [rgb(255, 255, 255), 10000],
    )[0];
};

const distributeError = (
  array: Array2D<Pixel>,
  x: number,
  y: number,
  error: Pixel,
  factor: number,
) => {
  try {
    const factoredError = multiply(error, factor);
    const before = array.get(x, y);
    const after = normalize(add(before, factoredError));
    array.set(x, y, after);
  } catch (error) {
    // ignore out of bound errors
  }
};
