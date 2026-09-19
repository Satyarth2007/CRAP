import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TpoDashboard from './pages/TpoDashboard';
import HodDashboard from './pages/HodDashboard';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [route, setRoute] = useState('/');

  const navigate = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      {route === '/' && <LandingPage onNavigate={navigate} />}
      {route === '/student' && <StudentDashboard onNavigate={navigate} />}
      {route === '/tpo' && <TpoDashboard onNavigate={navigate} />}
      {route === '/hod' && <HodDashboard onNavigate={navigate} />}
    </AuthProvider>
  );
}
