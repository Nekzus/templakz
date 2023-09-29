import {execSync, spawn} from "node:child_process";
import {mkdir, readFile, readdir, stat, writeFile} from "node:fs/promises";

import path from "node:path";
import color from "picocolors";

export const templates = [
  {title: "Next.js + ESLint + TypeScript + Tailwind", value: "next-eslint-ts-tw"},
  {title: "React.js + ESLint + TypeScript + Tailwind", value: "react-eslint-ts-tw"},
];

export const packageManagers = ["npm", "yarn", "pnpm", "bun"];

export async function copyAndReplaceFiles(source, destination, projectName) {
  const entries = await readdir(source);

  for (const entry of entries) {
    const sourcePath = path.join(source, entry);
    const destPath = path.join(destination, entry);

    const stats = await stat(sourcePath);

    if (stats.isFile()) {
      let data = await readFile(sourcePath, "utf8");

      data = data.replace(/{{name}}/g, projectName);

      await writeFile(destPath, data, "utf8");
    } else if (stats.isDirectory()) {
      await mkdir(destPath, {recursive: true});

      await copyAndReplaceFiles(sourcePath, destPath, projectName);
    }
  }
}

export async function replaceTokensInFiles(files, projectName) {
  for await (const file of files) {
    try {
      const data = await readFile(file, "utf8");
      const draft = data.replace(/{{name}}/g, projectName);

      await writeFile(file, draft, "utf8");
    } catch (error) {
      console.error(`Error replacing tokens in file ${file}: ${error}`);
    }
  }
}

export async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {shell: true, stdio: "inherit"});

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command '${command}' exited with code ${code}`));
      }
    });

    childProcess.on("error", (error) => {
      reject(error);
    });
  });
}

export function printProjectInfo(project, selectedTemplate, selectedPackageManager) {
  console.log(color.yellow("✨ Project created successfully! ✨"));
  console.log("\nYou have selected:");
  console.log(`- Project Name: ${color.cyan(project.name)}`);
  console.log(`- Template: ${color.cyan(selectedTemplate.title)}`);
  console.log(`- Package Manager: ${color.cyan(selectedPackageManager)}`);
  console.log(`- Start Server: ${color.cyan(project.startServer ? "Yes" : "No")}\n`);
  console.log(
    `Have questions? Visit ${color.underline(
      color.cyan("https://github.com/Nekzus/templakz#readme"),
    )}`,
  );
}

export async function releasePorts(port) {
  console.log(color.cyan(`Releasing port: ${port}`));

  try {
    execSync(`lsof -i :${port} | awk 'NR!=1 {print $2}' | xargs kill`, {
      stdio: "ignore",
    });
  } catch (error) {}
}
