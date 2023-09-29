import { packageManagers, templates, validateProjectName } from './utils.mjs'

import color from 'picocolors'
import prompts from 'prompts'

export const project = await prompts(
    [
        {
            type: 'text',
            name: 'name',
            message: 'What is the name of your project?',
            initial: 'my-project',
            validate: (value) => validateProjectName(value),
        },
        {
            type: 'select',
            name: 'templateIndex',
            message: `Which template would you like to use?`,
            initial: 0,
            choices: templates.map((template, index) => ({
                title: template.title,
                value: index,
            })),
        },
        {
            type: 'select',
            name: 'packageIndex',
            message: 'Select a package manager',
            choices: packageManagers.map((packageManager, index) => ({
                title: packageManager,
                value: index,
            })),
        },
        {
            type: 'toggle',
            name: 'startServer',
            message: 'Do you want to start the development server and browser?',
            initial: false,
            active: 'Yes',
            inactive: 'No',
        },
    ],
    {
        onCancel: () => {
            console.log(color.bgRed('Operation canceled'))
            process.exit(0)
        },
    }
)
