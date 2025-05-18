import SimplexNoise from "perlin-simplex";
import { range } from "ramda";
import { alea } from "seedrandom";
import Array2D from "./array2d";

const perlinNoiseLayer = (
  width: number,
  height: number,
  frequency: number,
  seed: string,
): Array2D<number> => {
  const rng = alea(seed) as () => number;

  const noise = new SimplexNoise({ random: rng });
  const data = Array(width * height)
    .fill(undefined)
    .map((_, i) => {
      const [x, y] = Array2D.reverseIndex(i, { width } as Array2D<unknown>);
      return noise.noise((x * frequency) / 1000, (y * frequency) / 1000);
    });

  return Array2D.new(width, height, data);
};

/**
 * Creates 2d array with values between -1 and 1
 */
export const perlinNoise = (
  width: number,
  height: number,
  config: {
    initialFrequency?: number;
    octaves?: number;
    seed?: number;
  } = {},
): Array2D<number> => {
  const { initialFrequency = 25, octaves = 1, seed = 1234 } = config;

  const noiseLayers = range(0, octaves).map((i) =>
    perlinNoiseLayer(width, height, initialFrequency * 2 ** i, `${seed}_${i}`),
  );

  return Array2D.zip(...noiseLayers).map(weightedAverage);
};

const weightedAverage = (values: number[]): number => {
  const weightFn = (i: number) => 1 / 2 ** i;

  const weightTotal = values
    .map((_, i) => weightFn(i))
    .reduce((acc, cur) => acc + cur, 0);

  const weightSum = values
    .map((value, i) => value * weightFn(i))
    .reduce((acc, cur) => acc + cur, 0);

  return weightSum / weightTotal;
};
