import { useEffect, useState } from 'react'
import { SSEProvider } from 'react-hooks-sse'
import axios from 'axios'

import MainPage from './components/MainPage'
import { config as localConfig, Config } from './util/getConfig'
import { setupTray } from './util/traySetup'
import { echoServer } from './util/echoServer'
import { serverId } from './util/serverIdSetup'

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_SSE_ENDPOINT = process.env.REACT_APP_SSE_ENDPOINT
const SSE_ENDPOINT = `${REACT_APP_API_BASE_URL}${REACT_APP_SSE_ENDPOINT}`
console.log(SSE_ENDPOINT)

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [timeStamp, setTimeStamp] = useState<string>('')
  const [configState, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    const setUpConfig = async () => {
      try {
        setConfig(localConfig)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
    const checkConnection = async () => {
      setTimeStamp(new Date().toISOString())
      setIsConnected(await echoServer())
    }
    const setUpSSEReceiver = async () => {
      try {
        console.log('Setting up SSE receiver...')
        console.log('Server ID:', serverId)
        const sseRespone = await axios.post(`${SSE_ENDPOINT}`, {
          machineId: serverId
        })
        console.log('Success setting up SSE receiver:', sseRespone.status)
      } catch (error) {
        console.error('Error setting up SSE receiver:', error)
      }
    }
    setUpConfig()
    checkConnection()
    setUpSSEReceiver()
    // 타이머 설정
    const timer = setInterval(checkConnection, configState?.interval ?? 300000)

    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    setupTray(isConnected)
  }, [isConnected])

  if (isConnected === null) {
    return <p>Loading...</p>
  }

  return (
    <SSEProvider endpoint={`${REACT_APP_SSE_ENDPOINT}`}>
      {isConnected
        ? (<MainPage timeStamp={timeStamp} />)
        : (<>Not connected</>)}
    </SSEProvider>
  )
}

// isConnected
//  ? (<MainPage timeStamp={timeStamp} />)
//  : (<>Not connected</>)

export default App
