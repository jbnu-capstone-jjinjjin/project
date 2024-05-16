import * as os from 'os'

import axios, { AxiosError } from 'axios'
import { config } from 'dotenv'

import { MachineData } from './dataInterface'
import {
  collectHwInfo,
  collectSDKInfo,
  collectResouceInfo,
} from './dataCollector'

config()
const API_URL = process.env.API_URL || 'http://localhost:8080'

async function sendMachineData(machineData: MachineData) {
  try {
    const machineResponse = await axios.post(`${API_URL}/machines`, {
      machineName: os.hostname(),
    })
    const machineId = machineResponse.data.data.machineId

    const metricsResponse = await axios.post(`${API_URL}/metrics`, {
      machineId,
      timestamp: new Date().toISOString(),
      metric_type: machineData.metricType,
      data: machineData.info,
    })

    console.log('MachineData sent successfully:', metricsResponse.data)
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.response) {
      console.error(
        'Failed to send machine data:',
        machineData.metricType,
        machineData.info,
        err.response.status
      )
    } else if (err.request) {
      console.error('No response received:', err.request)
    } else {
      console.error('Error setting up the request:', err.message)
    }
  }
}

async function sendAndGetSDKInfo(): Promise<MachineData> {
  const machineData = await collectSDKInfo()
  await sendMachineData(machineData)
  return machineData
}
async function sendAndGetHwInfo(): Promise<MachineData> {
  const machineData = await collectHwInfo()
  await sendMachineData(machineData)
  return machineData
}
async function sendAndGetResourceInfo(): Promise<MachineData> {
  const machineData = await collectResouceInfo()
  await sendMachineData(machineData)
  return machineData
}

export { sendAndGetSDKInfo, sendAndGetHwInfo, sendAndGetResourceInfo }
