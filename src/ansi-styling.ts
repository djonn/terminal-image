import styles from "ansi-styles";
import type { Pixel } from "./pixel";

export const wrap = (text: string, color: Pixel): string => {
  const fg = styles.color.ansi256(
    styles.rgbToAnsi256(color.r, color.g, color.b),
  );
  return `${fg}${text}${styles.reset.close}`;
};
