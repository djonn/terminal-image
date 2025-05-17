import styles from "ansi-styles";
import type Array2D from "../array2d";
import type { Pixel } from "../pixel";

export const bwOneByTwo = (data: Array2D<Pixel>) => {
  const isWhite = ({ r, g, b }: Pixel) => r + g + b / 3 > 128;

  // biome-ignore lint/style/noNonNullAssertion: reason
  const fg = isWhite(data.data[0]!) ? styles.white.open : styles.black.open;
  // biome-ignore lint/style/noNonNullAssertion: reason
  const bg = isWhite(data.data[1]!) ? styles.bgWhite.open : styles.bgBlack.open;

  // Uses a "Upper Half Block" character
  return `${fg}${bg}▀${styles.reset.close}`;
};

export const colorOneByTwo = (data: Array2D<Pixel>) => {
  const fg = styles.color.ansi256(
    // biome-ignore lint/style/noNonNullAssertion: reason
    styles.rgbToAnsi256(data.data[0]!.r, data.data[0]!.g, data.data[0]!.b),
  );
  const bg = styles.bgColor.ansi256(
    // biome-ignore lint/style/noNonNullAssertion: reason
    styles.rgbToAnsi256(data.data[1]!.r, data.data[1]!.g, data.data[1]!.b),
  );

  // Uses a "Upper Half Block" character
  return `${fg}${bg}▀${styles.reset.close}`;
};
