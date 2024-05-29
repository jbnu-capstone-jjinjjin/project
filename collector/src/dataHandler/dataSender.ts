import axios, { AxiosError } from 'axios'

import { serverId } from '../util/serverIdSetup'

import { MachineData } from './dataInterface'
import {
  collectHwInfo,
  collectSDKInfo,
  collectResouceInfo,
} from './dataCollector'

const REACT_APP_METRICS_ENDPOINT = process.env.REACT_APP_METRICS_ENDPOINT

async function sendMachineData(machineData: MachineData) {
  try {
    console.log('Sending machine data:', machineData.metricType, machineData.info)
    const metricsResponse = await axios.post(`${REACT_APP_METRICS_ENDPOINT}`, {
      machineId: serverId,
      createdAt: new Date().toISOString(),
      metricType: machineData.metricType,
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
