import { ServiceManager } from './service'

export async function main() {
  if (ServiceManager.checkAndRegisterService()) {
    process.exit(0)
  }
}
