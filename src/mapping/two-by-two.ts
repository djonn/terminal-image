import styles from "ansi-styles";
import type Array2D from "../array2d";
import { uniqueBy } from "../arrayUtils";
import { type Pixel, isSameColor } from "../pixel";

export const bwTwoByTwo = (data: Array2D<Pixel>) => {
  const isWhite = ({ r, g, b }: Pixel) => r + g + b / 3 > 128;

  const ul = isWhite(data.data[0]!);
  const ur = isWhite(data.data[1]!);
  const ll = isWhite(data.data[2]!);
  const lr = isWhite(data.data[3]!);

  const char = block(ul, ur, ll, lr);

  // Uses a "Upper Half Block" character
  return `${styles.white.open}${styles.bgBlack.open}${char}${styles.reset.close}`;
};

export const colorTwoByTwo = (data: Array2D<Pixel>) => {
  const colors = uniqueBy(
    data.data,
    (pixel) => `${pixel.r},${pixel.g},${pixel.b}`,
  );

  if (colors.length > 2) {
    throw new Error(
      `Expected at most 2 colors in a 2x2 block, but got ${colors.length}`,
    );
  }

  if (colors.length === 1) {
    // Both colors are the same, so just print a full block with that color
    const fg = styles.color.ansi256(
      styles.rgbToAnsi256(colors[0]!.r, colors[0]!.g, colors[0]!.b),
    );
    return `${fg}█${styles.reset.close}`;
  }

  // there are 2 colors

  const ul = isSameColor(data.data[0]!, colors[0]!);
  const ur = isSameColor(data.data[1]!, colors[0]!);
  const ll = isSameColor(data.data[2]!, colors[0]!);
  const lr = isSameColor(data.data[3]!, colors[0]!);

  const char = block(ul, ur, ll, lr);

  const fg = styles.color.ansi256(
    styles.rgbToAnsi256(colors[0]!.r, colors[0]!.g, colors[0]!.b),
  );

  const bg = styles.bgColor.ansi256(
    styles.rgbToAnsi256(colors[1]!.r, colors[1]!.g, colors[1]!.b),
  );

  return `${fg}${bg}${char}${styles.reset.close}`;
};

const block = (ul: boolean, ur: boolean, ll: boolean, lr: boolean) => {
  // NOTICE: different order than in the inputs
  const inputs = [ul, ur, lr, ll].map((a) => (a ? "1" : "0")).join("");

  //https://www.compart.com/en/unicode/block/U+2580
  // prettier-ignore
  switch (inputs) {
    // 0 blocks
    case "0000":
      return " ";

    // 1 block
    case "1000":
      return "▘";
    case "0100":
      return "▝";
    case "0010":
      return "▗";
    case "0001":
      return "▖";

    // 2 blocks
    case "1100":
      return "▀";
    case "0011":
      return "▄";
    case "1001":
      return "▌";
    case "0110":
      return "▐";
    case "1010":
      return "▚";
    case "0101":
      return "▞";

    // 3 blocks
    case "0111":
      return "▟";
    case "1011":
      return "▙";
    case "1101":
      return "▛";
    case "1110":
      return "▜";

    // 4 blocks
    case "1111":
      return "█";

    default:
      throw new Error(`Invalid block configuration: ${JSON.stringify(inputs)}`);
  }
};
