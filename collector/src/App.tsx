import { useEffect, useState } from 'react'
import { useSSE } from 'react-hooks-sse'

import MainPage from './components/MainPage'
import { Config, getConfig } from './util/loadConfig'
import { setupTray } from './util/traySetup'
import { echoServer } from './util/echoServer'

const handleConrolEvent = async (event: { type: string; pid?:number }) => {
  console.log('Event:', event)
  try {
    switch (event.type) {
      case 'KILL_PROCESS':
        console.log('KILL_PROCESS')
        break
      case 'RESTART_PROCESS':
        console.log('RESTART_PROCESS')
        break
      case 'TAKE_SCREENSHOT':
        console.log('TAKE_SCREENSHOT')
        break
      default:
        console.log('Unknown event type:', event.type)
    }
  } catch (error) {
    console.error('Error handling control event:', error)
  }
}

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [timeStamp, setTimeStamp] = useState<string>('')
  const [config, setConfig] = useState<Config | null>(null)
  const sseEvent = useSSE('PC_CONTROL_EVNET', { type: 'init' })

  useEffect(() => {
    const setUpConfig = async () => {
      try {
        const configData = await getConfig()
        setConfig(configData)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
    const checkConnection = async () => {
      setTimeStamp(new Date().toISOString())
      setIsConnected(await echoServer())
    }
    setUpConfig()
    checkConnection()

    // 타이머 설정
    const timer = setInterval(checkConnection, config?.interval ?? 300000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    setupTray(isConnected)
  }, [isConnected])

  useEffect(() => {
    if (sseEvent.type !== 'init') {
      handleConrolEvent(sseEvent)
    }
  }, [sseEvent])

  if (isConnected === null) {
    return <p>Loading...</p>
  }

  return (
    isConnected
      ? (<MainPage timeStamp={timeStamp} />)
      : (<>Not connected</>)
  )
}

export default App
