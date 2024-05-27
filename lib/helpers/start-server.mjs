import open from 'open'
import color from 'picocolors'
import { runCommand } from './utils.mjs'

const startServer = async (pack, port, selectedTemplate) => {
    try {
        if (selectedTemplate.value === 'expo') {
            console.log(color.green('Starting Expo server...'))
            await runCommand(`${pack} run start --reset-cache`)
            console.log(color.cyan('Expo closed.'))
        } else {
            await runDevServer(pack, port)
        }
    } catch (error) {
        console.error(color.bgRed(`Error starting server: ${error.message}`))
        process.exit(1)
    }
}

const runDevServer = async (pack, port) => {
    const startDevServerCmd = `${pack} run dev`

    try {
        const openBrowserCmd = open(`http://localhost:${port}`, { wait: false })

        await Promise.all([runCommand(startDevServerCmd), openBrowserCmd])

        console.log(color.green('Development server started successfully.'))
    } catch (error) {
        console.error(
            color.bgRed(`Error starting development server: ${error.message}`)
        )
        throw error
    }
}

export default startServer
