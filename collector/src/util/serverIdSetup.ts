import axios, { AxiosError } from 'axios'
import { machineId } from 'node-machine-id'

import { config } from './getConfig'

const localMachineId = await machineId(true)

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_MACHINES_ENDPOINT = process.env.REACT_APP_MACHINES_ENDPOINT
const REACT_APP_CLIENT_TYPE = process.env.REACT_APP_CLIENT_TYPE

const MACHINES_ENDPOINT = `${REACT_APP_API_BASE_URL}${REACT_APP_MACHINES_ENDPOINT}`
const LOCAL_MACHINE_ID_URL_ENDPOINT = `${MACHINES_ENDPOINT}/${localMachineId}?type=${REACT_APP_CLIENT_TYPE}`

/**
 * 1. GET /machines/:id?type=clientType
 * 2-1. If the machineId exists, return the machineId
 * 2-2. If the machineId does not exist, POST /machines with the clientType Return the machineId
 */

async function initializeServerId() {
  try {
    console.log('=== Start initialize server ID ===')
    console.log('Local machine ID:', localMachineId)
    console.log('Local machine name:', config.pc_name)
    console.log('Local machine type:', REACT_APP_CLIENT_TYPE)
    console.log('Local machine endpoint:', LOCAL_MACHINE_ID_URL_ENDPOINT)
    let response
    try {
      response = await axios.get(LOCAL_MACHINE_ID_URL_ENDPOINT)
    } catch (error: unknown) {
      const err = error as AxiosError
      console.error('Error getting server ID:', err.message)
      if (err.response) {
        console.error('Failed to get server response:', err.response.status)
      } else if (err.request) {
        console.error('No response received:', err.request)
      } else {
        console.error('Error setting up the request:', err.message)
      }
    }
    if (response && response.data.data.id) {
      return response.data.data.id // 등록된 로컬 ID가 있으면 반환
    } else {
      try {
        console.log('Registering the server ID...')
        console.log('Local machine ID:', localMachineId)
        console.log('Local machine name:', config.pc_name)
        console.log('Local machine type:', REACT_APP_CLIENT_TYPE)
        console.log('URL :', MACHINES_ENDPOINT)
        const machinePostRespone = await axios.post(MACHINES_ENDPOINT, {
          machineName: config.pc_name,
          uuid: localMachineId,
        }) // 등록된 로컬 ID가 없으면 등록
        console.log('machinePostRespone sent successfully:', machinePostRespone.data)
        response = await axios.get(LOCAL_MACHINE_ID_URL_ENDPOINT) // 다시 확인하여 등록된 로컬 ID 반환
        console.log('Server ID registered:', response.data.data.id)
        return response.data.data.id
      } catch (error: unknown) {
        const err = error as AxiosError
        console.error('Error setting up the server ID:', err.message)
        if (err.response) {
          console.error('Failed to get server response:', err.response.status)
        } else if (err.request) {
          console.error('No response received:', err.request)
        } else {
          console.error('Error setting up the request:', err.message)
        }
      }
    }
  } catch (error: unknown) {
    const err = error as AxiosError
    console.error('Unexpected error during initialization:', err.message)
  }
}

const serverId = await initializeServerId()
console.log('Server ID:', serverId)
export { serverId }
