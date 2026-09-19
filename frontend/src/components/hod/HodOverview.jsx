import React from 'react';

export default function HodOverview({ hodInfo, students, onNavigateTab, onQuickVerify, onOpenProfile }) {
  const verifiedCount = students.filter(s => s.status === 'Verified').length;
  const pendingCount = students.filter(s => s.status === 'Pending').length;
  const flaggedCount = students.filter(s => s.status === 'Flagged').length;

  return (
    <div className="student-tab-content">
      {/* Welcome Banner */}
      <div className="student-welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Department of {hodInfo.department} ({hodInfo.departmentCode})
            </h1>
            <span className="badge-tag badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Academic Authority
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Head of Department: <strong>{hodInfo.name}</strong> &middot; Official Contact: <strong>{hodInfo.email}</strong> &middot; Batch: <strong>2026</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigateTab('roster')}>
            Review Verification Queue ({pendingCount})
          </button>
          {onOpenProfile && (
            <button className="btn btn-outline" onClick={onOpenProfile}>
              📊 View Dept Growth & Profile
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="student-metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Enrolled Students</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </span>
          </div>
          <div className="metric-value">180</div>
          <div className="metric-footer" style={{ color: 'var(--text-muted)' }}>
            Graduating Class of 2026 &middot; CSE
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Verified & Academic Locked</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="metric-value">{verifiedCount}</div>
          <div className="metric-footer" style={{ color: 'var(--emerald)', fontWeight: 600 }}>
            Tamper-Proof CGPA Locks Enforced
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pending Verifications</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
          </div>
          <div className="metric-value" style={{ color: pendingCount > 0 ? '#D97706' : 'inherit' }}>
            {pendingCount}
          </div>
          <div className="metric-footer" style={{ color: '#D97706', fontWeight: 600 }}>
            {pendingCount} Students Awaiting HoD Sign-off
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Placement Turnout</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#F0FDF4', color: '#059669' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value">63.3%</div>
          <div className="metric-footer" style={{ color: 'var(--emerald)' }}>
            114 Placed &middot; 14.2 LPA Avg CTC
          </div>
        </div>
      </div>

      {/* Two-Column Section: Urgent Queue + Placement Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Urgent Review Queue */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Urgent Verification Queue</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 0' }}>
                Candidates scheduled for upcoming drives requiring academic clearance
              </p>
            </div>
            <button className="form-switch-btn" onClick={() => onNavigateTab('roster')}>
              Open Full Desk &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {students.filter(s => s.status === 'Pending').slice(0, 3).map((std) => (
              <div key={std.id} className="schedule-item" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar-circle" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                    {std.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{std.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      USN: {std.usn} &middot; CGPA: <strong>{std.cgpa}</strong> &middot; Backlogs: {std.backlogs}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge-status badge-status-pending">Awaiting Review</span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => onQuickVerify(std.id)}
                  >
                    ✓ Quick Approve
                  </button>
                </div>
              </div>
            ))}

            {students.filter(s => s.status === 'Pending').length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--emerald)' }}>
                ✓ All departmental candidates have been verified and academic locks are active!
              </div>
            )}
          </div>
        </div>

        {/* Department Recruitment Stats */}
        <div className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="section-tag" style={{ margin: '0 0 12px' }}>DEPARTMENT PERFORMANCE</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '8px 0 8px' }}>Top Recruiters in {hodInfo.departmentCode}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 16px' }}>
              Offers distributed across Tier 1 Product and FinTech partners:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Amazon (AWS Cloud)</span>
                <strong>24 Placed (22.5 LPA)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Google Core Engineering</span>
                <strong>18 Placed (28.0 LPA)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Cisco Systems</span>
                <strong>16 Placed (18.0 LPA)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Goldman Sachs</span>
                <strong>8 Placed (24.0 LPA)</strong>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Highest Package:</span>
              <strong style={{ color: 'var(--emerald)', fontSize: '0.95rem' }}>NVIDIA · 32.0 LPA</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
