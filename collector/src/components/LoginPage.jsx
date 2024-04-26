import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Login Successful:", result.user);
        // 로그인 성공 후 메인 페이지로 리디렉션
        navigate('/');
      })
      .catch((error) => {
        console.error("Login Failed:", error);
      });
  };

  return (
    <header id='header'>
      <div>
        <h1>Hello world!</h1>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    </header>
  );
};
