import * as fs from 'fs'
import * as path from 'path'

import pino from 'pino'
import pretty from 'pino-pretty'
import { multistream } from 'pino-multi-stream'

const logDirectory = path.resolve(process.execPath, 'logs')
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

const streams = [
  {
    stream: pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    }),
  },
  {
    level: logLevel,
    stream: fs.createWriteStream(path.resolve(logDirectory, 'app.log'), { flags: 'a' }),
  },
]

export const nodeLogger = pino(
  {
    level: logLevel,
    base: { pid: false },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  multistream(streams)
)
