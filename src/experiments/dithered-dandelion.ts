/**
 * @type
 *
 * This experiment implemented the Floyd-Steinberg error correction
 * or dithering algorithm. This makes the image look more like pixelart
 * and less like just 2 or 3 splodges of a color.
 */

import { loadImage } from "../loading";
import { ditheringFn } from "../mapping/dithering";
import { colorOneByTwo } from "../mapping/one-by-two";
import { print2d } from "../print";

const image = await loadImage("img/90x90-dandelion.png");
const mapped = image.copy().map(ditheringFn()).split(1, 2).map(colorOneByTwo);
print2d(mapped);
