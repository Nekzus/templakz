#!/usr/bin/env node

import configureYargs from '../lib/cli.mjs'
import createProject from '../lib/project.mjs'

const main = async () => {
    const yargs = configureYargs()

    try {
        await createProject(yargs)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

main()
