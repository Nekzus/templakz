<!-- Title -->

# Templakz - CLI (Next.js, React.js, Expo React Native)

<!-- Subtitle -->

> _Streamline Your Project Initialization Process with Templakz_

[![Github Workflow](https://github.com/nekzus/templakz/actions/workflows/publish.yml/badge.svg?event=push)](https://github.com/Nekzus/templakz/actions/workflows/publish.yml)
[![npm-version](https://img.shields.io/npm/v/@nekzus/templakz.svg)](https://www.npmjs.com/package/@nekzus/templakz)
[![npm-month](https://img.shields.io/npm/dm/@nekzus/templakz.svg)](https://www.npmjs.com/package/@nekzus/templakz)
[![npm-total](https://img.shields.io/npm/dt/@nekzus/templakz.svg?style=flat)](https://www.npmjs.com/package/@nekzus/templakz)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Nekzus/templakz)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/maseortega)

<div align="center">
<img width="700" alt="templakz" src="https://res.cloudinary.com/dsvsl0b0b/image/upload/v1696982013/npm-package/lbje2fspjdxwpezs4fnu.png">
</div>

<!-- Description -->

## Overview

Templakz is a powerful project template generator designed to simplify the
project initialization process. It's crafted with developers like you in mind,
offering an efficient way to start new projects with ease. Templakz provides a
range of templates and customization options, allowing you to tailor your
project to your specific needs.

### Key Features:

- **Effortless Project Kickstart**: Say goodbye to tedious project setup tasks.
  Templakz automates the process, ensuring you can get started quickly.

- **Diverse Template Library**: Templates cover popular frameworks, libraries,
  and tools, including React.js,Next.js and Expo React Native.

- **Tailor-Made Projects**: Easily customize templates to match your project's
  unique requirements. Templakz empowers you to make changes and save your
  custom configurations.

- **Preferred Package Managers**: Seamlessly integrate Templakz with your
  preferred package manager, whether it's npm, yarn, pnpm or bun.

- **Interactive CLI**: The interactive command-line interface guides you through
  the project creation process, providing a user-friendly experience.

- **Community-Driven**: Join a thriving community of developers who contribute
  templates and improvements to Templakz.

## Getting Started

### Prerequisites

Before using Templakz, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (version 15 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for package
  management)

### Installation

To install Templakz globally, execute the following command in your terminal:

```
# Using npm
npm install -g @nekzus/templakz

# Using yarn
yarn global add @nekzus/templakz
```

## Usage

### Creating a New Project (Interactive Mode)

1. Open your terminal.
2. Run the following command to generate a new project based on a template:

```
templakz  |> Activate Interactive Mode Console
```

3. Follow the interactive prompts to provide project details, including name,
   template, and package manager.

4. Templakz will set up your project using the selected template and
   configurations.

### Creating a New Project (Automatic Mode)

```
templakz create [options]
```

### Available Options

```
-h, --help: Show help.
-v, --version: Show version number.
-n, --name: Name of the project.
-t, --temp: Template to use (react, next, expo).
-p, --pack: Package manager to use (npm, yarn, pnpm, bun).
-c, --vscode: Open the project in Visual Studio Code.
-s, --start: Start the server and browser.
```

---

### Example usage in automatic mode

```
templakz create -n my-app -t react -p pnpm -c -s
```

This command will create a new project with the name "my-app," using the "react"
template, the package manager "pnpm," open the project in Visual Studio Code,
and also start the server and browser.

## Supported Templates

Templakz offers a variety of templates, including:

- **React.js Template**: A template for React.js projects with ESLint,
  TypeScript, and Tailwind CSS.

- **Next.js Template**: A template for Next.js projects with ESLint, TypeScript,
  and Tailwind CSS.

- **Expo React Native Template**: A template for Expo React Native projects with
  Expo-router, TypeScript, and Tailwind CSS.

Feel free to explore and use these templates to kickstart your projects.

## Options

There are no command-line options for templakz. It provides a guided experience
based on your project's needs.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Acknowledgments

This tool was inspired by the need to streamline common development tasks.
Contributing Contributions are welcome! Feel free to open issues or submit pull
requests.

## Author

[nekzus](https://github.com/nekzus)

## Contact

If you have any questions or suggestions, please feel free to contact me at
[nekzus.dev@gmail.com](mailto:nekzus.dev@gmail.com).
