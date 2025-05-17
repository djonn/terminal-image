import * as PNG from "png-js";
import { splitEvery } from "ramda";

export type Image = {
  width: number;
  height: number;
  pixels: Pixel[];
};

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
        pixels: pixels,
      };

      resolve(image);
    });
  });
};

export const getPixel = (image: Image, x: number, y: number): Pixel => {
  const result = image.pixels[x + y * image.width];

  if (result === undefined)
    throw new RangeError(`Pixel at (${x}, ${y}) does not exist.`);

  return result;
};
