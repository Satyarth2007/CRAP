import React, { useState } from 'react';

export default function HodProfileModal({ hodInfo, onClose }) {
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog hod-profile-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 1. Header: HoD Identity */}
        <div className="hod-profile-header">
          <div className="hod-profile-avatar-large">
            {hodInfo.initials || 'RK'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {hodInfo.name || 'Dr. Rajesh Kulkarni'}
              </h2>
              <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                HoD &middot; {hodInfo.departmentCode || 'CSE'}
              </span>
              <span className="badge-status badge-status-verified" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                Active Governance Authority
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {hodInfo.department || 'Department of Computer Science & Engineering'}
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>📧 <strong>{hodInfo.email || 'hod.cse@college.edu'}</strong></span>
              <span>🏢 Cabin: <strong>Academic Block A &middot; Room 304</strong></span>
              <span>📞 <strong>{hodInfo.phone || '+91 98450 11223'}</strong></span>
            </div>
          </div>
        </div>

        {downloadToast && (
          <div className="alert-box alert-success" style={{ marginBottom: '16px', fontSize: '0.85rem', padding: '10px 14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Department Placement Report (PDF) compiled and downloading...</span>
          </div>
        )}

        {/* 2. Mini Dashboard: Placed vs Unplaced Snapshot */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Cohort Placement Snapshot (Class of 2026)
            </h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Batch: <strong>180 Students</strong>
            </span>
          </div>

          <div className="hod-mini-dash-grid">
            <div className="hod-mini-dash-card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placed Candidates</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald)' }}>114</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)' }}>(63.3%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '63.3%', height: '100%', backgroundColor: 'var(--emerald)', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div className="hod-mini-dash-card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In Pipeline / Unplaced</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>66</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706' }}>(36.7%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '36.7%', height: '100%', backgroundColor: '#D97706', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          {/* Micro CTC summary row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-page)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Package</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>14.2 LPA</div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-page)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Package</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald)' }}>32.0 LPA (NVIDIA)</div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-page)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Offers Released</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>128 Offers</div>
            </div>
          </div>
        </div>

        {/* 3. Elimination Funnel: Konse Round Mein Bachhe Zyada Pele Gaye */}
        <div style={{ marginBottom: '22px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#991B1B' }}>
                Recruitment Elimination Audit (Round-wise Dropouts)
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '999px' }}>
              Key Department Bottlenecks
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Round 1 */}
            <div className="dropout-item" style={{ marginBottom: 0 }}>
              <div className="dropout-header">
                <span>1. Online Coding Assessment (OA / DSA)</span>
                <strong style={{ color: '#DC2626' }}>46% Filtered Out (52 students)</strong>
              </div>
              <div className="dropout-bar-track">
                <div className="dropout-bar-fill" style={{ width: '46%', backgroundColor: '#DC2626' }}></div>
              </div>
            </div>

            {/* Round 2 */}
            <div className="dropout-item" style={{ marginBottom: 0 }}>
              <div className="dropout-header">
                <span>2. Technical Interview 1 (Core CS / OS / DBMS)</span>
                <strong style={{ color: '#EA580C' }}>28% Filtered Out (31 students)</strong>
              </div>
              <div className="dropout-bar-track">
                <div className="dropout-bar-fill" style={{ width: '28%', backgroundColor: '#EA580C' }}></div>
              </div>
            </div>

            {/* Round 3 */}
            <div className="dropout-item" style={{ marginBottom: 0 }}>
              <div className="dropout-header">
                <span>3. Technical Interview 2 (System Design & Live Build)</span>
                <strong style={{ color: '#0284C7' }}>16% Filtered Out (18 students)</strong>
              </div>
              <div className="dropout-bar-track">
                <div className="dropout-bar-fill" style={{ width: '16%', backgroundColor: '#0284C7' }}></div>
              </div>
            </div>

            {/* Round 4 */}
            <div className="dropout-item" style={{ marginBottom: 0 }}>
              <div className="dropout-header">
                <span>4. HR / Managerial & Behavioral Round</span>
                <strong style={{ color: '#059669' }}>10% Filtered Out (11 students)</strong>
              </div>
              <div className="dropout-bar-track">
                <div className="dropout-bar-fill" style={{ width: '10%', backgroundColor: '#059669' }}></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#7F1D1D', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💡 <strong>HoD Actionable Note:</strong> Maximum elimination happens in Online Assessments. Recommending department weekly DSA speed test.</span>
          </div>
        </div>

        {/* 4. Year-on-Year (YoY) Department Growth Tracker */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Year-on-Year (YoY) Department Trajectory
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.72rem' }}>
                ▲ +10.9% 2-Yr Jump
              </span>
              <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', fontSize: '0.72rem' }}>
                ▲ +44.8% CTC Growth
              </span>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="yoy-table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Placement Rate</th>
                  <th>Average CTC</th>
                  <th>Top Recruiters</th>
                  <th>Status / Target</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>2023 - 2024</strong></td>
                  <td>52.4% (94 / 180)</td>
                  <td>9.8 LPA</td>
                  <td>16 Companies</td>
                  <td><span style={{ color: 'var(--text-muted)' }}>Archived Record</span></td>
                </tr>
                <tr>
                  <td><strong>2024 - 2025</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>58.1% (104 / 180)</span>
                      <small style={{ color: 'var(--emerald)', fontWeight: 700 }}>+5.7%</small>
                    </div>
                  </td>
                  <td>11.6 LPA <small style={{ color: 'var(--emerald)' }}>+18%</small></td>
                  <td>22 Companies</td>
                  <td><span style={{ color: 'var(--text-muted)' }}>Archived Record</span></td>
                </tr>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td><strong style={{ color: 'var(--primary)' }}>2025 - 2026 (Current)</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: 'var(--emerald)' }}>63.3% (114 / 180)</strong>
                      <small style={{ color: 'var(--emerald)', fontWeight: 700 }}>+5.2%</small>
                    </div>
                  </td>
                  <td><strong>14.2 LPA</strong> <small style={{ color: 'var(--emerald)' }}>+22%</small></td>
                  <td><strong>29 Companies</strong></td>
                  <td>
                    <span className="badge-status badge-status-verified" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                      🎯 On Track (Target 75%)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            onClick={handleDownload}
          >
            📥 Export Dept Annual Report (PDF)
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 20px' }}
            onClick={onClose}
          >
            Close Profile View
          </button>
        </div>
      </div>
    </div>
  );
}
