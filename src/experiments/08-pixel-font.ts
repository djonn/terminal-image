/**
 * @file
 *
 * This experiment lets you load a image as a font and input any text to print it to the terminal.
 *
 * It was initially implemented as a separate project, but fit nicely with the 2D Array implementtion so was reimplemented to use it.
 */

import Array2D from "../array2d";
import { intersperse } from "../arrayUtils";
import { loadImage } from "../loading";
import { bwTwoByTwo } from "../mapping/two-by-two";
import { BLACK_WHITE_PALETTE } from "../pixel";
import { print2d } from "../print";

const letterWidth = 6;
const letterHeight = 6;
const spacerWidth = 1;
const message = "hello world";

const image = await loadImage("img/gb-font.png");
const font = image.map((pixel) => pixel.r > 128);

const letters: Record<string, Array2D<boolean>> = {};
font.split(letterWidth, letterHeight).map((letter, [ix, iy]) => {
  const letterChar = String.fromCodePoint(65 + ix);
  letters[letterChar] = letter;
});

letters[" "] = Array2D.empty(spacerWidth * 2, letterHeight, true);
letters.SPACER = Array2D.empty(spacerWidth, letterHeight, true);

const getLetter = (char: string): Array2D<boolean> => {
  const letter = letters[char];
  if (!letter) {
    throw new Error(`Letter ${char} not found in font`);
  }
  return letter;
};

const fontImage = (
  message: string,
  getLetterFn: (char: string) => Array2D<boolean>,
): Array2D<boolean> => {
  const messageLetters = intersperse(
    message
      .toUpperCase()
      .split("")
      .map((letter) => getLetterFn(letter)),
    getLetterFn("SPACER"),
  );

  return Array2D.joinHorizontal(...messageLetters);
};

const result = fontImage(message, getLetter);

print2d(
  result
    // biome-ignore lint/style/noNonNullAssertion: reason
    .map((x) => (x ? BLACK_WHITE_PALETTE[0]! : BLACK_WHITE_PALETTE[1]!))
    .split(2, 2)
    .map(bwTwoByTwo),
);
