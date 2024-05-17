import { nodeLogger } from './log'

const cwd = process.cwd()
globalThis.__dirname = cwd

nodeLogger.info(`set cwd to: ${cwd}`)

export { }
