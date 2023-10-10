import color from 'picocolors'
import figlet from 'figlet'

export const epilogueText = `
  ### More Information ###
  Visit the online documentation for additional details:
  - https://github.com/Nekzus/templakz#readme

  If you have any questions or comments, please feel free to get in touch with us:
  - https://github.com/Nekzus/templakz/issues

  Thank you for using Templakz - Project kickstart assistant!`

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

export const printHeader = () => {
    const headerText = figlet.textSync('TemplakZ', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
    })

    console.log(
        color.cyan('--------------------------------------------------')
    )
    console.log(color.green(`${headerText}\n`))
    console.log(color.green('            *** Created by Nekzus ***       '))
    console.log(
        color.cyan('--------------------------------------------------\n')
    )
}
