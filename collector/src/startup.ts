import { ExecException, exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)
const registryKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
const appName = 'Collector'
const exePath = process.execPath

export async function registerStartupApplication() {
  try {
    const { stdout } = await execPromise(`reg query "${registryKey}" /v "${appName}"`)
    if (stdout.includes(appName)) {
      console.log('Application is already registered as a startup application.')
      return
    }

    await execPromise(`reg add "${registryKey}" /v "${appName}" /t REG_SZ /d "${exePath}" /f`)
    console.log('Application registered as a startup application.')
  } catch (err) {
    const error = err as ExecException

    if (error.code === 1) {
      await execPromise(`reg add "${registryKey}" /v "${appName}" /t REG_SZ /d "${exePath}" /f`)
      console.log('Application registered as a startup application.')
    } else {
      console.error('Failed to register startup application:', error)
    }
  }
}
