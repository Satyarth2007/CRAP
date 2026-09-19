import React from 'react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer id="architecture" className="site-footer">
      <div className="container">
        <div className="footer-content-wrap">
          {/* Left Side: Brand */}
          <div className="footer-brand">
            <a href="#" className="brand-wrapper">
              <div className="brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="brand-name">SEALNET</span>
            </a>
            <p className="footer-desc">
              Single-college campus recruitment automation and offer-governance infrastructure for higher-education institutions.
            </p>
            <div className="footer-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>AICTE & Accreditation Aligned</span>
            </div>
          </div>

          {/* Right Side: Exactly matching user sketch */}
          <div className="footer-columns-group">
            {/* Column 1: Products */}
            <div className="footer-column">
              <h5 className="footer-col-title">Products</h5>
              <ul className="footer-links-list">
                <li><a href="#engines" className="footer-link-item">Placement Engine</a></li>
                <li><a href="#portals" className="footer-link-item">Institutional Portals</a></li>
                <li><a href="#architecture" className="footer-link-item">Architecture</a></li>
              </ul>
            </div>

            {/* Column 2: How it works */}
            <div className="footer-column">
              <h5 className="footer-col-title">How it works</h5>
              <ul className="footer-links-list">
                <li><a href="#engines" className="footer-link-item">Automated Eligibility</a></li>
                <li><a href="#engines" className="footer-link-item">One-Offer Mutex</a></li>
                <li><a href="#portals" className="footer-link-item">Round Progression</a></li>
              </ul>
            </div>

            {/* Column 3: Actions Column (GET STARTED & LOGIN) */}
            <div className="footer-column footer-cta-column">
              <button className="btn btn-primary footer-cta-btn" onClick={() => onOpenAuth('register-student')}>
                GET STARTED
              </button>
              <button className="footer-login-btn" onClick={() => onOpenAuth('login')}>
                LOGIN
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026 SealNet Campus Recruitment Automation Infrastructure. All rights reserved.
          </div>
          <div className="system-status-indicator">
            <span className="pulse-dot"></span>
            <span>All Institutional Services Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
