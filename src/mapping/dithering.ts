import type Array2D from "../array2d";
import {
  type Pixel,
  XTERM_COLOR_PALETTE,
  add,
  findClosestColor,
  multiply,
  normalize,
  rgb,
  subtract,
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
 * Note: this function modifies `array`
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
