import axios, { AxiosError } from 'axios'
import { machineId } from 'node-machine-id'

import { config } from './getConfig'

const localId = await machineId(true)

const MACHINES_ENDPOINT = `${config.API_BASE_URL}/machines`
const GET_SERVER_ID_ENDPOINT = `${config.API_BASE_URL}/machines/${localId}?type=client`
console.log('MACHINES_ENDPOINT:', MACHINES_ENDPOINT)
console.log('GET_SERVER_ID_ENDPOINT:', GET_SERVER_ID_ENDPOINT)
/**
 * 1. GET /machines/:id?type=clientType
 * 2-1. If the machineId exists, return the machineId
 * 2-2. If the machineId does not exist, POST /machines with the clientType, Return the machineId
 */

async function getServerId() {
  try {
    console.log('Getting server ID...')
    const response = await axios.get(`${GET_SERVER_ID_ENDPOINT}`)
    console.log('Server ID retrieved:', response.data)
    return response.data
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.response) {
      console.error('Failed to get server ID:', err.response.status)
    } else if (err.request) {
      console.error('No response received:', err.request)
    } else {
      console.error('Error setting up the request:', err.message)
    }
    await registerServerId()
  }
}

async function registerServerId() {
  try {
    console.log('Registering server ID...')
    const response = await axios.post(`${MACHINES_ENDPOINT}`, {
      machineName: config.PC_NAME,
      uuid: localId,
    })
    console.log('Server ID registered : ', response.status)
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.response) {
      console.error('Failed to register server ID:', err.response.status)
    } else if (err.request) {
      console.error('No response received:', err.request)
    } else {
      console.error('Error setting up the request:', err.message)
    }
  }
}

async function initializeServerId() {
  const firstTryServerId = await getServerId()

  if (firstTryServerId) {
    return firstTryServerId.data.machineId
  } else {
    console.log('Failed to get server ID... retrying...')
    const secondTryServerId = await getServerId()
    return secondTryServerId.data.machineId
  }
}
const serverId = await initializeServerId()
console.log('Server ID:', serverId)
export { serverId }
