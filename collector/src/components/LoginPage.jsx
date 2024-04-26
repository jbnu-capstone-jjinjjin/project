import React from 'react';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig'

const LoginPage = () => {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
