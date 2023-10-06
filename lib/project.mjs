import {
    copyAndReplaceFiles,
    isInstalled,
    printProjectInfo,
    releasePorts,
    runCommand,
    templates,
} from './helpers/utils.mjs'
import path, { dirname } from 'node:path'

import color from 'picocolors'
import confirm from './helpers/prompts.mjs'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'
import startServer from './helpers/start-server.mjs'

const createProject = async (yargs) => {
    try {
        const project = await confirm(yargs)
        const { name, temp, pack, vscode, start } = project
        const selectedTemplate =
            yargs._[0] === 'create'
                ? templates.find((template) => template.value === temp)
                : templates[temp]
        if (!selectedTemplate) {
            throw new Error(color.red(`Invalid template: ${temp}`))
        }
        const destination = path.join(process.cwd(), name)
        const port =
            selectedTemplate.value === 'next-eslint-ts-tw' ? 3000 : 5173
        const templateDirectory = path.join(
            dirname(fileURLToPath(import.meta.url)),
            'templates',
            selectedTemplate.value
        )
        await mkdir(destination, { recursive: true })
        await copyAndReplaceFiles(templateDirectory, destination, name)

        start && printProjectInfo(project, selectedTemplate, pack)
        process.chdir(destination)

        if (vscode) {
            const vscodeInstalled = isInstalled('code')
            if (vscodeInstalled) {
                console.log(color.cyan('Opening VS Code...'))
                const openVSCode = `code ${destination}`
                await runCommand(openVSCode)
            } else {
                console.warn(
                    color.yellow(
                        'Visual Studio Code is not installed. Skipping opening in VSCode.'
                    )
                )
            }
        }

        const installCmd = `${pack} install`
        await runCommand(installCmd)

        const gitInstalled = isInstalled('git')
        if (gitInstalled) {
            console.log(color.cyan('Initializing Git repository...'))
            const initGit = 'git init'
            await runCommand(initGit)
        } else {
            console.warn(
                color.yellow(
                    'Git is not installed. Skipping Git initialization.'
                )
            )
        }

        if (start) {
            await releasePorts(port)
            await startServer(pack, port)
        } else {
            printProjectInfo(project, selectedTemplate, pack)
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(
                color.red(
                    `Error: ${error.message}. The specified directory or file does not exist.`
                )
            )
        } else {
            console.error(
                color.red(`An unexpected error occurred: ${error.message}`)
            )
        }
    }
}

export default createProject
