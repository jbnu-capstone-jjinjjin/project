import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

function MainPage() {
  const [token, setToken] = useState('');  // 토큰을 저장할 상태

  useEffect(() => {
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then(idToken => {
        setToken(idToken);  // 상태 업데이트
      }).catch(error => {
        console.error("Error fetching ID token:", error);
      });
    }
  }, []);

  return (
    <header id='header'>
      <h1>Welcome to the MainPage!</h1>
      <div>
        ID Token: {token}
      </div>
    </header>
  );
}

export default MainPage;
