import axios, { AxiosError } from 'axios'
import { machineId } from 'node-machine-id'

import { config } from './getConfig'

const localMachineId = machineId(true)

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_MACHINES_ENDPOINT = process.env.REACT_APP_MACHINES_ENDPOINT
const REACT_APP_CLIENT_TYPE = process.env.REACT_APP_CLIENT_TYPE

const MACHINES_ENDPOINT = `${REACT_APP_API_BASE_URL}${REACT_APP_MACHINES_ENDPOINT}`
const LOCAL_MACHINE_ID_URL_ENDPOINT = `${MACHINES_ENDPOINT}/<${localMachineId}>?type=${REACT_APP_CLIENT_TYPE}`

/**
 * 1. GET /machines/:id?type=clientType
 * 2-1. If the machineId exists, return the machineId
 * 2-2. If the machineId does not exist, POST /machines with the clientType Return the machineId
 */

async function initializeServerId() {
  try {
    let response = await axios.get(LOCAL_MACHINE_ID_URL_ENDPOINT)
    if (response.data.data.id) {
      return response.data.data.id // 등록된 로컬 ID가 있으면 반환
    } else {
      await axios.post(MACHINES_ENDPOINT, {
        mahcineName: config.pc_name,
        uuid: localMachineId,
      }) // 등록된 로컬 ID가 없으면 등록
      response = await axios.get(LOCAL_MACHINE_ID_URL_ENDPOINT)

      return response.data.data.id // 다시 확인하여 등록된 로컬 ID 반환
    }
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.response) {
      console.error('Fail get server response:', err.response.status)
    } else if (err.request) {
      console.error('No response received:', err.request)
    } else {
      console.error('Error setting up the request:', err.message)
    }
  }
}

const serverId = await initializeServerId()

export { serverId }
