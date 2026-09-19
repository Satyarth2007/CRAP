import React from 'react';

export default function TpoProfileModal({ tpoInfo, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog hod-profile-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="hod-profile-header">
          <div className="hod-profile-avatar-large" style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}>
            {tpoInfo.initials || 'SN'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {tpoInfo.name || 'Dr. Suresh Nair'}
              </h2>
              <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                Dean &middot; Placement & Training
              </span>
              <span className="badge-status badge-status-verified" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                Master Administration Authority
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {tpoInfo.institution || 'RV Institute of Technology & Management'}
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>📧 <strong>{tpoInfo.email || 'tpo@college.edu'}</strong></span>
              <span>🏢 Office: <strong>Central Placement Cell &middot; Floor 4</strong></span>
              <span>📞 <strong>+91 98440 99887</strong></span>
            </div>
          </div>
        </div>

        {/* Institution Highlights */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
            Institutional Accreditation & Campus Standing
          </h3>
          <div className="telemetry-meta-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="meta-box">
              <div className="meta-box-label">NAAC Accreditation</div>
              <div className="meta-box-val" style={{ color: 'var(--emerald)' }}>Grade A++ (3.72)</div>
            </div>
            <div className="meta-box">
              <div className="meta-box-label">NBA Tier Status</div>
              <div className="meta-box-val" style={{ color: 'var(--primary)' }}>Tier-1 Accredited</div>
            </div>
            <div className="meta-box">
              <div className="meta-box-label">Campus Placement Rank</div>
              <div className="meta-box-val">State Top 5</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px 18px', borderRadius: '14px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>2025-26 Placement Milestone Target</span>
            <strong style={{ color: 'var(--emerald)', fontSize: '1rem' }}>75.3% / 85.0% Target</strong>
          </div>
          <div style={{ height: '10px', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: '88.5%', height: '100%', background: 'linear-gradient(90deg, #4F46E5 0%, #10B981 100%)' }}></div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0' }}>
            542 of 720 eligible candidates across all 6 departments have accepted verifiable single-offers.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Profile View
          </button>
        </div>
      </div>
    </div>
  );
}
