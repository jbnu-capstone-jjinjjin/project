import * as nodeWindows from 'node-windows'

import { nodeLogger } from './log'

// console.log(__dirname)
const serviceName = 'com.example.collector'

export async function checkService(): Promise<void> {
  const res = await new Promise((resolve, reject) => {
    nodeWindows.list((services) => {
      nodeLogger.info(services)
      resolve(null)
    })
  })

  console.log(res)
}

export async function registerService(): Promise<void> {
  await new Promise((resolve, reject) => {
    console.log('Registering service')
    resolve(null)
    // const service = new nodeWindows.Service({
    //   name: 'collector',
    //   description: 'Collector service',
    //   script: '',

    // })

    // service.on('install', () => {
    //   console.log('Service installed successfully.')
    //   service.start()
    //   resolve()
    // })

    // service.on('error', (err) => {
    //   console.error('Failed to install service:', err)
    //   reject(err)
    // })

    // service.install()
  })
}
