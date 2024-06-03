import * as path from 'path'
import * as fs from 'fs'

import { publicPath } from './consts'

export interface Config {
  INTERVAL: number
  PC_NAME: string
  API_BASE_URL: string
}

async function getConfig() : Promise<Config> {
  try {
    const configFilePath = path.resolve(publicPath, 'config.json')
    const data = fs.readFileSync(configFilePath, 'utf-8')
    const config = JSON.parse(data)
    return config
  } catch (error: unknown) {
    const err = error as Error
    throw new Error(`Failed to read config file: ${err.message}`)
  }
}

const config = await getConfig()

export { config }
