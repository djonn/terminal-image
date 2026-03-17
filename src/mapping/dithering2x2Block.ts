import Array2D from "../array2d";
import { zip } from "../arrayUtils";
import {
  type Pixel,
  add,
  findClosestColor,
  magnitude,
  multiply,
  normalize,
  rgb,
  subtract,
} from "../pixel";

/**
 * Returns a dithering functions meant for mapping a 2d array of 2x2 pixel blocks
 * Allows specifying a color palette, defaults to 256 color from XTERM
 *
 * @see {_dithering}
 */
export const dithering2x2BlockFn = (palette: Pixel[]) => {
  const paletteCombinations = allPaletteCombinations(palette);
  return (
    oldPixel: Array2D<Pixel>,
    index: [number, number],
    array: Array2D<Array2D<Pixel>>,
  ) => _dithering2x2Block(paletteCombinations, oldPixel, index, array);
};

/**
 * Dithered using the Floyd-Steinberg algorithm
 *
 * Inspired by "3.5. Block error diffusion" and
 * "3.6. Sub-block error diffusion"
 * http://caca.zoy.org/study/part3.html
 */
const _dithering2x2Block = (
  palette: [Pixel, Pixel][],
  oldBlock: Array2D<Pixel>,
  [x, y]: [number, number],
  array: Array2D<Array2D<Pixel>>,
): Array2D<Pixel> => {
  // find best match for 2 colors
  let newBlock: Array2D<Pixel> = oldBlock;
  let smallestError = [rgb(0, 0, 0), rgb(0, 0, 0), rgb(0, 0, 0), rgb(0, 0, 0)];
  let smallestErrorDistance = Number.POSITIVE_INFINITY;

  for (const combination of palette) {
    const newData = oldBlock.data.map((pixel) =>
      findClosestColor(pixel, combination),
    );
    const error = (zip(oldBlock.data, newData) as [Pixel, Pixel][]).map(
      ([oldPixel, newPixel]) => subtract(oldPixel, newPixel),
    );

    const errorDistance = error
      .map((errorPixel) => magnitude(errorPixel))
      .reduce((a, b) => a + b, 0);

    if (errorDistance < smallestErrorDistance) {
      smallestErrorDistance = errorDistance;
      smallestError = error;
      newBlock = Array2D.new(oldBlock.width, oldBlock.height, newData);
    }
  }

  distributeError(
    array,
    x + 1,
    y,
    smallestError[0]!,
    Array2D.new(2, 2, [1 / 8, 0, 5 / 32, 0]),
  );
  distributeError(
    array,
    x - 1,
    y + 1,
    smallestError[0]!,
    Array2D.new(2, 2, [0, 7 / 64, 0, 0]),
  );
  distributeError(
    array,
    x,
    y + 1,
    smallestError[0]!,
    Array2D.new(2, 2, [1 / 2, 13 / 64, 0, 0]),
  );
  distributeError(
    array,
    x + 1,
    y + 1,
    smallestError[0]!,
    Array2D.new(2, 2, [1 / 64, 0, 0, 0]),
  );

  distributeError(
    array,
    x + 1,
    y,
    smallestError[1]!,
    Array2D.new(2, 2, [5 / 16, 0, 7 / 32, 0]),
  );
  distributeError(
    array,
    x - 1,
    y + 1,
    smallestError[1]!,
    Array2D.new(2, 2, [0, 1 / 32, 0, 0]),
  );
  distributeError(
    array,
    x,
    y + 1,
    smallestError[1]!,
    Array2D.new(2, 2, [11 / 64, 15 / 64, 0, 0]),
  );
  distributeError(
    array,
    x + 1,
    y + 1,
    smallestError[1]!,
    Array2D.new(2, 2, [1 / 32, 0, 0, 0]),
  );

  distributeError(
    array,
    x + 1,
    y,
    smallestError[2]!,
    Array2D.new(2, 2, [0, 0, 3 / 32, 0]),
  );
  distributeError(
    array,
    x - 1,
    y + 1,
    smallestError[2]!,
    Array2D.new(2, 2, [0, 3 / 16, 0, 0]),
  );
  distributeError(
    array,
    x,
    y + 1,
    smallestError[2]!,
    Array2D.new(2, 2, [1 / 2, 13 / 64, 0, 0]),
  );
  distributeError(
    array,
    x + 1,
    y + 1,
    smallestError[2]!,
    Array2D.new(2, 2, [1 / 64, 0, 0, 0]),
  );

  distributeError(
    array,
    x + 1,
    y,
    smallestError[3]!,
    Array2D.new(2, 2, [0, 0, 5 / 16, 0]),
  );
  // no x-1, y+1
  distributeError(
    array,
    x,
    y + 1,
    smallestError[3]!,
    Array2D.new(2, 2, [3 / 16, 7 / 16, 0, 0]),
  );
  distributeError(
    array,
    x + 1,
    y + 1,
    smallestError[3]!,
    Array2D.new(2, 2, [1 / 16, 0, 0, 0]),
  );

  return newBlock;
};

const distributeError = (
  array: Array2D<Array2D<Pixel>>,
  x: number,
  y: number,
  error: Pixel,
  factor: Array2D<number>,
) => {
  try {
    const factoredError = factor.map((value) => multiply(error, value));
    const before = array.get(x, y);
    const after = Array2D.zip(before, factoredError).map(
      ([beforePixel, errorPixel]) => normalize(add(beforePixel, errorPixel)),
    );
    array.set(x, y, after);
  } catch (error) {
    // ignore out of bound errors
  }
};

const allPaletteCombinations = (palette: Pixel[]): [Pixel, Pixel][] => {
  return palette.flatMap((color1) =>
    palette.map((color2) => [color1, color2] as [Pixel, Pixel]),
  );
};
