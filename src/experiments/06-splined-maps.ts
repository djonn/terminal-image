/**
 * @file
 *
 * This experiment introduces 2D splines to map numbers
 */
import { createInterpolator } from "commons-math-interpolation";
import { perlinNoise } from "../loading";
import { findClosestColor, rgb } from "../pixel";
import { colorOneByTwo } from "../mapping/one-by-two";
import { print2d } from "../print";

const GRAY_PALETTE = [
  rgb(8, 8, 8),
  rgb(18, 18, 18),
  rgb(28, 28, 28),
  rgb(38, 38, 38),
  rgb(48, 48, 48),
  rgb(58, 58, 58),
  rgb(68, 68, 68),
  rgb(78, 78, 78),
  rgb(88, 88, 88),
  rgb(98, 98, 98),
  rgb(108, 108, 108),
  rgb(118, 118, 118),
  rgb(128, 128, 128),
  rgb(138, 138, 138),
  rgb(148, 148, 148),
  rgb(158, 158, 158),
  rgb(168, 168, 168),
  rgb(178, 178, 178),
  rgb(188, 188, 188),
  rgb(198, 198, 198),
  rgb(208, 208, 208),
  rgb(218, 218, 218),
  rgb(228, 228, 228),
  rgb(238, 238, 238),
];

const splineFn = (
  xVals: number[],
  yVals: number[],
): ((x: number) => number) => {
  // Akima seems to be good at handling points close to each other
  return createInterpolator("akima", xVals, yVals);
};

const printWithMinecraftSpline = () => {
  // continentalness
  // values read off of Knibergs video and scaled to be between -1 and 1
  const xVals = [
    0, 0.243531202435312, 0.2754946727549467, 0.4094368340943683,
    0.4216133942161339, 0.624048706240487, 1,
  ].map((x) => x * 2 - 1);

  // terrain height
  // values read off of Knibergs video and scaled to be between -0 and 255
  const yVals = [
    0, 0, 0.02968036529680365, 0.02968036529680365, 0.10273972602739725,
    0.58675799086758, 1,
  ].map((y) => y * 255);

  const minecraftSpline = splineFn(xVals, yVals);

  const image = perlinNoise(90, 90, 35)
    .map(minecraftSpline)
    .map((noise) => {
      const color = rgb(noise, noise, noise);
      return findClosestColor(color, GRAY_PALETTE);
    })
    .split(1, 2)
    .map(colorOneByTwo);

  print2d(image);
};

const printWithMiddleSpline = () => {
  const normalizePoints = (points: [number, number][]): [number, number][] => {
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

  // Create spline using https://www.source-code.biz/snippets/typescript/functionCurveEditor/
  // press "k" to copy the points
  const mySplinePoints = normalizePoints([
    [0.179021, 0],
    [2.79532, 1.1205],
    [4.66915, 1.13747],
    [7.53293, 2.7327],
    [9.68961, 2.81755],
  ]);
  const mySpline = splineFn(
    mySplinePoints.map(([x, _]) => x),
    mySplinePoints.map(([y, _]) => y).map((y) => y * 200 + 55),
  );

  const image = perlinNoise(90, 90, 35)
    .map(mySpline)
    .map((noise) => {
      const color = rgb(noise, noise, noise);
      return findClosestColor(color, GRAY_PALETTE);
    })
    .split(1, 2)
    .map(colorOneByTwo);

  print2d(image);
};

printWithMinecraftSpline();
printWithMiddleSpline();
