import * as path from 'path'
import * as fs from 'fs'

import { publicPath } from './consts'

export interface Config {
  collection_interval: number
  pc_name: string
}

export async function loadConfig(): Promise<Config> {
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
