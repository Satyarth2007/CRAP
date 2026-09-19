import React from 'react';

export default function HodDrives({ drives, hodInfo }) {
  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Visiting Placement Drives & {hodInfo.departmentCode} Turnout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Real-time departmental candidate registration turnout, round-by-round qualification funnel, and cutoffs.
        </p>
      </div>

      <div className="drives-grid">
        {drives.map((drive) => (
          <div key={drive.id} className="drive-card">
            <div className="drive-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="drive-company-avatar" style={{ backgroundColor: drive.badgeColor || '#EEF2FF' }}>
                  {drive.company.charAt(0)}
                </div>
                <div>
                  <h3 className="drive-company-name">{drive.company}</h3>
                  <span className="drive-role">{drive.role}</span>
                </div>
              </div>

              <div className="drive-ctc-pill">
                {drive.ctc}
              </div>
            </div>

            <div className="drive-criteria-chips">
              <span className="criteria-chip">
                Min CGPA: <strong>{drive.minCgpa}</strong>
              </span>
              <span className="criteria-chip">
                {hodInfo.departmentCode} Turnout: <strong>{drive.turnout || '94%'}</strong>
              </span>
              <span className="criteria-chip">
                Shortlisted: <strong>{drive.shortlisted || 14} Candidates</strong>
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-page)', padding: '12px 14px', borderRadius: '10px', margin: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Eligible {hodInfo.departmentCode} Pool:</span>
                <strong>{drive.eligibleCount || 142} Students</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hiring Funnel:</span>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{drive.funnelStage || 'Technical Rounds Active'}</span>
              </div>
            </div>

            <div className="drive-card-footer">
              <span className="badge-tag badge-verified">
                ● HoD Verification Enforced
              </span>

              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => alert(`Exporting ${hodInfo.departmentCode} shortlisted roster for ${drive.company}`)}
              >
                View Candidates &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
