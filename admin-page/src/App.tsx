import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { Container, Button } from '@mantine/core'
import { QueryClient, QueryClientProvider } from 'react-query'

import { auth } from './firebase-config'
import Sidebar from './Components/Sidebar'
import MachineList from './Components/MachineList'
import MachineDetails from './Components/MachineDetails'
import Message from './Components/Message'

const queryClient = new QueryClient()

export default function App() {
  const [user, loading] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState<string | null>('machineManagement')
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)

  const handleLogin = () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  }

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert('로그아웃 성공')
    }).catch((error: Error) => {
      alert('로그아웃 실패: ' + error.message)
    })
  }

  const handleViewDetails = (machineId: number) => {
    setSelectedMachine(machineId)
  }

  const handleBack = () => {
    setSelectedMachine(null)
  }

  if (loading) {
    return <Container> 로 딩 중 . . .</Container>
  }

  if (!user) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Please Log in</h1>
        <Button onClick={handleLogin} style={{ fontSize: '30px' }}>
          구글 로그인
        </Button>
      </Container>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Container style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '10px 20px',
            background: '#f5f5f5',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Container style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <span>Welcome, {user ? (user.displayName + ' UID : ' + user.uid) : 'No Name'}</span>
            <Button onClick={handleLogout} style={{ fontSize: '12px' }}>로그아웃</Button>
          </Container>
        </Container>
        <Container style={{ display: 'flex', flex: 1 }}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <Container style={{ flex: 1, padding: '20px' }}>
            {activeTab === 'machineManagement' && !selectedMachine && (
              <MachineList onViewDetails={handleViewDetails} />
            )}
            {activeTab === 'machineManagement' && selectedMachine && (
              <MachineDetails machineId={selectedMachine} onBack={handleBack} />
            )}
            {activeTab === 'message' && (
              <Message />
            )}
          </Container>
        </Container>
      </Container>
    </QueryClientProvider>
  )
}
