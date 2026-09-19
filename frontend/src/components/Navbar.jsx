import React from 'react';

export default function Navbar({ onOpenAuth }) {
  return (
    <header className="simple-navbar">
      <div className="container nav-container">
        <a href="#" className="brand-wrapper">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <span className="brand-name">SEALNET</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#engines" className="nav-link">Placement Engines</a>
          <a href="#portals" className="nav-link">Institutional Portals</a>
          <a href="#architecture" className="nav-link">Architecture</a>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-outline" onClick={() => onOpenAuth('login')}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => onOpenAuth('register-student')}>
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
