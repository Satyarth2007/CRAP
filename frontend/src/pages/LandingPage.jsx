import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CommandCenter from '../components/CommandCenter';
import RoleShowcase from '../components/RoleShowcase';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function LandingPage({ onNavigate }) {
  const [authModalMode, setAuthModalMode] = useState(null); // null | 'login' | 'register-student' | 'register-tpo'

  return (
    <div>
      <Navbar onOpenAuth={(mode) => setAuthModalMode(mode)} />
      <Hero onOpenAuth={(mode) => setAuthModalMode(mode)} />
      <CommandCenter />
      <RoleShowcase onOpenAuth={(mode) => setAuthModalMode(mode)} />
      <Footer onOpenAuth={(mode) => setAuthModalMode(mode)} />

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
