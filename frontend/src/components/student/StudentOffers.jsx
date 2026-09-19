import React, { useState } from 'react';

export default function StudentOffers({ offers, studentInfo }) {
  const [activeOffers, setActiveOffers] = useState(offers);
  const [feedback, setFeedback] = useState('');

  const handleAcceptOffer = (offerId) => {
    setActiveOffers(activeOffers.map(o => o.id === offerId ? { ...o, status: 'Accepted' } : o));
    setFeedback('Offer officially accepted! Your profile is now locked for standard tier drives per institutional policy.');
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Offers & One-Offer Policy Lock
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Official institutional job offers and database-level policy governance status.
        </p>
      </div>

      {feedback && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{feedback}</span>
        </div>
      )}

      {/* Offers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {activeOffers.map((offer) => (
          <div key={offer.id} className="bento-card" style={{ padding: '24px', borderLeft: '4px solid var(--emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="drive-company-avatar" style={{ width: '48px', height: '48px', fontSize: '1.3rem', backgroundColor: '#ECFDF5', color: 'var(--emerald)' }}>
                  {offer.company.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{offer.company}</h3>
                    <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)', fontWeight: 700 }}>
                      Official Offer
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '2px 0 0' }}>
                    Role: <strong>{offer.role}</strong> &middot; Department: {studentInfo.departmentCode || 'CSE'}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="drive-ctc-pill" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  {offer.ctc}
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                  Offer Released: {offer.date}
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-page)', padding: '14px 18px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Joining Location: </span>
                <strong style={{ fontSize: '0.9rem' }}>{offer.location || 'Bengaluru, India'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Base Compensation: </span>
                <strong style={{ fontSize: '0.9rem' }}>{offer.base || '18.0 LPA'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Offer Status: </span>
                <strong style={{ color: offer.status === 'Accepted' ? 'var(--emerald)' : 'var(--primary)' }}>
                  {offer.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
                onClick={() => alert(`Opening Offer Letter Document for ${offer.company}`)}
              >
                View Official Offer Letter (PDF) &rarr;
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {offer.status !== 'Accepted' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAcceptOffer(offer.id)}
                  >
                    Accept Offer & Lock Profile
                  </button>
                ) : (
                  <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)', fontSize: '0.88rem', padding: '8px 16px', fontWeight: 700 }}>
                    ✓ Offer Accepted & Logged
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {activeOffers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>No job offers received yet. Check active drives and interview schedules!</p>
          </div>
        )}
      </div>

      {/* Policy Governance Explainer Card */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ padding: '6px', backgroundColor: '#EEF2FF', borderRadius: '6px', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Institutional One-Offer Lock Architecture</h3>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 16px' }}>
          To guarantee 100% fair placement access across the student body, SEALNET enforces atomic database locks:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-page)', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-main)' }}>1. Single Standard Lock</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Accepting an offer under 10 LPA locks your candidacy for all other standard drives, preventing offer hoarding.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--bg-page)', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-main)' }}>2. Dream Tier Upgrade</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Students holding an active offer are eligible to apply exclusively for Dream Tier drives offering CTC &ge; 1.5x of their current offer.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--bg-page)', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-main)' }}>3. HoD Audit Gate</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              All offer acceptances and release confirmations are audited in real time by your departmental Head of Department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
