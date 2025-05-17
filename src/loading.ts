import * as PNG from "png-js";
import { splitEvery } from "ramda";
import { type Array2D } from "./array2d";

export type Image = Array2D<Pixel>;

export type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const loadImage = (url: string): Promise<Image> => {
  return new Promise((resolve, reject) => {
    const rawImage = PNG.load(url);
    const { width, height } = rawImage;

    PNG.decode(url, (buffer: number[]) => {
      const pixels = splitEvery(4, buffer).map((foo) => {
        const [r, g, b, a] = foo;

        if (
          r === undefined ||
          g === undefined ||
          b === undefined ||
          a === undefined
        ) {
          reject(new Error("Invalid pixel data"));
          throw new Error("Invalid pixel data");
        }
        const pixel: Pixel = { r, g, b, a };
        return pixel;
      });

      const image: Image = {
        width,
        height,
        data: pixels,
      };

      resolve(image);
    });
  });
};
