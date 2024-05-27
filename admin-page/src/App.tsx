import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { Container, Button, AppShell, Group } from '@mantine/core'
import { QueryClient, QueryClientProvider } from 'react-query'

import LoginPage from './Components/LoginPage'
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

  const switchTab = (tab: string | null) => {
    setSelectedMachine(null)
    if (tab) {
      setActiveTab(tab)
    }
  }
  if (loading) {
    return <Container> 로 딩 중 . . .</Container>
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        header={{ height: 40 }}
        navbar={{
          width: 150,
          breakpoint: 'sm',
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group justify="flex-end">
            <span>Welcome, {user ? (user.displayName + ' UID : ' + user.uid) : 'No Name'}</span>
            <Button onClick={handleLogout}>로그아웃</Button>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Sidebar activeTab={activeTab} onTabChange={switchTab} />
        </AppShell.Navbar>
        <AppShell.Main>
          {activeTab === 'machineManagement' && !selectedMachine && (
            <MachineList onViewDetails={handleViewDetails} />
          )}
          {activeTab === 'machineManagement' && selectedMachine && (
            <MachineDetails machineId={selectedMachine} onBack={handleBack} />
          )}
          {activeTab === 'message' && (
            <Message />
          )}
        </AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  )
}
