import React, { useState } from 'react';

export default function TpoMutexMaster({ placedOffers, tpoInfo }) {
  const [toast, setToast] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const filteredOffers = placedOffers.filter(offer => {
    const matchSearch = offer.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        offer.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        offer.company.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (branchFilter === 'all') return true;
    return offer.branch === branchFilter;
  });

  return (
    <div className="student-tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Single-Offer Mutex Control & Master Audit Ledger
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            SEALNET database mutex locks preventing multi-offer hoarding and ensuring maximum opportunity distribution across the cohort.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => showToast('Master Institutional Placement Ledger (CSV) downloaded successfully!')}
          >
            Export Master Institutional Ledger (CSV)
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

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search candidate, USN, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${branchFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            onClick={() => setBranchFilter('all')}
          >
            All Branches
          </button>
          {['CSE', 'ISE', 'AI/ML', 'ECE', 'MECH', 'CIVIL'].map(b => (
            <button
              key={b}
              type="button"
              className={`btn ${branchFilter === b ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => setBranchFilter(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Mutex Master Table */}
      <div className="hod-table-card" style={{ marginBottom: '28px' }}>
        <div className="table-responsive">
          <table className="hod-table">
            <thead>
              <tr>
                <th>Candidate & USN</th>
                <th>Branch</th>
                <th>Recruiter & Role</th>
                <th>Package (CTC)</th>
                <th>Offer Tier</th>
                <th>Database Mutex Lock</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer.id}>
                  <td>
                    <strong style={{ fontSize: '0.92rem' }}>{offer.studentName}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{offer.usn}</div>
                  </td>
                  <td>
                    <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                      {offer.branch}
                    </span>
                  </td>
                  <td>
                    <strong>{offer.company}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{offer.role}</div>
                  </td>
                  <td>
                    <span className="drive-ctc-pill" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                      {offer.ctc}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tag" style={{ backgroundColor: '#F0FDF4', color: '#059669' }}>
                      {offer.tier}
                    </span>
                  </td>
                  <td>
                    <span className="badge-status badge-status-verified">
                      🔒 Mutex Constraint Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Assurance */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ padding: '6px', backgroundColor: '#ECFDF5', borderRadius: '6px', color: 'var(--emerald)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>TPO Single-Offer Mutex Enforcement</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
          SEALNET operates with an institutional single-offer mutex constraint. Once a student from any department accepts a standard placement offer, concurrent drive applications are immediately locked to prevent seat hoarding. Upgrades are only permitted into authorized "Super Dream" (>20 LPA) tiers with TPO sign-off.
        </p>
      </div>
    </div>
  );
}
