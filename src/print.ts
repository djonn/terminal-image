import type Array2D from "./array2d";
import { chunk } from "./arrayUtils";

export const print2d = <T>(arr: Array2D<T>) => {
  const height = arr.data.length / arr.width;

  const terminalWidth = process.stdout.columns;
  const terminalHeight = process.stdout.rows;

  if (arr.width > terminalWidth || height > terminalHeight) {
    console.warn(
      "Dimensions being printed are greater than available terminal",
    );
  }

  const line = arr.data;
  const chart = chunk(line, arr.width);
  const text = chart.map((x) => x.join("")).join("\n");
  console.log(text);
};
