import React from 'react';

export default function Hero({ onOpenAuth }) {
  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="hero-title">
          Campus Placements, <span>Engineered on Autopilot</span>
        </h1>

        <p className="hero-subtitle">
          Zero fake claims, database-level one-offer locks, and automated departmental governance.
        </p>

        <div className="hero-cta-group">
          <button className="btn btn-primary btn-lg" onClick={() => onOpenAuth('register-student')}>
            Get Started
          </button>
          <a href="#engines" className="btn btn-outline btn-lg">
            Explore Live Engines
          </a>
        </div>
      </div>
    </section>
  );
}
