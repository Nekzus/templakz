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
        name: 'start',
        message: 'Do you want to start the development server and browser?',
        initial: false,
        active: 'Yes',
        inactive: 'No',
    },
]

const confirm = async (yargs) =>
    yargs._[0] !== 'create'
        ? await prompts(questions, {
              onCancel: () => {
                  console.log(color.bgRed('Operation canceled'))
                  process.exit(0)
              },
          })
        : yargs

export default confirm
