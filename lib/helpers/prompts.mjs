import { packageManagers, templates, validateProjectName } from './utils.mjs'

import color from 'picocolors'
import prompts from 'prompts'

const questions = [
    {
        type: 'text',
        name: 'name',
        message: 'What is the name of your project?',
        initial: 'my-project',
        validate: validateProjectName,
    },
    {
        type: 'select',
        name: 'temp',
        message: `Which template would you like to use?`,
        initial: 0,
        choices: templates.map((template, index) => ({
            title: template.title,
            value: index,
        })),
    },
    {
        type: 'select',
        name: 'pack',
        message: 'Select a package manager',
        choices: packageManagers,
        initial: 0,
    },
    {
        type: 'toggle',
        name: 'vscode',
        message: 'Do you want open project in VS Code?',
        initial: false,
        active: 'Yes',
        inactive: 'No',
    },
    {
        type: 'toggle',
        name: 'start',
        message: 'Do you want to start the development server and browser?',
        initial: false,
        active: 'Yes',
        inactive: 'No',
    },
]

const confirm = async (yargs) => {
    if (yargs._[0] !== 'create') {
        const response = await prompts(questions, {
            onCancel: () => {
                console.log(color.bgRed('Operation canceled'))
                process.exit(0)
            },
        })
        return response
    } else {
        return yargs
    }
}

export default confirm
