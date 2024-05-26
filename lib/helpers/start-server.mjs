import open from 'open'
import color from 'picocolors'
import { runCommand } from './utils.mjs'

const startServer = async (pack, port, selectedTemplate) => {
    if (selectedTemplate.value === 'expo-rn-ts-tw') {
        const startExpoCmd = `${pack} run start`
        try {
            await runCommand(startExpoCmd)
            console.log(color.green('Expo started successfully.'))
            return
        } catch (error) {
            process.exit(0)
        }
    }
    const startDevServerCmd = `${pack} run dev`

    try {
        const openBrowserCmd = open(`http://localhost:${port}`, {
            wait: false,
        })

        await Promise.all([runCommand(startDevServerCmd), openBrowserCmd])
        console.log(color.green('Development server started successfully.'))
    } catch (error) {
        process.exit(0)
    }
}

export default startServer
