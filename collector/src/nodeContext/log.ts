import * as fs from 'fs'
import * as path from 'path'

import pino from 'pino'

import { execDirPath } from './consts'

const logDirectory = path.resolve(execDirPath, 'logs')
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

const logLevel = (() => {
  const level = process.env.LOG_LEVEL || 'debug'
  if (pino.levels.values[level] !== undefined) {
    return level
  } else {
    return 'debug'
  }
})() as pino.Level

export const nodeLogger = pino(
  {
    level: logLevel,
    base: { pid: false },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  fs.createWriteStream(path.resolve(logDirectory, 'app.log'), { flags: 'a' }),
)
