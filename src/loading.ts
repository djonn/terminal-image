import SimplexNoise from "perlin-simplex";
import PNG from "png-js";
import { splitEvery } from "ramda";
import Array2D from "./array2d";
import type { Pixel } from "./pixel";

export const loadImage = (url: string): Promise<Array2D<Pixel>> => {
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

      const image = Array2D.new(width, height, pixels);

      resolve(image);
    });
  });
};

export const perlinNoise = (
  width: number,
  height: number,
  scaling = 10,
): Array2D<number> => {
  const noise = new SimplexNoise();
  const data = Array(width * height)
    .fill(undefined)
    .map((_, i) => {
      const [x, y] = Array2D.reverseIndex(i, { width } as Array2D<unknown>);
      return Math.round((noise.noise(x / scaling, y / scaling) + 1) * 128);
    });

  return Array2D.new(width, height, data);
};
