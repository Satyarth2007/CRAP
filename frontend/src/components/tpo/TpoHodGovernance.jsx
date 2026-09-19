import React, { useState } from 'react';

export default function TpoHodGovernance({ hodList, onUpdateHodStatus, onApproveAllHods }) {
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredHods = hodList.filter((h) => {
    const match = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  h.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  h.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (!match) return false;
    if (filter === 'all') return true;
    return h.status.toLowerCase() === filter.toLowerCase();
  });

  const pendingCount = hodList.filter(h => h.status === 'Pending').length;

  return (
    <div className="student-tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Departmental HoD Verification & Governance Desk
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Verify and legally empower Department Heads to lock student credentials, clear condonations, and authorize placement rosters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {pendingCount > 0 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onApproveAllHods();
                showToast(`Verified all ${pendingCount} Department Heads with institutional authority!`);
              }}
            >
              ✓ Authorize All Pending HoDs ({pendingCount})
            </button>
          )}
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

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search HoD by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('all')}
          >
            All HoDs ({hodList.length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('pending')}
          >
            Pending ({hodList.filter(h => h.status === 'Pending').length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('verified')}
          >
            Verified ({hodList.filter(h => h.status === 'Verified').length})
          </button>
        </div>
      </div>

      {/* HoD Table */}
      <div className="hod-table-card">
        <div className="table-responsive">
          <table className="hod-table">
            <thead>
              <tr>
                <th>Department Head</th>
                <th>Department & Code</th>
                <th>Institutional Email</th>
                <th>Roster Readiness</th>
                <th>HoD Accreditation Status</th>
                <th style={{ textAlign: 'right' }}>TPO Governance Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHods.map((hod) => (
                <tr key={hod.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar-circle" style={{ width: '36px', height: '36px', fontSize: '0.82rem', backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                        {hod.initials || hod.name.split(' ').pop().charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.94rem' }}>{hod.name}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{hod.designation || 'Head of Department'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.9rem' }}>{hod.department}</strong>
                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>Code: {hod.code}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{hod.email}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: hod.readinessPct >= 80 ? 'var(--emerald)' : '#D97706' }}>
                        {hod.readinessPct}%
                      </span>
                      <small style={{ color: 'var(--text-muted)' }}>({hod.verifiedStudents}/{hod.totalStudents})</small>
                    </div>
                  </td>
                  <td>
                    {hod.status === 'Verified' ? (
                      <span className="badge-status badge-status-verified">
                        ✓ Verified Authority
                      </span>
                    ) : (
                      <span className="badge-status badge-status-pending">
                        ⏳ Awaiting TPO Sign-Off
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {hod.status !== 'Verified' ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={() => {
                            onUpdateHodStatus(hod.id, 'Verified');
                            showToast(`Authorized Dr. ${hod.name} as verified HoD for ${hod.code}!`);
                          }}
                        >
                          ✓ Grant Authority
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => {
                            onUpdateHodStatus(hod.id, 'Pending');
                            showToast(`Revoked HoD signing clearance for ${hod.code}`);
                          }}
                        >
                          Revoke Access
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-subtle"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => alert(`Viewing complete faculty dossier for ${hod.name} (${hod.department})`)}
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHods.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            No Head of Department found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
