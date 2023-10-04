import { packageManagers, templates } from './helpers/utils.mjs'

import epilogueText from './helpers/epilogue.mjs'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

const configureYargs = () => {
    const templateChoices = templates.map((template) => template.value)
    const packageChoices = packageManagers.map(
        (packageManager) => packageManager.value
    )
    const args = yargs(hideBin(process.argv))
        .command('create', 'Create a new project', (yargs) => {
            return yargs
                .options({
                    name: {
                        alias: 'n',
                        type: 'string',
                        description: 'Name of the project',
                        default: 'my-project',
                        demandOption: false,
                    },
                    temp: {
                        alias: 't',
                        type: 'string',
                        description: 'Template to use',
                        choices: templateChoices,
                        default: 'next-eslint-ts-tw',
                        demandOption: false,
                    },
                    pack: {
                        alias: 'p',
                        type: 'string',
                        description: 'Package manager to use',
                        choices: packageChoices,
                        default: 'npm',
                        demandOption: false,
                    },
                    start: {
                        alias: 's',
                        type: 'boolean',
                        description: 'Start server and browser',
                        default: false,
                        demandOption: false,
                    },
                })
                .usage('Usage: templakz create [options]')
                .epilogue(epilogueText)
        })

        .help()
        .alias('help', 'h')
        .version()
        .alias('version', 'v')
        .usage('Usage: templakz [options] (interactive console)')
        .epilogue(epilogueText).argv

    return args
}

export default configureYargs
