/**
 * @file
 *
 * This experiment takes the input image and maps in two different ways,
 * one using braille characters and one using color and then merges them
 * together again.
 */

import { wrap } from "../ansi-styling";
import Array2D from "../array2d";
import { loadImage } from "../loading";
import { averageColor } from "../mapping/average-color";
import { braille } from "../mapping/braille";
import { ditheringFn } from "../mapping/dithering";
import { BLACK_WHITE_PALETTE, type Pixel, XTERM_COLOR_PALETTE } from "../pixel";
import { print2d } from "../print";

const thresholdFn = (threshold: number, palette: [Pixel, Pixel]) => {
  return ({ r, g, b }: Pixel) => {
    const isFirstPixel = (r + g + b) / 3 < threshold;
    return isFirstPixel ? palette[0] : palette[1];
  };
};

const source = await loadImage("img/340x192-goku.png");

const characters = source
  .map(thresholdFn(128, BLACK_WHITE_PALETTE.reverse() as [Pixel, Pixel]))
  .split(2, 4)
  .map(braille);

const colors = source
  .split(2, 4)
  .map(averageColor)
  .map(ditheringFn(XTERM_COLOR_PALETTE));

const combined = Array2D.zip(characters, colors).map(([char, color]) =>
  wrap(char, color),
);

print2d(combined);
