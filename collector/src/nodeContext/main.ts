import './monkeyPatch'

import { nodeLogger } from './log'
import { checkService } from './windowsService'

export async function main() {
  nodeLogger.info('start main')
  await checkService()
  nodeLogger.info('done')
}
