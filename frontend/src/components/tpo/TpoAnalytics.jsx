import React from 'react';

export default function TpoAnalytics({ tpoInfo, onNavigateTab }) {
  // Branch Analytics Dataset
  const branchData = [
    { code: 'CSE', name: 'Computer Science', total: 180, placed: 114, pct: 63.3, color: '#4F46E5' },
    { code: 'ISE', name: 'Information Science', total: 120, placed: 98, pct: 81.7, color: '#06B6D4' },
    { code: 'AI/ML', name: 'AI & Machine Learning', total: 60, placed: 56, pct: 93.3, color: '#10B981' },
    { code: 'ECE', name: 'Electronics & Comm', total: 180, placed: 142, pct: 78.9, color: '#F59E0B' },
    { code: 'MECH', name: 'Mechanical Engg', total: 100, placed: 74, pct: 74.0, color: '#8B5CF6' },
    { code: 'CIVIL', name: 'Civil Engineering', total: 80, placed: 58, pct: 72.5, color: '#EC4899' },
  ];

  // Salary Tier Breakdown Dataset
  const salaryTiers = [
    { tier: 'Super Dream Tier (> 20.0 LPA)', count: 68, pct: '12.5%', color: '#10B981', companies: 'Google, NVIDIA, Microsoft, Atlassian' },
    { tier: 'Dream Tier (12.0 - 20.0 LPA)', count: 194, pct: '35.8%', color: '#4F46E5', companies: 'Cisco, Oracle, Goldman Sachs, Amazon' },
    { tier: 'Core / Product Tier (7.0 - 12.0 LPA)', count: 215, pct: '39.7%', color: '#0284C7', companies: 'Bosch, Schneider, Texas Inst, JP Morgan' },
    { tier: 'Mass Recruitment (< 7.0 LPA)', count: 65, pct: '12.0%', color: '#64748B', companies: 'TCS Digital, Infosys SP, Cognizant' },
  ];

  // Monthly Placement Velocity
  const monthlyVelocity = [
    { month: 'Aug', offers: 42, height: '28%' },
    { month: 'Sep', offers: 112, height: '72%' },
    { month: 'Oct', offers: 158, height: '100%' }, // Peak
    { month: 'Nov', offers: 104, height: '66%' },
    { month: 'Dec', offers: 46, height: '30%' },
    { month: 'Jan', offers: 64, height: '41%' },
    { month: 'Feb', offers: 58, height: '37%' },
    { month: 'Mar', offers: 38, height: '24%' },
  ];

  return (
    <div className="student-tab-content">
      {/* Executive Welcome Banner */}
      <div className="student-welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Institutional Placement Command & Analytics
            </h1>
            <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
              ● Live Academic Session 2025-26
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Training & Placement Officer: <strong>{tpoInfo.name}</strong> &middot; Institution: <strong>{tpoInfo.institution || 'RV Institute of Technology & Management'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => onNavigateTab('hod-verify')}>
            HoD Verification Desk
          </button>
          <button className="btn btn-primary" onClick={() => onNavigateTab('drives')}>
            + Create / Manage Drives
          </button>
        </div>
      </div>

      {/* 4 Master KPI Cards */}
      <div className="tpo-kpi-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Cohort Pool</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </span>
          </div>
          <div className="metric-value">720</div>
          <div className="metric-footer" style={{ color: 'var(--text-muted)' }}>
            Across 6 Engineering Branches
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">College-Wide Placed</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="metric-value" style={{ color: 'var(--emerald)' }}>
            542 <small style={{ fontSize: '1rem', fontWeight: 600 }}>(75.3%)</small>
          </div>
          <div className="metric-footer" style={{ color: 'var(--emerald)', fontWeight: 600 }}>
            ▲ +8.4% YoY vs 2024-25
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Institutional Avg CTC</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value">13.8 LPA</div>
          <div className="metric-footer" style={{ color: '#D97706', fontWeight: 600 }}>
            Highest: <strong>44.0 LPA (Atlassian)</strong>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Campus Drives</span>
            <span className="metric-icon-wrapper" style={{ backgroundColor: '#F0FDF4', color: '#059669' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
          </div>
          <div className="metric-value">38</div>
          <div className="metric-footer" style={{ color: 'var(--emerald)' }}>
            142 Total Visiting Partners
          </div>
        </div>
      </div>

      {/* Row 1: Branch Comparison Bar Chart + Salary Tier Breakdown */}
      <div className="tpo-chart-grid">
        {/* Branch-wise Bar Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Branch-wise Placement Performance
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '3px 0 0' }}>
                Placed candidates vs batch capacity across all 6 departments
              </p>
            </div>
            <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
              Live HoD Verified Data
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {branchData.map((b) => (
              <div key={b.code} className="branch-bar-row">
                <div className="branch-bar-label">{b.code}</div>
                <div className="branch-bar-track">
                  <div
                    className="branch-bar-fill"
                    style={{
                      width: `${b.pct}%`,
                      backgroundColor: b.color
                    }}
                  >
                    {b.pct}%
                  </div>
                </div>
                <div style={{ width: '90px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <strong>{b.placed}</strong> / {b.total}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Top Performing Dept: <strong style={{ color: 'var(--emerald)' }}>AI/ML (93.3%)</strong></span>
            <span>Fastest Accelerating: <strong style={{ color: 'var(--primary)' }}>ISE (+12.4% YoY)</strong></span>
          </div>
        </div>

        {/* Salary Tier Funnel */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                CTC Tier Distribution
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '3px 0 0' }}>
                Institutional offer breakdown by compensation band
              </p>
            </div>
            <span className="badge-tag badge-verified">
              542 Offers
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {salaryTiers.map((t, idx) => (
              <div key={idx} className="salary-tier-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: t.color }}></span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{t.tier}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.companies}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.95rem', color: t.color }}>{t.count}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.pct}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Hiring Velocity Trend Curve + Sector Distribution */}
      <div className="tpo-chart-grid">
        {/* Monthly Hiring Curve */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Recruitment Velocity Curve (Offers Rolled per Month)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '3px 0 0' }}>
                Hiring momentum peaking during Tier-1 on-campus season
              </p>
            </div>
            <span className="badge-tag" style={{ backgroundColor: '#F0FDF4', color: '#059669' }}>
              Peak: Oct (158 Offers)
            </span>
          </div>

          {/* Pure CSS Bar Visualizer for Monthly Offers */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '10px 10px 0', borderBottom: '2px solid #E2E8F0' }}>
            {monthlyVelocity.map((m) => (
              <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{m.offers}</span>
                <div
                  style={{
                    width: '32px',
                    height: m.height,
                    background: 'linear-gradient(180deg, #4F46E5 0%, #818CF8 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`${m.month}: ${m.offers} offers rolled out`}
                ></div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Sector Distribution */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Recruiting Sector Breakdown
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '3px 0 0' }}>
                Industry distribution of hiring partners
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center', height: '100%' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <strong>Product Platforms & SaaS</strong>
                <span>42% (60 Partners)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#4F46E5' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <strong>FinTech, High-Frequency Trading & Banking</strong>
                <span>26% (37 Partners)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ width: '26%', height: '100%', backgroundColor: '#06B6D4' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <strong>Cloud Platforms & Cybersecurity</strong>
                <span>18% (25 Partners)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', backgroundColor: '#10B981' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <strong>Core Engineering & Semiconductor</strong>
                <span>14% (20 Partners)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ width: '14%', height: '100%', backgroundColor: '#F59E0B' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
