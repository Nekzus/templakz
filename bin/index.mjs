#!/usr/bin/env node

import {execSync, spawn} from "node:child_process";
import {mkdir, readFile, readdir, stat, writeFile} from "node:fs/promises";

import {glob} from "glob";
import path from "node:path";
import color from "picocolors";
import prompts from "prompts";

async function main() {
  try {
    const templates = [
      {title: "Next.js + ESLint + TypeScript + Tailwind", value: "next-eslint-ts-tw"},
      {title: "React.js + ESLint + TypeScript + Tailwind", value: "react-eslint-ts-tw"},
    ];

    const packageManagers = ["npm", "yarn", "pnpm", "bun"];

    const project = await prompts([
      {
        type: "text",
        name: "name",
        message: "What is the name of your project?",
        initial: "my-project",
        validate: (value) => {
          if (value.match(/[^a-zA-Z0-9-_]+/g))
            return "Project name can only contain letters, numbers, dashes, and underscores";

          return true;
        },
      },
      {
        type: "select",
        name: "templateIndex",
        message: `Which template would you like to use?`,
        initial: 0,
        choices: templates.map((template, index) => ({
          title: template.title,
          value: index,
        })),
      },
      {
        type: "select",
        name: "packageIndex",
        message: "Select a package manager",
        choices: packageManagers.map((packageManager, index) => ({
          title: packageManager,
          value: index,
        })),
      },
    ]);

    async function copyAndReplaceFiles(source, destination, projectName) {
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
          // Crear directorio en el destino
          await mkdir(destPath, {recursive: true});

          await copyAndReplaceFiles(sourcePath, destPath, projectName);
        }
      }
    }

    async function replaceTokensInFiles(files, projectName) {
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

    async function runCommand(command) {
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

    async function releasePorts(ports) {
      ports.forEach((port) => {
        try {
          execSync(`lsof -i :${port} | awk 'NR!=1 {print $2}' | xargs kill`, {
            stdio: "ignore",
          });
        } catch (error) {}
      });
      console.log(`Ports released.`);
    }

    const selectedTemplate = templates[project.templateIndex];
    const destination = path.join(process.cwd(), project.name);
    const selectedPackageManager = packageManagers[project.packageIndex];

    const rootDirectory = process.cwd();
    const templateDirectory = path.join(rootDirectory, "templates", selectedTemplate.value);
    const destinationDirectory = path.join(rootDirectory, project.name);

    const files = await glob(`**/*`, {nodir: true, cwd: destination, absolute: true});

    await mkdir(destinationDirectory, {recursive: true});
    await copyAndReplaceFiles(templateDirectory, destinationDirectory, project.name);
    await replaceTokensInFiles(files, project.name);

    console.log("✨ Project created successfully! ✨");

    console.log("\nYou have selected:");
    console.log(`- Project Name: ${project.name}`);
    console.log(`- Template: ${selectedTemplate.title}`);
    console.log(`- Package Manager: ${selectedPackageManager}\n`);

    console.log(`Have questions? Visit ${color.underline(color.cyan("https://example.com/help"))}`);

    process.chdir(destinationDirectory);

    const installCmd = `${selectedPackageManager} install`;
    await runCommand(installCmd);

    const startDevServerCmd = `${selectedPackageManager} run dev`;
    const openBrowserCmd = "xdg-open http://localhost:3000";
    await releasePorts(["3000", "4200", "5173", "8000", "8080"]);
    await Promise.all([runCommand(startDevServerCmd), runCommand(openBrowserCmd)]);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
