import React from 'react';

export default function StudentOverview({ studentInfo, drives, applications, onNavigateTab }) {
  const eligibleCount = drives.filter(d => studentInfo.cgpa >= d.minCgpa).length;
  const activeAppsCount = applications.filter(a => a.status !== 'Rejected').length;

  return (
    <div className="student-tab-content">
      {/* Welcome Banner */}
      <div className="student-welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Welcome back, {studentInfo.name.split(' ')[0]}
            </h1>
            <span className="badge-tag badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              HoD Verified
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            {studentInfo.department} &middot; Roll No: <strong>{studentInfo.rollNumber}</strong> &middot; Batch: <strong>2026</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => onNavigateTab('drives')}>
            Explore Drives ({eligibleCount})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="student-metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Verified CGPA</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value">{studentInfo.cgpa}</div>
          <div className="metric-footer" style={{ color: 'var(--emerald)' }}>
            <span style={{ fontWeight: 600 }}>0 Active Backlogs</span> &middot; Tamper-Proof
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Eligible Drives</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value">{eligibleCount}</div>
          <div className="metric-footer" style={{ color: 'var(--text-muted)' }}>
            Out of {drives.length} total active company drives
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Applications</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
          </div>
          <div className="metric-value">{activeAppsCount}</div>
          <div className="metric-footer" style={{ color: 'var(--text-muted)' }}>
            2 in Interview Stage &middot; 1 OA cleared
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">One-Offer Policy</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem', paddingTop: '4px' }}>
            Dream Tier
          </div>
          <div className="metric-footer" style={{ color: 'var(--emerald)' }}>
            Unlocked for CTC &gt; 12 LPA
          </div>
        </div>
      </div>

      {/* Two Column Section: Upcoming Deadlines & Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Left Column: Upcoming Interview & Assessment Schedule */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Upcoming Rounds & Tests</h3>
            <button className="form-switch-btn" onClick={() => onNavigateTab('applications')}>
              View All Pipeline &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="schedule-item">
              <div className="schedule-date-badge">
                <span className="schedule-month">SEP</span>
                <span className="schedule-day">21</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Google &middot; Technical Round 1</h4>
                  <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>Virtual Meet</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>
                  Role: Software Engineer (28 LPA) &middot; Time: 10:30 AM - 11:30 AM
                </p>
              </div>
            </div>

            <div className="schedule-item">
              <div className="schedule-date-badge" style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                <span className="schedule-month">SEP</span>
                <span className="schedule-day">23</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Amazon &middot; Online Assessment (OA)</h4>
                  <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)' }}>HackerEarth</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>
                  Role: SDE-1 (22 LPA) &middot; Slot Closes: 11:59 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Policy Card */}
        <div className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="section-tag" style={{ margin: '0 0 12px' }}>INSTITUTIONAL GOVERNANCE</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '8px 0 8px' }}>One-Offer Mutex Rule</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              SEALNET enforces a strict database lock once an offer is accepted. Students with an offer &lt; 10 LPA may compete for Dream Tier companies (&gt; 12 LPA) only.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Department Gatekeeper:</span>
              <strong style={{ color: 'var(--text-main)' }}>Dr. Rajesh Kulkarni (HoD CSE)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>Active Clearance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
