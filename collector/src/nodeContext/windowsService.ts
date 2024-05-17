import * as nodeWindows from 'node-windows'

import { nodeLogger } from './log'

console.log('dirname: ', __dirname)
const serviceName = 'Collector Service'
const service = new nodeWindows.Service({
  name: serviceName,
  description: 'Collector service',
  script: '',
})

service.on('install', () => {
  nodeLogger.info('Service installed successfully.')
  service.start()
})

service.on('alreadyInstalled', () => {
  nodeLogger.info('Service is already installed.')
  service.start()
})

export async function registerService(): Promise<void> {
  await new Promise((resolve, reject) => {
    service.once('error', (error) => {
      nodeLogger.error(`Service error: ${error}`)
      reject(error)
    })

    service.install()
    service.restart()
    nodeLogger.info('Service installed.')
    resolve(null)
  })
}

export async function unRegisterService(): Promise<void> {
  await new Promise((resolve, reject) => {
    service.once('error', (error) => {
      nodeLogger.error(`Service error: ${error}`)
      reject(error)
    })

    service.uninstall()
    nodeLogger.info('Service uninstalled.')
    resolve(null)
  })
}
