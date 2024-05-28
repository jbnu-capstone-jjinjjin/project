import axios, { AxiosError } from 'axios'
import { machineId } from 'node-machine-id'

import { config } from './getConfig'

const localId = await machineId(true)

const REACT_APP_CLIENT_TYPE = process.env.REACT_APP_CLIENT_TYPE
const REACT_APP_MACHINES_ENDPOINT = process.env.REACT_APP_MACHINES_ENDPOINT

const GET_SERVER_ID_ENDPOINT = `${REACT_APP_MACHINES_ENDPOINT}${localId}?type=${REACT_APP_CLIENT_TYPE}`
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
    const response = await axios.post(`${REACT_APP_MACHINES_ENDPOINT}`, {
      machineName: config.pc_name,
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
    return firstTryServerId
  } else {
    console.log('Failed to get server ID... retrying...')
    const secondTryServerId = await getServerId()
    return secondTryServerId
  }
}
const serverId = await initializeServerId()
console.log('Server ID:', serverId)
export { serverId }
