import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, UserCredential, AuthError } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result: UserCredential) => {
        console.log("Login Successful:", result.user);
        navigate('/');
      })
      .catch((error: AuthError) => {
        console.error("Login Failed:", error);
        setErrorMessage("Failed to login. Please try again.");
        setLoading(false);
      });
  };

  return (
    <header id='header'>
      <div>
        <h1>Hello world!</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          aria-label="Login with Google"
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </header>
  );
};

