export type Array2D<T> = {
  width: number;
  height: number;
  data: T[];
};

export const emptyArray2D = <T>(
  width: number,
  height: number,
  defaultValue: T,
): Array2D<T> => ({
  width,
  height,
  data: Array(width * height).map(() => defaultValue),
});

export const get = <T>(arr: Array2D<T>, x: number, y: number): T => {
  const result = arr.data[arr.width * y + x];
  if (typeof result === "undefined")
    throw new Error("Array2D does not contain the specified index");
  return result;
};

export const set = <T>(
  arr: Array2D<T>,
  x: number,
  y: number,
  value: T,
): void => {
  if (x > arr.width || y > arr.height) {
    // console.table({ x, width: arr.width, y, height: arr.height });
    throw new Error("Cannot set value for index outside dimensions");
  }
  arr.data[arr.width * y + x] = value;
};

export const subDivide = <T>(
  original: Array2D<T>,
  sW: number,
  sH: number,
): Array2D<Array2D<T>> => {
  // original -> o
  // segment  -> s
  // result   -> r

  const { width: oW, height: oH } = original;

  if (oW % sW !== 0 || oH % sH !== 0) {
    console.warn(
      "The image size is not perfectly divisible by the segment size. Some of the image will be cut",
    );
  }

  const rW = Math.floor(oW / sW);
  const rH = Math.floor(oH / sH);

  const result: Array2D<Array2D<T | undefined> | undefined> = emptyArray2D(
    rW,
    rH,
    undefined,
  );
  for (let i = 0; i < rW * rH; i++) {
    const rX = i % rW;
    const rY = Math.floor(i / rW);

    const oX = rX * sW;
    const oY = rY * sH;

    const segment: Array2D<T | undefined> = emptyArray2D(sW, sH, undefined);
    for (let sX = 0; sX < sW; sX++) {
      for (let sY = 0; sY < sH; sY++) {
        const pixel = get(original, sX + oX, sY + oY);
        set(segment, sX, sY, pixel);
      }
    }
    set(result, rX, rY, segment);
  }

  // trust me bro
  return result as Array2D<Array2D<T>>;
};
