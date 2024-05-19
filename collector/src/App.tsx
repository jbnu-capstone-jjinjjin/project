import { useEffect, useState } from 'react'

import { echoServer } from './util/echoServer'
import { setupTray } from './util/traySetup'
import { loadConfig } from './util/loadConfig'
import MainPage from './components/MainPage'

async function checkServerConnection(
  setIsConnected: (value: boolean) => void, setLastConnectTime: (time: string) => void
) {
  const result = await echoServer()
  setIsConnected(result)
  if (result) {
    setLastConnectTime(new Date().toISOString()) // 연결 성공시 시간 업데이트
  }
}

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [lastConnectTime, setLastConnectTime] = useState<string>('')
  const config = loadConfig()

  useEffect(() => {
    /**
     * App 컴포넌트를 처음 마운트 할때 실행함
     * 초기 서버 연결을 확인하고 5분마다 연결 확인하는 함수를 실행함
     * 만일 App 컴포넌트가 언마운트된다면, 5분마다 확인하는 함수를 종료시킴
    */
    checkServerConnection(setIsConnected, setLastConnectTime) // 초기 연결 확인
    const interval = setInterval(() => {
      checkServerConnection(setIsConnected, setLastConnectTime) // 5분마다 연결 확인
    }, config.collection_interval) // 300000 = 5분
    return () => clearInterval(interval) // 컴포넌트 언마운트 시 인터벌 정리
  }, [])

  useEffect(() => {
    /**
     * 서버와 연결상태에 따른 아이콘 변경
     */
    setupTray(isConnected) // 트레이 아이콘 설정
  }, [isConnected])

  if (isConnected === null) {
    return <p>Loading...</p>
  }

  return isConnected
    ? (<MainPage timeStamp={lastConnectTime} />)
    : (<p>Unable to connect to server. Please check your connection and try again later.</p>)
}

export default App
