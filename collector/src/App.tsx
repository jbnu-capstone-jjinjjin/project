import { useEffect, useState } from "react";


import { echoServer } from "./util/echoServer";
import MainPage from "./components/MainPage";
import { setupTray } from "./util/traySetup";

async function checkServerConnection(setIsConnected: (value: boolean) => void, setLastConnectTime: (time: string) => void) {
  const result = await echoServer();
  setIsConnected(result);
  if (result) {
    setLastConnectTime(new Date().toISOString()); // 연결 성공시 시간 업데이트
  }
}

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastConnectTime, setLastConnectTime] = useState<string>("");

  useEffect(() => {
    checkServerConnection(setIsConnected, setLastConnectTime); // 초기 연결 확인
    const interval = setInterval(() => {
      checkServerConnection(setIsConnected, setLastConnectTime); // 5분마다 연결 확인
    }, 300000); // 300000 = 5분
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  useEffect(() => {
    setupTray(isConnected); // 트레이 아이콘 설정
  }, [isConnected]);

  if (isConnected === null) {
    return <p>Loading...</p>;
  }

  return isConnected ? (
    <MainPage timeStamp={lastConnectTime}/> // MainPage에 마지막 연결 시간 전달
  ) : (
    <p>Unable to connect to server. Please check your connection and try again later.</p>
  );
}

export default App;
