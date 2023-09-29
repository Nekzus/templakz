import {
  copyAndReplaceFiles,
  packageManagers,
  printProjectInfo,
  releasePorts,
  replaceTokensInFiles,
  runCommand,
  templates,
} from "./helpers/utils.mjs";

import {glob} from "glob";
import {mkdir} from "node:fs/promises";
import path from "node:path";
import {project} from "./helpers/prompts.mjs";

export async function main() {
  try {
    const selectedTemplate = templates[project.templateIndex];
    const destination = path.join(process.cwd(), project.name);
    const selectedPackageManager = packageManagers[project.packageIndex];
    const PORT = selectedTemplate.value === "next-eslint-ts-tw" ? 3000 : 5173;

    const rootDirectory = process.cwd();
    const templateDirectory = path.join(rootDirectory, "templates", selectedTemplate.value);
    const destinationDirectory = path.join(rootDirectory, project.name);

    const files = await glob(`**/*`, {nodir: true, cwd: destination, absolute: true});

    await mkdir(destinationDirectory, {recursive: true});
    await copyAndReplaceFiles(templateDirectory, destinationDirectory, project.name);
    await replaceTokensInFiles(files, project.name);
    project.startServer && printProjectInfo(project, selectedTemplate, selectedPackageManager);

    process.chdir(destinationDirectory);
    await releasePorts(PORT);
    const installCmd = `${selectedPackageManager} install`;
    await runCommand(installCmd);

    if (project.startServer) {
      const startDevServerCmd = `${selectedPackageManager} run dev`;
      const openBrowserCmd = `xdg-open http://localhost:${PORT}`;
      await Promise.all([runCommand(startDevServerCmd), runCommand(openBrowserCmd)], {
        onCancel: () => {
          console.log(color.bgRed("Operation canceled"));
          process.exit(0);
        },
      });
    } else {
      printProjectInfo(project, selectedTemplate, selectedPackageManager);
    }
  } catch (error) {
    console.error(error);
  }
}
