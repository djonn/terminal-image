/**
 * @file
 *
 * Similar to double precision but uses a 2x2 block character to get even higher precision.
 * The resulting image will likely seem streched as the character is about twice as tall as it is wide.
 * To prevent this we first split the image into 1x2 blocks and average the colors.
 */

import { loadImage } from "../loading";
import { averageColor } from "../mapping/average-color";
import { bwTwoByTwo } from "../mapping/two-by-two";
import { print2d } from "../print";

const image = await loadImage("img/192x192-frieren.png");
const mapped = image.split(1, 2).map(averageColor).split(2, 2).map(bwTwoByTwo);
print2d(mapped);
