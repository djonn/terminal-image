/**
 * @file
 *
 * This experiment simply added perlin noise in two flavours.
 *
 * The first one creates a grayscale map of perlin noise.
 * The second uses 3 perlin maps, one for each color channel.
 */

import Array2D from "../array2d";
import { perlinNoise } from "../loading";
import { colorOneByTwo } from "../mapping/one-by-two";
import { findClosestColor, rgb } from "../pixel";
import { print2d } from "../print";

const GRAY_PALETTE = [
  rgb(8, 8, 8),
  rgb(18, 18, 18),
  rgb(28, 28, 28),
  rgb(38, 38, 38),
  rgb(48, 48, 48),
  rgb(58, 58, 58),
  rgb(68, 68, 68),
  rgb(78, 78, 78),
  rgb(88, 88, 88),
  rgb(98, 98, 98),
  rgb(108, 108, 108),
  rgb(118, 118, 118),
  rgb(128, 128, 128),
  rgb(138, 138, 138),
  rgb(148, 148, 148),
  rgb(158, 158, 158),
  rgb(168, 168, 168),
  rgb(178, 178, 178),
  rgb(188, 188, 188),
  rgb(198, 198, 198),
  rgb(208, 208, 208),
  rgb(218, 218, 218),
  rgb(228, 228, 228),
  rgb(238, 238, 238),
];

const printPerlinNoise = async () => {
  const mapped = perlinNoise(90, 90)
    .map((noise) => {
      const scaledNoise = Math.round(128 + noise * 128);
      const color = rgb(scaledNoise, scaledNoise, scaledNoise);
      return findClosestColor(color, GRAY_PALETTE);
    })
    .split(1, 2)
    .map(colorOneByTwo);

  print2d(mapped);
};

const printColorMixedPerlinNoise = async () => {
  const mapped = Array2D.zip(
    perlinNoise(90, 90, 5),
    perlinNoise(90, 90, 10),
    perlinNoise(90, 90, 15),
  )
    .map((x) =>
      rgb(
        Math.round(128 + x[0] * 128),
        Math.round(128 + x[1] * 128),
        Math.round(128 + x[2] * 128),
      ),
    )
    .split(1, 2)
    .map(colorOneByTwo);

  print2d(mapped);
};

console.log("Grayscale:");
printPerlinNoise();

console.log("\nColor channels:");
printColorMixedPerlinNoise();
