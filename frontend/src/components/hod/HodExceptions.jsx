import React, { useState } from 'react';

export default function HodExceptions({ exceptions, onApproveException, onRejectException }) {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Backlog Condonation & Special Exemptions Desk
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Adjudicate student appeals for special placement clearance (medical leave condonation, supplementary exam clearance).
        </p>
      </div>

      {toast && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toast}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {exceptions.map((item) => (
          <div key={item.id} className="exception-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{item.studentName}</h3>
                  <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                    USN: {item.usn}
                  </span>
                  <span className={`badge-status ${
                    item.status === 'Approved' ? 'badge-status-verified' :
                    item.status === 'Rejected' ? 'badge-status-flagged' : 'badge-status-pending'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  Semester: <strong>{item.semester}</strong> &middot; Category: <strong>{item.category}</strong> &middot; Filed on: {item.date}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  onClick={() => alert(`Opening official verified supporting document PDF for ${item.studentName}`)}
                >
                  Inspect Document (PDF) &rarr;
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-page)', padding: '14px 18px', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Student Ground for Condonation
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                {item.reason}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Institutional Policy: Approval grants one-time exemption to bypass drive cutoffs.
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                {item.status !== 'Approved' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    onClick={() => {
                      onApproveException(item.id);
                      showToast(`Condonation approved for ${item.studentName}. Candidate unlocked for recruitment drives.`);
                    }}
                  >
                    ✓ Grant Exemption & Clear
                  </button>
                )}

                {item.status !== 'Rejected' && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#DC2626', borderColor: '#FECACA' }}
                    onClick={() => {
                      onRejectException(item.id);
                      showToast(`Exemption rejected for ${item.studentName}.`);
                    }}
                  >
                    ✕ Reject Request
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
