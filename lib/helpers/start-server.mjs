import open from 'open'
import { runCommand } from './utils.mjs'

const startServer = async (pack, port) => {
    const startDevServerCmd = `${pack} run dev`

    try {
        const openBrowserCmd = open(`http://localhost:${port}`, {
            wait: false,
        })

        await Promise.all([runCommand(startDevServerCmd), openBrowserCmd])
        console.log('Development server started successfully.')
    } catch (error) {
        process.exit(0)
    }
}

export default startServer
