import Array2D from "./array2d";
import { loadImage, perlinNoise } from "./loading";
import { braille } from "./mapping/braille";
import { ditheringFn } from "./mapping/dithering";
import { bwOneByTwo, colorOneByTwo } from "./mapping/one-by-two";
import { findClosestColor, rgb } from "./pixel";
import { print2d } from "./print";

// -----------------------------

const printDoublePrecisionBWCircle = async () => {
  const image = await loadImage("img/20x20-black-circle.png");
  const mapped = image.split(1, 2).map(bwOneByTwo);
  print2d(mapped);
};

const printDoublePrecisionColorCat = async () => {
  const image = await loadImage("img/170x90-cat.png");
  const mapped = image.split(1, 2).map(colorOneByTwo);
  print2d(mapped);
};

const printFrierenInBraille = async () => {
  const image = await loadImage("img/192x192-frieren.png");
  const mapped = image.split(2, 4).map(braille);
  print2d(mapped);
};

const printDitheredCat = async () => {
  const image = await loadImage("img/90x90-dandelion.png");
  const mapped = image.copy().map(ditheringFn()).split(1, 2).map(colorOneByTwo);
  print2d(mapped);
};

const printPerlinNoise = async () => {
  const mapped = perlinNoise(90, 90)
    .map((noise) => {
      const color = rgb(noise, noise, noise);
      return findClosestColor(color, [
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
      ]);
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
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    .map((x) => rgb(x[0]!, x[1]!, x[2]!))
    .split(1, 2)
    .map(colorOneByTwo);

  print2d(mapped);
};

// -------------------------------

await printColorMixedPerlinNoise();
