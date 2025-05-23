export default class Array2D<T> {
  width: number;
  height: number;
  data: T[];

  private constructor(width: number, height: number, data: T[]) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  static new<T>(width: number, height: number, data: T[]): Array2D<T> {
    return new Array2D<T>(width, height, data);
  }

  static empty<T>(width: number, height: number, defaultValue: T): Array2D<T> {
    return new Array2D(width, height, Array(width * height).fill(defaultValue));
  }

  static index<T>(x: number, y: number, arr: Array2D<T>): number {
    return arr.width * y + x;
  }

  static reverseIndex<T>(i: number, arr: Array2D<T>): [number, number] {
    return [i % arr.width, Math.floor(i / arr.width)];
  }

  // Additional type declarations means each input array does not need to have same type
  static zip<T1, T2>(...args: [Array2D<T1>, Array2D<T2>]): Array2D<[T1, T2]>;
  static zip<T1, T2, T3>(
    ...args: [Array2D<T1>, Array2D<T2>, Array2D<T3>]
  ): Array2D<[T1, T2, T3]>;
  static zip<T1, T2, T3, T4>(
    ...args: [Array2D<T1>, Array2D<T2>, Array2D<T3>, Array2D<T4>]
  ): Array2D<[T1, T2, T3, T4]>;
  static zip<T>(...args: Array2D<T>[]): Array2D<T[]>;

  static zip<T>(...args: Array2D<T>[]): Array2D<T[]> {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const { width, height } = args[0]!;
    if (!args.every((x) => x.width === width && x.height === height)) {
      throw new Error("Dimensions of all arguments must match");
    }

    const data = Array(width * height)
      .fill(undefined)
      .map((_, i) => {
        const [x, y] = Array2D.reverseIndex(i, { width } as Array2D<unknown>);
        return args.map((arr) => arr.get(x, y));
      });

    return Array2D.new(width, height, data);
  }

  /**
   * Returns 1D array index for a 2D array
   */
  index(x: number, y: number): number {
    return Array2D.index(x, y, this);
  }

  /**
   * Returns [x, y] when given 1D array index
   */
  reverseIndex(i: number): [number, number] {
    return Array2D.reverseIndex(i, this);
  }

  get(x: number, y: number): T {
    if (x >= this.width || y >= this.height) {
      throw new Error("Array2D does not contain the specified index");
    }
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const result = this.data[this.index(x, y)]!;
    return result;
  }

  set(x: number, y: number, value: T): void {
    if (x > this.width || y > this.height) {
      throw new Error("Cannot set value for index outside dimensions");
    }
    this.data[this.index(x, y)] = value;
  }

  /**
   * Returns shallow copy of the input array
   */
  copy(): Array2D<T> {
    return Array2D.new<T>(this.width, this.height, [...this.data]);
  }

  /**
   * Maps all cells using callback function and returns a new Array2D with the
   * same dimensions as the original
   */
  map<TOut>(
    callbackfn: (value: T, index: [number, number], array: Array2D<T>) => TOut,
  ): Array2D<TOut> {
    const newData = this.data.map((value, index1D) => {
      const index2D = this.reverseIndex(index1D);
      return callbackfn(value, index2D, this);
    });
    return Array2D.new<TOut>(this.width, this.height, newData);
  }

  split(sW: number, sH: number): Array2D<Array2D<T>> {
    // original -> o
    // segment  -> s
    // result   -> r

    const { width: oW, height: oH } = this;

    if (oW % sW !== 0 || oH % sH !== 0) {
      console.warn(
        "The image size is not perfectly divisible by the segment size. Some of the image will be cut",
      );
    }

    const rW = Math.floor(oW / sW);
    const rH = Math.floor(oH / sH);

    const result: Array2D<Array2D<T | undefined> | undefined> = Array2D.empty(
      rW,
      rH,
      undefined,
    );
    for (let i = 0; i < rW * rH; i++) {
      const rX = i % rW;
      const rY = Math.floor(i / rW);

      const oX = rX * sW;
      const oY = rY * sH;

      const segment: Array2D<T | undefined> = Array2D.empty(sW, sH, undefined);
      for (let sX = 0; sX < sW; sX++) {
        for (let sY = 0; sY < sH; sY++) {
          const pixel = this.get(sX + oX, sY + oY);
          segment.set(sX, sY, pixel);
        }
      }
      result.set(rX, rY, segment);
    }

    // trust me bro
    return result as Array2D<Array2D<T>>;
  }
}
