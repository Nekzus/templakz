import {
    access,
    mkdir,
    readFile,
    readdir,
    stat,
    writeFile,
} from 'node:fs/promises'
import { execSync, spawn } from 'node:child_process'

import color from 'picocolors'
import path from 'node:path'

export const templates = [
    {
        title: 'Next.js + ESLint + TypeScript + Tailwind',
        value: 'next-eslint-ts-tw',
    },
    {
        title: 'React.js + ESLint + TypeScript + Tailwind',
        value: 'react-eslint-ts-tw',
    },
]

const packageManagersToCheck = ['npm', 'pnpm', 'yarn']

const isPackageManagerInstalled = (packageManagerName) => {
    try {
        execSync(`${packageManagerName} --version`, { stdio: 'ignore' })
        return true
    } catch (error) {
        return false
    }
}
const detectInstalledPackageManagers = (packageManagersToCheck) => {
    return packageManagersToCheck
        .filter((packageManager) => isPackageManagerInstalled(packageManager))
        .map((packageManager) => ({
            title: packageManager,
            value: packageManager,
        }))
}

export const packageManagers = detectInstalledPackageManagers(
    packageManagersToCheck
)
export const validateProjectName = async (value) => {
    if (!value.match(/^[a-zA-Z0-9-_]+$/)) {
        return 'Project name can only contain letters, numbers, dashes, and underscores'
    }

    const destinationPath = path.join(process.cwd(), value)

    try {
        await access(destinationPath)
        return 'A folder with the same name already exists'
    } catch (error) {
        return true
    }
}
export const copyAndReplaceFiles = async (source, destination, projectName) => {
    const entries = await readdir(source)

    for (const entry of entries) {
        const sourcePath = path.join(source, entry)
        const destPath = path.join(destination, entry)

        const stats = await stat(sourcePath)

        if (stats.isFile()) {
            let data = await readFile(sourcePath, 'utf8')

            data = data.replace(/{{name}}/g, projectName)

            await writeFile(destPath, data, 'utf8')
        } else if (stats.isDirectory()) {
            await mkdir(destPath, { recursive: true })

            await copyAndReplaceFiles(sourcePath, destPath, projectName)
        }
    }
}

export const replaceTokensInFiles = async (files, projectName) => {
    for await (const file of files) {
        try {
            const data = await readFile(file, 'utf8')
            const draft = data.replace(/{{name}}/g, projectName)

            await writeFile(file, draft, 'utf8')
        } catch (error) {
            console.error(`Error replacing tokens in file ${file}: ${error}`)
        }
    }
}

export const runCommand = async (command) => {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, { shell: true, stdio: 'inherit' })
        childProcess.on('exit', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(
                    new Error(`Command '${command}' exited with code ${code}`)
                )
            }
        })

        childProcess.on('error', (error) => {
            reject(error)
        })
    })
}

export const printProjectInfo = (
    project,
    selectedTemplate,
    selectedPackageManager
) => {
    console.log(color.yellow('\n✨ Project created successfully! ✨'))
    console.log('\nYou have selected:')
    console.log(`- Project Name: ${color.cyan(project.name)}`)
    console.log(`- Template: ${color.cyan(selectedTemplate.title)}`)
    console.log(`- Package Manager: ${color.cyan(selectedPackageManager)}`)
    console.log(`- Start Server: ${color.cyan(project.start ? 'Yes' : 'No')}`)
    console.log(`\n${color.yellow('Next steps:')}`)
    console.log(`${color.green('cd')} ${color.green(project.name)}`)
    console.log(`${color.green('code .')}\n`)
    console.log(
        `Have questions? Visit ${color.underline(
            color.cyan('https://github.com/Nekzus/templakz#readme')
        )}\n`
    )
}

export const releasePorts = async (port) => {
    console.log(color.cyan(`Releasing port: ${port}`))

    try {
        execSync(`lsof -i :${port} | awk 'NR!=1 {print $2}' | xargs kill`, {
            stdio: 'ignore',
        })
    } catch (error) {}
}
