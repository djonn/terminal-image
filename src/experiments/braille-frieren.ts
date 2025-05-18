/**
 * @file
 *
 * This experiment implemented the braille mapper that takes 2x4 pixels
 * and maps them to braille unicode for much higher precision.
 */

import { loadImage } from "../loading";
import { braille } from "../mapping/braille";
import { print2d } from "../print";

const image = await loadImage("img/192x192-frieren.png");
const mapped = image.split(2, 4).map(braille);
print2d(mapped);
