import {
    access,
    mkdir,
    readFile,
    readdir,
    stat,
    writeFile,
} from 'node:fs/promises'

import spawn from 'cross-spawn'
import { execSync } from 'node:child_process'
import path from 'node:path'
import color from 'picocolors'
import { getGitignoreContent } from './gitignore.mjs'
import { getNpmrcContent } from './npmrc.mjs'

export const templates = [
    {
        title: 'Next.js + ESLint + TypeScript + Tailwind',
        value: 'next',
    },
    {
        title: 'React.js + ESLint + TypeScript + Tailwind',
        value: 'react',
    },
    {
        title: 'React Native + Expo-Router + TypeScript + Tailwind',
        value: 'expo',
    },
]

const packageManagersToCheck = ['npm', 'pnpm', 'yarn', 'bun']
const templateValues = templates.map((t) => t.value)

export const isInstalled = (pack) => {
    try {
        execSync(`${pack} --version`, { stdio: 'ignore' })
        return true
    } catch (error) {
        return false
    }
}
const detectInstalledPackageManagers = (packageManagersToCheck) => {
    return packageManagersToCheck
        .filter((packageManager) => isInstalled(packageManager))
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
        return 'Project name can only contain letters, numbers, dashes, and underscores.'
    }

    const destinationPath = path.join(process.cwd(), value)

    try {
        await access(destinationPath)
        return `A project named ‘${value}’ already exists in the directory.`
    } catch (error) {
        return true
    }
}
export const copyAndReplaceFiles = async (
    source,
    destination,
    projectName,
    temp
) => {
    const year = new Date().getFullYear()
    const author = detectUsername()
    const entries = await readdir(source)

    for (const entry of entries) {
        const sourcePath = path.join(source, entry)
        const destPath = path.join(destination, entry)

        const stats = await stat(sourcePath)

        if (stats.isFile()) {
            let data = await readFile(sourcePath, 'utf8')

            data = data
                .replace(/{{name}}/g, projectName.toLocaleLowerCase())
                .replace(/{{author}}/g, author.toLocaleLowerCase())
                .replace(/{{year}}/g, year)
                .replace(/{{Name}}/g, projectName)

            await writeFile(destPath, data, 'utf8')
        } else if (stats.isDirectory()) {
            await mkdir(destPath, { recursive: true })

            await copyAndReplaceFiles(sourcePath, destPath, projectName)
        }
    }

    if (temp === undefined) return

    if (typeof temp === 'string') {
        temp = templateValues.indexOf(temp)
    }
    if (temp === -1 || temp >= templateValues.length) return
    if (temp === 2) {
        const npmrcContent = await getNpmrcContent(temp)
        await writeFile(path.join(destination, '.npmrc'), npmrcContent, 'utf8')
    }

    const gitignoreContent = await getGitignoreContent(temp)
    await writeFile(
        path.join(destination, '.gitignore'),
        gitignoreContent,
        'utf8'
    )
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

export const releasePorts = async (port) => {
    console.log(color.cyan(`Releasing port: ${port}`))

    try {
        execSync(`lsof -i :${port} | awk 'NR!=1 {print $2}' | xargs kill`, {
            stdio: 'ignore',
        })
    } catch (error) {}
}

export const detectUsername = () => {
    let username

    if (process.platform === 'win32') {
        username = process.env.USERNAME
    } else if (process.platform === 'linux') {
        username = process.env.USER
    } else {
        username = 'username'
    }

    return username
}

export const checkProjectName = async (yargs) => {
    const { name } = yargs
    const validationResult = await validateProjectName(name)
    if (typeof validationResult === 'string') {
        return validationResult
    }
    return true
}
