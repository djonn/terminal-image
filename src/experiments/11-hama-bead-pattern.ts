/**
 * @type
 *
 * Here we map an image to a Hama beads pattern.
 *
 */

import { loadImage } from "../loading";
import {  findClosestColor, hex, toHexString } from "../pixel";
import { print2d } from "../print";
import hama from "../../img/hama-bead-color-chart.json";
import { colorOneByTwo } from "../mapping/one-by-two";
import { ditheringFn } from "../mapping/dithering";

// https://www.pixel-beads.com/hama-bead-color-chart
type HamaColor = keyof typeof hama;
const myHama = hama as Record<HamaColor, `#${string}`>;

const PALETTE_NAMES: HamaColor[] = [
  "H22",
  "H96",
  "H01",
  "H18",
  "H71",
  "H77",
  "H60",
  "H75",
  "H10",
  "H83",
]

const PALETTE = PALETTE_NAMES.map(name => hex(myHama[name]));
const image = await loadImage("img/28x18-eye.png");

const pattern = image
  .map(ditheringFn(PALETTE))
  .map((color) => findClosestColor(color, PALETTE))


const mapped = pattern.split(1, 2).map(colorOneByTwo);
print2d(mapped);
