import React, { useState } from 'react';

export default function HodRoster({ students, onUpdateStudentStatus, onApproveAllPending }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredStudents = students.filter(s => {
    const matches = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.usn.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filter === 'all') return true;
    return s.status.toLowerCase() === filter.toLowerCase();
  });

  const pendingCount = students.filter(s => s.status === 'Pending').length;

  return (
    <div className="student-tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Student Roster Verification Desk
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Verify academic credentials, lock CGPA records to prevent candidate fraud, and flag discrepancies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {pendingCount > 0 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onApproveAllPending();
                showToast(`Approved all ${pendingCount} pending candidates in batch!`);
              }}
            >
              ✓ Batch Approve All Pending ({pendingCount})
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
            placeholder="Search candidate by name or USN..."
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
            All Students ({students.length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('pending')}
          >
            Pending ({students.filter(s => s.status === 'Pending').length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('verified')}
          >
            Verified ({students.filter(s => s.status === 'Verified').length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'flagged' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('flagged')}
          >
            Flagged ({students.filter(s => s.status === 'Flagged').length})
          </button>
        </div>
      </div>

      {/* Interactive Roster Table */}
      <div className="hod-table-card">
        <div className="table-responsive">
          <table className="hod-table">
            <thead>
              <tr>
                <th>Candidate & USN</th>
                <th>Verified CGPA</th>
                <th>Active Backlogs</th>
                <th>Attendance</th>
                <th>Verification Status</th>
                <th style={{ textAlign: 'right' }}>HoD Clearance Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => (
                <tr key={std.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.75rem', backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                        {std.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.92rem' }}>{std.name}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{std.usn}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: std.cgpa >= 8.0 ? 'var(--primary)' : 'inherit' }}>
                      {std.cgpa} / 10.0
                    </strong>
                  </td>
                  <td>
                    {std.backlogs === 0 ? (
                      <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>0 (Clear)</span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: 600 }}>{std.backlogs} Active</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: std.attendance < 75 ? '#DC2626' : 'inherit', fontWeight: std.attendance < 75 ? 700 : 500 }}>
                      {std.attendance}%
                    </span>
                  </td>
                  <td>
                    {std.status === 'Verified' && (
                      <span className="badge-status badge-status-verified">
                        ✓ Verified & Locked
                      </span>
                    )}
                    {std.status === 'Pending' && (
                      <span className="badge-status badge-status-pending">
                        ⏳ Pending Sign-off
                      </span>
                    )}
                    {std.status === 'Flagged' && (
                      <span className="badge-status badge-status-flagged">
                        ✕ Discrepancy Flagged
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {std.status !== 'Verified' && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => {
                            onUpdateStudentStatus(std.id, 'Verified');
                            showToast(`Verified & locked records for ${std.name} (${std.usn})`);
                          }}
                        >
                          Verify & Lock
                        </button>
                      )}

                      {std.status !== 'Flagged' && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => {
                            onUpdateStudentStatus(std.id, 'Flagged');
                            showToast(`Flagged discrepancy for ${std.name}`);
                          }}
                        >
                          Flag
                        </button>
                      )}

                      {std.status !== 'Pending' && (
                        <button
                          type="button"
                          className="btn btn-subtle"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          onClick={() => {
                            onUpdateStudentStatus(std.id, 'Pending');
                            showToast(`Reset status to pending for ${std.name}`);
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            No students found matching your search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
