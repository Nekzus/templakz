import {
    copyAndReplaceFiles,
    printProjectInfo,
    releasePorts,
    runCommand,
    templates,
} from './helpers/utils.mjs'
import path, { dirname } from 'node:path'

import confirm from './helpers/prompts.mjs'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'
import startServer from './helpers/start-server.mjs'

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
        const installCmd = `${pack} install`
        await runCommand(installCmd)

        if (start) {
            await releasePorts(port)
            await startServer(pack, port)
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
