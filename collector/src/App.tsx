import { useEffect, useState } from 'react'
import { SSEProvider } from 'react-hooks-sse'

import MainPage from './components/MainPage'
import { config as localConfig, Config } from './util/getConfig'
import { setupTray } from './util/traySetup'
import { echoServer } from './util/echoServer'
import { serverId } from './util/serverIdSetup'

const SSE_ENDPOINT_WITH_ID = `${process.env.REACT_APP_API_BASE_URL}/api/daemon/connect?machineId=${serverId}`

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
    setUpConfig()
    checkConnection()
    // 타이머 설정
    const timer = setInterval(checkConnection, configState?.interval ?? 300000)

    return () => {
      clearInterval(timer)
    }
  }, [])// 처음 마우늩 될때만 실행
  useEffect(() => {
    setupTray(isConnected)
  }, [isConnected]) // isConnected가 바뀔때마다 실행

  if (isConnected === null) {
    return <p>Loading...</p>
  }

  return (
    <SSEProvider endpoint={`${SSE_ENDPOINT_WITH_ID}`}>
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
