// This type definition was generated with ChatGPT
declare module "perlin-simplex" {
  export as namespace SimplexNoise;

  declare namespace SimplexNoise {
    /**
     * Minimal interface for a random number generator expected by the constructor.
     * The object must expose a `random()` method that returns a number in [0,1).
     */
    export interface RNG {
      random(): number;
    }

    /**
     * A 3-component gradient vector (used internally).
     */
    export type Grad3 = [number, number, number];

    /**
     * A 2-component gradient vector (used for dot in 2D cases).
     */
    export type Grad2 = [number, number];
  }

  /**
   * SimplexNoise class/constructor.
   */
  declare class SimplexNoise {
    /**
     * Create a new SimplexNoise instance.
     * @param r Optional RNG object; if omitted Math is used (i.e. Math.random()).
     */
    constructor(r?: SimplexNoise.RNG);

    /** Internal 3D gradients (length-12, each a 3-tuple). */
    grad3: SimplexNoise.Grad3[];

    /** Permutation array (length 256). */
    p: number[];

    /** Doubled permutation array (length 512). */
    perm: number[];

    /** Simplex lookup table for 4D traversal (used internally). */
    simplex: number[][];

    /**
     * 2D dot-product with a gradient vector.
     * @param g gradient array (at least 2 elements)
     * @param x x component
     * @param y y component
     */
    dot(g: number[] | SimplexNoise.Grad2, x: number, y: number): number;

    /**
     * 3D dot-product with a gradient vector.
     * @param g gradient array (at least 3 elements)
     * @param x x component
     * @param y y component
     * @param z z component
     */
    dot3(
      g: number[] | SimplexNoise.Grad3,
      x: number,
      y: number,
      z: number,
    ): number;

    /**
     * 2D simplex noise.
     * Returns a number in approximately [-1, 1].
     */
    noise(x: number, y: number): number;

    /**
     * 3D simplex noise.
     * Returns a number in approximately [-1, 1].
     */
    noise3d(x: number, y: number, z: number): number;
  }

  export = SimplexNoise;
}
