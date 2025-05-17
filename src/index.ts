import { loadImage } from "./loading";
import { braille } from "./mapping/braille";
import { bwOneByTwo, colorOneByTwo } from "./mapping/one-by-two";
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

// -------------------------------

await printFrierenInBraille();
