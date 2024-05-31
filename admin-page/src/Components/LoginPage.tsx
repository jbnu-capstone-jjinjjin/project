import { Container, Button, Title } from '@mantine/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'

import { auth } from '../firebase-config'

export default function LoginPage() {
  const [user, loading, error] = useAuthState(auth)

  const handleLogin = () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  }

  if (loading) {
    return <Container>로 딩 중 ...</Container>
  }

  if (error) {
    return <Container>에러: {error.message}</Container>
  }

  if (user) {
    return (
      <Container>
        로그인이 되어있습니다. user.displayName: {user.displayName}
      </Container>
    )
  }

  return (
    <Container
      fluid
      style={
        { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Title order={1}>로그인</Title>
      <Button onClick={handleLogin} size="lg">
        구글 로그인
      </Button>
    </Container>
  )
}
