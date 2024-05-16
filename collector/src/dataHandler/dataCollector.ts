import * as os from 'os'
import { execSync } from 'child_process'

import * as si from 'systeminformation'
import { machineId } from 'node-machine-id'

import { MachineData, HwInfo, SDKInfo, ResourceInfo } from './dataInterface'
import { MetricType } from './MetricTypes'

async function collectHwInfo(): Promise<MachineData> {
  try {
    console.log('=== Start collect HW information ===')
    const cpuInfo = os.cpus()
    const cpuCores = cpuInfo.length
    const cpuModel = cpuInfo[0].model
    const cpuSpeed = cpuInfo[0].speed

    const [
      graphics,
      rawNetworkInterfaces,
      UUID,
      disks
    ] = await Promise.all([
      si.graphics(),
      si.networkInterfaces(),
      machineId(true),
      si.fsSize()
    ])

    const networkInterfaces = Array.isArray(rawNetworkInterfaces) ? rawNetworkInterfaces : [rawNetworkInterfaces]

    const hwInfo: HwInfo = {
      identifier: UUID,
      cpu: {
        model: cpuModel,
        speed: cpuSpeed,
        cores: cpuCores
      },
      ram: {
        total: os.totalmem()
      },
      gpu: graphics.controllers.map(gpu => ({
        model: gpu.model,
        vram: gpu.vram !== null ? gpu.vram : 0
      })),
      disk: disks.map(disk => ({
        filesystem: disk.fs,
        size: disk.size,
        used: disk.used,
        available: disk.available,
        use: disk.use,
        mount: disk.mount
      })),
      network: networkInterfaces.map(net => ({
        iface: net.iface,
        mac: net.mac,
        ip4: net.ip4 || 'N/A'
      })),
      os: {
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname()
      }
    }

    const returnData : MachineData = {
      info: hwInfo,
      metricType: MetricType.HW_INFO
    }
    console.log(returnData)
    console.log('=== Success Collect HW information ===')
    return returnData
  } catch (error) {
    console.error('Failed to fetch HW information:', error)
    throw new Error('Failed to fetch HW information')
  }
}

async function collectSDKInfo(): Promise<MachineData> {
  try {
    console.log('=== Start collect SDK information ===')

    const sdkInfo: SDKInfo = {}

    const javaVersion = execSync('java --version').toString()
    sdkInfo.java = javaVersion || 'Java not found'

    const dotnetVersion = execSync('dotnet --version').toString().trim()
    sdkInfo.dotnet = dotnetVersion || 'dotnet not found'

    const returnData : MachineData = {
      info: sdkInfo,
      metricType: MetricType.SDK_INFO
    }
    console.log(returnData)
    console.log('=== Success collect SDK information ===')
    return returnData
  } catch (error) {
    console.error('Failed to fetch SDK information:', error)
    throw new Error('Failed to fetch SDK information')
  }
}

async function collectResouceInfo(): Promise<MachineData> {
  try {
    console.log('=== Start collect resource information ===')

    const cpuLoad = await si.currentLoad()
    const cpuUsage = cpuLoad.currentLoad

    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100

    const resourceInfo: ResourceInfo = {
      cpuUsage,
      memoryUsage
    }

    const returnData : MachineData = {
      info: resourceInfo,
      metricType: MetricType.RESOURCE_INFO
    }

    console.log(returnData)
    console.log('=== Success collect resource information ===')
    return returnData
  } catch (error) {
    console.error('Failed to fetch resource information:', error)
    throw new Error('Failed to fetch resource information')
  }
}

export { collectHwInfo, collectSDKInfo, collectResouceInfo }
