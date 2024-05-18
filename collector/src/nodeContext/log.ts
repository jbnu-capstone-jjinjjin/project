import * as fs from 'fs'
import * as path from 'path'
import { Writable } from 'stream'

const logDirectory = path.resolve(process.cwd(), 'logs')
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}
console.log(`log directory: ${logDirectory}`)

const logFilePath = path.resolve(logDirectory, 'app.log')

// Remove the log file if it exists
if (fs.existsSync(logFilePath)) {
  fs.unlinkSync(logFilePath)
}

// Custom Writable stream that flushes data periodically
class FileStream extends Writable {
  private buffer: Buffer[] = []
  private interval: NodeJS.Timeout

  constructor(private filePath: string) {
    super()
    this.interval = setInterval(() => this.flush(), 1000) // Flush every second
  }

  _write(chunk: Buffer, encoding: string, callback: () => void) {
    this.buffer.push(chunk)
    callback()
  }

  flush() {
    if (this.buffer.length > 0) {
      const data = Buffer.concat(this.buffer)
      fs.appendFileSync(this.filePath, data)
      this.buffer = []
    }
  }

  _final(callback: () => void) {
    this.flush()
    clearInterval(this.interval)
    callback()
  }
}

const fileStream = new FileStream(logFilePath)

function logToConsole(message: string) {
  console.log(message)
}

function logToFile(message: string) {
  const logMessage = `${new Date().toISOString()} ${message}\n`
  fileStream.write(Buffer.from(logMessage))
}

export const nodeLogger = {
  info: (message: string) => {
    const formattedMessage = `[INFO]: ${message}`
    logToConsole(formattedMessage)
    logToFile(formattedMessage)
  },
  debug: (message: string) => {
    const formattedMessage = `[DEBUG]: ${message}`
    logToConsole(formattedMessage)
    logToFile(formattedMessage)
  },
  error: (message: string) => {
    const formattedMessage = `[ERROR]: ${message}`
    logToConsole(formattedMessage)
    logToFile(formattedMessage)
  }
}

// Flush remaining logs on process exit
process.on('exit', () => {
  fileStream.end()
})
process.on('SIGINT', () => {
  process.exit()
})
