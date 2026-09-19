import React from 'react';

export default function TpoSidebar({ activeTab, onSelectTab, onNavigate, tpoInfo, onOpenProfile }) {
  const navItems = [
    {
      id: 'analytics',
      label: 'Institution Analytics & Graphs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'hod-verify',
      label: 'HoD Verification & Governance',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      )
    },
    {
      id: 'drives',
      label: 'Campus Drives & Creator',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      id: 'mutex-master',
      label: 'Single-Offer Mutex Control',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 'students-all',
      label: 'Master Student Pool',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <aside className="student-dock-sidebar">
      {/* Brand Emblem */}
      <div className="dock-brand" title="SEALNET TPO Command" onClick={() => onSelectTab('analytics')}>
        <div className="dock-brand-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tpoSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="tpoSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M16 3L27 8.5V17.5C27 23.8 22.3 29.2 16 31C9.7 29.2 5 23.8 5 17.5V8.5L16 3Z" fill="url(#tpoSealGrad)" />
            <path d="M16 3L27 8.5V17.5C27 23.8 22.3 29.2 16 31C9.7 29.2 5 23.8 5 17.5V8.5L16 3Z" fill="url(#tpoSheen)" />
            <path d="M20.5 11.5H14C12.6 11.5 11.5 12.6 11.5 14C11.5 15.4 12.6 16.5 14 16.5H18C19.4 16.5 20.5 17.6 20.5 19C20.5 20.4 19.4 21.5 18 21.5H11.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20.5" cy="11.5" r="1.5" fill="#38BDF8" />
            <circle cx="11.5" cy="21.5" r="1.5" fill="#A5B4FC" />
            <circle cx="16" cy="16.5" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="dock-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="dock-item-wrapper">
              {isActive && <span className="dock-active-pill" />}
              <button
                type="button"
                className={`dock-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
                aria-label={item.label}
              >
                {item.icon}
              </button>
              <div className="dock-tooltip">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="dock-footer">
        <div className="dock-item-wrapper">
          <button
            type="button"
            className="dock-btn dock-btn-exit"
            onClick={() => onNavigate('/')}
            aria-label="Exit to Home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
          <div className="dock-tooltip">
            Back to Home
          </div>
        </div>

        <div className="dock-item-wrapper" style={{ marginTop: '8px' }}>
          <div
            className="dock-avatar"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', cursor: 'pointer' }}
            title={`View ${tpoInfo.name} TPO Profile`}
            onClick={() => onOpenProfile ? onOpenProfile() : onSelectTab('analytics')}
          >
            {tpoInfo.initials || 'SN'}
          </div>
          <div className="dock-tooltip">
            {tpoInfo.name} &middot; Dean of Placements
          </div>
        </div>
      </div>
    </aside>
  );
}
