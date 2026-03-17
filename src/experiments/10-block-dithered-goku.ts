/**
 * @type
 *
 * This experiment implemented a 2x2 block dithering algorithm based on Floyd-Steinberg.
 * and taking inspiration from "3.5 Block error diffusion" http://caca.zoy.org/study/part3.html
 */

import { loadImage } from "../loading";
import { dithering2x2BlockFn } from "../mapping/dithering2x2Block";
import { colorTwoByTwo } from "../mapping/two-by-two";
import { hex } from "../pixel";
import { print2d } from "../print";

const PALETTE = [
  hex("#FDE5AE"),
  hex("#0B0A09"),
  hex("#FDFCFD"),
  hex("#CC300B"),
  hex("#B45A31"),
];
const image = await loadImage("img/340x192-goku.png");

const mapped = image
  // prevent streching
  .split(1, 2)
  // biome-ignore lint/style/noNonNullAssertion: reason
  .map(({ data }) => data[0]!)
  // block dithering
  .split(2, 2)
  .map(dithering2x2BlockFn(PALETTE))
  .map(colorTwoByTwo);

print2d(mapped);
