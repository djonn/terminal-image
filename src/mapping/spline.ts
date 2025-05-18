import { createInterpolator } from "commons-math-interpolation";

export const splineFn = (
  xVals: number[],
  yVals: number[],
): ((x: number) => number) => {
  // Akima seems to be good at handling points close to each other
  return createInterpolator("akima", xVals, yVals);
};

export const normalizePoints = (
  points: [number, number][],
): [number, number][] => {
  const xVals = points.map(([x, _]) => x);
  const xMax = Math.max(...xVals);
  const xMin = Math.min(...xVals);
  const xRange = xMax - xMin;

  const yVals = points.map(([y, _]) => y);
  const yMax = Math.max(...yVals);
  const yMin = Math.min(...yVals);
  const yRange = yMax - yMin;

  return points.map(([x, y]) => [(x - xMin) / xRange, (y - yMin) / yRange]);
};
