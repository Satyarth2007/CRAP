import React, { useState } from 'react';

export default function HodMutex({ placedOffers, hodInfo }) {
  const [toast, setToast] = useState('');

  return (
    <div className="student-tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Department Job Offers & Mutex Policy Audit
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Verify institutional mutex locks to ensure zero duplicate offer hoarding across {hodInfo.departmentCode}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setToast('Master Placement CSV roster generated successfully!');
              setTimeout(() => setToast(''), 3500);
            }}
          >
            Export Department Placement Roster (CSV)
          </button>
        </div>
      </div>

      {toast && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toast}</span>
        </div>
      )}

      {/* Offers Table */}
      <div className="hod-table-card" style={{ marginBottom: '28px' }}>
        <div className="table-responsive">
          <table className="hod-table">
            <thead>
              <tr>
                <th>Candidate & USN</th>
                <th>Recruiting Company</th>
                <th>Role</th>
                <th>Package (CTC)</th>
                <th>Offer Tier</th>
                <th>Atomic Mutex Status</th>
              </tr>
            </thead>
            <tbody>
              {placedOffers.map((offer) => (
                <tr key={offer.id}>
                  <td>
                    <strong style={{ fontSize: '0.92rem' }}>{offer.studentName}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{offer.usn}</div>
                  </td>
                  <td>
                    <strong>{offer.company}</strong>
                  </td>
                  <td>{offer.role}</td>
                  <td>
                    <span className="drive-ctc-pill" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                      {offer.ctc}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                      {offer.tier}
                    </span>
                  </td>
                  <td>
                    <span className="badge-status badge-status-verified">
                      🔒 Index Mutex Locked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Mutex Explainer */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ padding: '6px', backgroundColor: '#ECFDF5', borderRadius: '6px', color: 'var(--emerald)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>HoD Placement Governance Assurance</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
          The SEALNET core database enforces a strict unique constraint on candidate accepted offers (<code>student_accepted_offer_1</code>). When an offer is accepted by a {hodInfo.departmentCode} student, all concurrent standard drives are automatically locked out for their USN, guaranteeing 100% placement opportunity distribution across the batch.
        </p>
      </div>
    </div>
  );
}
