import {
    access,
    mkdir,
    readFile,
    readdir,
    stat,
    writeFile,
} from 'node:fs/promises'

import color from 'picocolors'
import { execSync } from 'node:child_process'
import path from 'node:path'
import spawn from 'cross-spawn'

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
export const copyAndReplaceFiles = async (source, destination, projectName) => {
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
                .replace(/{{name}}/g, projectName)
                .replace(/{{author}}/g, author)
                .replace(/{{year}}/g, year)

            await writeFile(destPath, data, 'utf8')
        } else if (stats.isDirectory()) {
            await mkdir(destPath, { recursive: true })

            await copyAndReplaceFiles(sourcePath, destPath, projectName)
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
    console.log(`- Start VSCode: ${color.cyan(project.vscode ? 'Yes' : 'No')}`)
    console.log(`- Start Server: ${color.cyan(project.start ? 'Yes' : 'No')}`)
    if (!project.vscode) {
        console.log(`\n${color.yellow('Next steps:')}`)
        console.log(`${color.green('cd')} ${color.green(project.name)}`)
        console.log(`${color.green('code .')}`)
    }
    console.log(
        `\nHave questions? Visit ${color.underline(
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

export const failMessage = (msg, err, yargs) => {
    const { name, temp, pack } = yargs
    if (err) {
        if (msg !== null) {
            console.error(color.red(`\n${msg}`))
            console.log(
                color.cyan(
                    '\nPlease consider changing the name of your project.'
                )
            )
            console.info('\nFor more information, visit:')
            console.info(
                color.cyan('https://github.com/Nekzus/templakz#readme')
            )
        } else {
            console.error(
                color.red(
                    '\nOption input error, please check the option format.'
                )
            )
            console.log(
                color.cyan(
                    `\nFor example: >_$ templakz create -n my-app -t react-eslint-ts-tw -p pnpm -c -s`
                )
            )
            console.info('\nFor more information, visit:')
            console.info(
                color.cyan('https://github.com/Nekzus/templakz#readme')
            )
        }
    }
    process.exit(1)
}

export const checkProjectName = async (yargs) => {
    const { name } = yargs
    const validationResult = await validateProjectName(name)
    if (typeof validationResult === 'string') {
        return validationResult
    }
    return true
}
