import './monkeyPatch'

import { nodeLogger } from './log'
import { registerService } from './windowsService'

export async function main() {
  nodeLogger.info('start main')
  await registerService()
  nodeLogger.info('done')
}
