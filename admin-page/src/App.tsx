import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { Container, Button } from '@mantine/core'

import { auth } from './firebase-config'
import Sidebar from './Components/Sidebar'
import MemberList from './Components/MemberList'
import MemberDetail from './Components/MemberDetails'
import { Member } from './Data/data'
import membersData from './Data/membersdata.json'
import Message from './Components/Message'

export default function App() {
  const [user, loading] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState<string | null>('memberManagement')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

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

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member)
  }

  const handleBack = () => {
    setSelectedMember(null)
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
          {activeTab === 'memberManagement' && !selectedMember && (
            <MemberList members={membersData} onViewDetails={handleViewDetails} />
          )}
          {activeTab === 'memberManagement' && selectedMember && (
            <MemberDetail member={selectedMember} onBack={handleBack} />
          )}
          {activeTab === 'message' && (
            <Container>
              <Message />
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  )
}
