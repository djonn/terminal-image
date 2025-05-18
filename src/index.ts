import { readdir } from "node:fs/promises";
import path from "node:path";
import { wrap } from "./ansi-styling";
import { rgb } from "./pixel";

const headerColor = rgb(175, 0, 215);
console.log(wrap("This is not the file you want!", headerColor));

const experiments = await readdir(path.join(import.meta.dir, "experiments"));

console.log("");
console.log("Instead try one of the experiments in ./src/experiments/");

console.log("");
const commandColor = rgb(0, 95, 215);
for (const filename of experiments) {
  const command = `bun run ./src/experiments/${filename}`;
  console.log(` - ${wrap(command, commandColor)}`);
}
console.log("");
