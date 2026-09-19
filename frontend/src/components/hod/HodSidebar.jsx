import React from 'react';

export default function HodSidebar({ activeTab, onSelectTab, onNavigate, hodInfo, onOpenProfile }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Department Overview',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      )
    },
    {
      id: 'roster',
      label: 'Student Verification Desk',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'exceptions',
      label: 'Backlog Condonations',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <polyline points="9 15 11 17 15 13"></polyline>
        </svg>
      )
    },
    {
      id: 'drives',
      label: 'Department Turnout & Drives',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      id: 'mutex',
      label: 'Offer Approvals & Mutex',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <circle cx="12" cy="11" r="2.5"></circle>
        </svg>
      )
    }
  ];

  return (
    <aside className="student-dock-sidebar">
      {/* Top Brand Logo */}
      <div className="dock-brand" title="SEALNET HoD Governance" onClick={() => onSelectTab('overview')}>
        <div className="dock-brand-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hodSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="hodSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M16 3L27 8.5V17.5C27 23.8 22.3 29.2 16 31C9.7 29.2 5 23.8 5 17.5V8.5L16 3Z" fill="url(#hodSealGrad)" />
            <path d="M16 3L27 8.5V17.5C27 23.8 22.3 29.2 16 31C9.7 29.2 5 23.8 5 17.5V8.5L16 3Z" fill="url(#hodSheen)" />
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
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)', cursor: 'pointer' }}
            title={`View ${hodInfo.name} Profile & Analytics`}
            onClick={() => onOpenProfile ? onOpenProfile() : onSelectTab('overview')}
          >
            {hodInfo.initials || 'RK'}
          </div>
          <div className="dock-tooltip">
            {hodInfo.name} &middot; View Profile & Dept Growth
          </div>
        </div>
      </div>
    </aside>
  );
}
