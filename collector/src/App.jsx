// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './firebaseConfig.js';

function App() {
  const [user, loading, error] = useAuthState(auth);
  console.log("App: User:", user, "Loading:", loading, "Error:", error);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/" element={
          <ProtectedRoute user={user} loading={loading} error={error}>
            <MainPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
