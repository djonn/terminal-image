import { readdir } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
import { wrap } from "./ansi-styling";
import { rgb } from "./pixel";

const listExperiments = async () => {
  const entries = await readdir(path.join(import.meta.dir, "experiments"), {
    withFileTypes: true,
  });

  return entries
    .filter((dirent) => dirent.isFile()) // Exclude directories
    .map((dirent) => dirent.name)
    .toSorted((a, b) => a.localeCompare(b));
};

const printExperimentList = async () => {
  const headerColor = rgb(175, 0, 215);
  console.log(wrap("This is not the file you want!", headerColor));

  const experiments = await listExperiments();

  console.log("");
  console.log("Instead try one of the experiments in ./src/experiments/");

  console.log("");
  const commandColor = rgb(0, 95, 215);
  for (const filename of experiments) {
    const command = `bun run ./src/experiments/${filename}`;
    console.log(` - ${wrap(command, commandColor)}`);
  }
  console.log("");
  console.log("Or run all experiments by adding the --run-all flag");
  console.log("");
};

const runAllExperiments = async () => {
  const experiments = await listExperiments();
  const headerColor = rgb(175, 0, 215);
  for (const filename of experiments) {
    console.log(wrap(filename, headerColor));
    console.log("");

    await $`bun run ./src/experiments/${filename}`;

    console.log("");
    console.log("===========================");
    console.log("");
  }
};

if (process.argv.includes("--run-all")) {
  await runAllExperiments();
  process.exit();
}

await printExperimentList();
