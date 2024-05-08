import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { User } from 'firebase/auth';

export default function MainPage() {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        user.getIdToken().then((idToken: string) => {
          setToken(idToken);
          setLoading(false);
        }).catch((error: any) => {
          console.error("Error fetching ID token:", error);
          setError('Failed to fetch ID token');
          setLoading(false);
        });
      } else {
        setLoading(false);
        setToken('');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <header id='header'>
      <h1>Welcome to the MainPage!</h1>
      <div>
        {token ? `ID Token: ${token}` : "No token available"}
      </div>
    </header>
  );
}


