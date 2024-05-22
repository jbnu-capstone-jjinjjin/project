import { useEffect, useState } from 'react'

import MainPage from './components/MainPage'
import { Config, getConfig } from './util/loadConfig'
import { setupTray } from './util/traySetup'
import { echoServer } from './util/echoServer'

function App() {
  // 1. 상태 선언 (State Declaration)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [timeStamp, setTimeStamp] = useState<string>('')
  const [config, setConfig] = useState<Config | null>(null)

  // 4. 사이드 이펙트 (useEffect)
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

  if (config === null) {
    return <div>Loading...</div>
  }

  return isConnected
    ? (<MainPage timeStamp={timeStamp} />)
    : (<>Not connected</>)
}

export default App
