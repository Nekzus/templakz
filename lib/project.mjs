import {
    copyAndReplaceFiles,
    printProjectInfo,
    releasePorts,
    replaceTokensInFiles,
    runCommand,
    templates,
} from './helpers/utils.mjs'
import path, { dirname } from 'node:path'

import color from 'picocolors'
import confirm from './helpers/prompts.mjs'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import { mkdir } from 'node:fs/promises'

const createProject = async (yargs) => {
    try {
        const project = await confirm(yargs)
        const { name, temp, pack, start } = project
        const selectedTemplate =
            yargs._[0] === 'create'
                ? templates.find((template) => template.value === temp)
                : templates[temp]
        if (!selectedTemplate) {
            throw new Error(`Invalid template: ${temp}`)
        }
        const destination = path.join(process.cwd(), name)
        const PORT =
            selectedTemplate.value === 'next-eslint-ts-tw' ? 3000 : 5173
        const templateDirectory = path.join(
            dirname(fileURLToPath(import.meta.url)),
            'templates',
            selectedTemplate.value
        )
        const files = await glob('**/*', {
            nodir: true,
            cwd: destination,
            absolute: true,
        })

        await mkdir(destination, { recursive: true })
        await copyAndReplaceFiles(templateDirectory, destination, name)
        await replaceTokensInFiles(files, name)
        start && printProjectInfo(project, selectedTemplate, pack)
        process.chdir(destination)
        const installCmd = `${pack} install`
        await runCommand(installCmd)

        if (start) {
            await releasePorts(PORT)
            const startDevServerCmd = `${pack} run dev`
            const openBrowserCmd = `xdg-open http://localhost:${PORT}`

            await Promise.all(
                [runCommand(startDevServerCmd), runCommand(openBrowserCmd)],
                {
                    onCancel: () => {
                        console.log(color.bgRed('Operation canceled'))
                        process.exit(0)
                    },
                }
            )
        } else {
            printProjectInfo(project, selectedTemplate, pack)
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(
                `Error: ${error.message}. The specified directory or file does not exist.`
            )
        } else {
            console.error(`An unexpected error occurred: ${error.message}`)
        }
    }
}

export default createProject
