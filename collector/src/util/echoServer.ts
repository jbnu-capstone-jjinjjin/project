import axios, { AxiosError } from 'axios'
import { config } from 'dotenv'

config()
const API_URL = process.env.API_URL || 'http://localhost:8080'

async function echoServer(): Promise<boolean> {
  try {
    console.log('=== Start get server response ===')
    const machineResponse = await axios.get(`${API_URL}/echo`)
    const status = machineResponse.status

    if (status === 200) {
      console.log('\tget server response time', new Date().toISOString())
      console.log('=== Success get server response ===')

      return true
    } else {
      console.log('Fail get server response:', status)
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

  return false
}

export { echoServer }
