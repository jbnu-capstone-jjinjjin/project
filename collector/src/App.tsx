import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './firebaseConfig';

export default function App(): JSX.Element {
  const [user, loading, error] = useAuthState(auth);
  console.log("App: User:", user, "Loading:", loading, "Error:", error);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute user={user} loading={loading} error={error}>
            <MainPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}


