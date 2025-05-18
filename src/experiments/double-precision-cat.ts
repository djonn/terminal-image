/**
 * @file
 *
 * This experiment removes some distortion caused by character dimensions.
 *
 * Characters in the terminal are about twice as tall as they are wide making
 * images show up wierd if we don't correct for it. One way to do that is to
 * use the "Upper Half Block" unicode character. As the name suggests the top
 * half of this character is filled in, while the bottom half is empty. This
 * means we can specify a foreground color for the top half and a background
 * color for the bottom half thereby doubling the vertical precision.
 */

import { loadImage } from "../loading";
import { ditheringFn } from "../mapping/dithering";
import { colorOneByTwo } from "../mapping/one-by-two";
import { print2d } from "../print";

const image = await loadImage("img/170x90-cat.png");
const mapped = image
  // dithering was not part of this when it was initially implemented
  // but it does improve how good it looks.
  // .map(ditheringFn())
  .split(1, 2)
  .map(colorOneByTwo);
print2d(mapped);
