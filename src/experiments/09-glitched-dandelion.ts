/**
 * @type
 *
 * This experiment implemented expands on joining 2d arrays introduced in pixel font experiment,
 * and uses it to split, transform and the rejoin an image, creating a glitched version of the original.
 */

import Array2D from "../array2d";
import { loadImage } from "../loading";
import { ditheringFn } from "../mapping/dithering";
import { colorOneByTwo } from "../mapping/one-by-two";
import { print2d } from "../print";

const image = await loadImage("img/90x90-dandelion.png");
const preGlitch = image.split(image.width / 2, image.height / 2);
const postGlitch = Array2D.join(
  Array2D.new(
    preGlitch.width,
    preGlitch.height,
    preGlitch.data.slice().reverse(),
  ),
);

const mapped = postGlitch.map(ditheringFn()).split(1, 2).map(colorOneByTwo);
print2d(mapped);
