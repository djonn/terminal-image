import type Array2D from "../array2d";
import { type Pixel, add, multiply } from "../pixel";

export const averageColor = (arr: Array2D<Pixel>): Pixel => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const firstElement = arr.data.at(0)!;
  const sum = arr.data.slice(1).reduce(add, firstElement);
  return multiply(sum, 1 / arr.data.length);
};
