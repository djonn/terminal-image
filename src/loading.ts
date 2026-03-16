import PNG from "png-js";
import Array2D from "./array2d";
import { chunk } from "./arrayUtils";
import type { Pixel } from "./pixel";

export const loadImage = (url: string): Promise<Array2D<Pixel>> => {
  return new Promise((resolve, reject) => {
    const rawImage = PNG.load(url);
    const { width, height } = rawImage;

    rawImage.decode((buffer: Buffer<ArrayBufferLike>) => {
      const bufferValues = [...buffer];
      const pixels = chunk(bufferValues, 4).map((pixelValue) => {
        const [r, g, b, a] = pixelValue;

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
