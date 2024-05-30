import * as os from 'os'
import { execSync } from 'child_process'

import psList from 'ps-list'
import pidusage from 'pidusage'
import * as si from 'systeminformation'
import { machineId } from 'node-machine-id'

import { MachineData, HwInfo, SDKInfo, ResourceInfo, ProcessInfo } from './dataInterface'
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
  const sdkInfo: SDKInfo = {}
  try {
    console.log('=== Start collect Java information ===')
    const javaVersion = execSync('java --version').toString()
    sdkInfo.java = javaVersion || 'Java not found'
    console.log('Java version:', javaVersion)
    console.log('=== Success collect Java information ===')
  } catch (error) {
    console.error('Failed to fetch Java information:', error)
    sdkInfo.java = 'Java not found'
  }

  try {
    console.log('=== Start collect .NET information ===')
    const dotnetVersion = execSync('dotnet --version').toString().trim()
    sdkInfo.dotnet = dotnetVersion || 'dotnet not found'
    console.log('dotnet version:', dotnetVersion)
    console.log('=== Success collect .NET information ===')
  } catch (error) {
    console.error('Failed to fetch .NET information:', error)
    sdkInfo.dotnet = 'dotnet not found'
  }

  const returnData : MachineData = {
    info: sdkInfo,
    metricType: MetricType.SDK_INFO
  }
  console.log(returnData)

  return returnData
}

async function collectResouceInfo(): Promise<MachineData> {
  try {
    console.log('=== Start collect resource information ===')
    const processes = await psList() // 모든 프로세서 얻어옴
    const pids = processes.map(process => process.pid) // 프로세스 아이디만 추출
    const stats = await pidusage(pids) // 프로세스 아이디로 cpu, memory 사용량 얻어옴

    const processInfo: ProcessInfo[] = processes.map(process => {
      const stat = stats[process.pid]
      return {
        pid: process.pid,
        name: process.name,
        cpu: stat ? stat.cpu : 0, // stats가 존재하지 않으면 0으로 설정
        memory: stat ? stat.memory / (1024 * 1024) : 0 // stats가 존재하지 않으면 0으로 설정
      }
    }) // 프로세스 정보와 cpu, memory 사용량을 합침

    const topCpu = processInfo.sort((a, b) => b.cpu - a.cpu).slice(0, 10) // cpu 사용량이 높은 10개 프로세스
    const topMemory = processInfo.sort((a, b) => b.memory - a.memory).slice(0, 10) // memory 사용량이 높은 10개 프로세스

    const resourceInfo: ResourceInfo = {
      topCpu,
      topMemory
    } // cpu, memory 사용량이 높은 10개 프로세스

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
