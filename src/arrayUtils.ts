export const chunk = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// https://stackoverflow.com/a/22015930
export const zip = <T>(...arr: T[][]): T[][] => {
  const first = arr[0];
  if (!first) {
    return [];
  }

  if (!arr.every((a) => a.length === first.length)) {
    throw new Error("All arrays must have the same length");
  }

  return (
    Array(first.length)
      .fill(undefined)
      // biome-ignore lint/style/noNonNullAssertion: All arrays have been checked to have same length
      .map((_, i) => arr.map((a) => a[i]!))
  );
};

// https://stackoverflow.com/a/37129103
export const intersperse = <T>(arr: T[], sep: T) =>
  arr.reduce((a, v) => a.concat([v, sep]), [] as T[]).slice(0, -1);

export const range = (start: number, end: number): number[] =>
  Array(end - start)
    .fill(undefined)
    .map((_, i) => start + i);

export const uniqueBy = <T>(arr: T[], fn: (item: T) => string): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of arr) {
    const key = fn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};
