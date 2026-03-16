import styles from "ansi-styles";
import type Array2D from "../array2d";
import type { Pixel } from "../pixel";

export const bwTwoByTwo = (data: Array2D<Pixel>) => {
  const isWhite = ({ r, g, b }: Pixel) => r + g + b / 3 > 128;

  // biome-ignore lint/style/noNonNullAssertion: reason
  const ul = isWhite(data.data[0]!);
  // biome-ignore lint/style/noNonNullAssertion: reason
  const ur = isWhite(data.data[1]!);
  // biome-ignore lint/style/noNonNullAssertion: reason
  const ll = isWhite(data.data[2]!);
  // biome-ignore lint/style/noNonNullAssertion: reason
  const lr = isWhite(data.data[3]!);

  const char = block(ul, ur, ll, lr);

  // Uses a "Upper Half Block" character
  return `${styles.white.open}${styles.bgBlack.open}${char}${styles.reset.close}`;
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
