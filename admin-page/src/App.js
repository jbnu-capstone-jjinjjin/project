import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase-config';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import Sidebar from './SideBar';

function App() {
  const [user, loading] = useAuthState(auth);


  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };


  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("로그아웃 성공");
    }).catch((error) => {
      alert("로그아웃 실패: " + error.message);
    });
  };

  if (loading) {
    return <div>로딩 중</div>;
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1>{user ? user.displayName : 'Please Log in'}</h1>
          <button onClick={handleLogin} style={{ fontSize: '30px' }}>
            구글 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <div>
          <button onClick={handleLogout} style={{ fontSize: '30px' }}>로그아웃</button>
          <h1>Welcome, {user.displayName}</h1>
          <h3>UID = {user.uid}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
