import React, { useState } from 'react';

export default function TpoStudents({ studentsPool }) {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = studentsPool.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.usn.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (branchFilter !== 'all' && s.branch !== branchFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Master Cohort Talent Pool
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Cross-departmental candidate verification ledger and academic locking status.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '380px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search student by name or USN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="all">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ISE">ISE</option>
            <option value="AI/ML">AI/ML</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          <select
            className="form-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Placement Status</option>
            <option value="Placed">Placed</option>
            <option value="In Pipeline">In Pipeline</option>
          </select>
        </div>
      </div>

      {/* Student Pool Table */}
      <div className="hod-table-card">
        <div className="table-responsive">
          <table className="hod-table">
            <thead>
              <tr>
                <th>Candidate & USN</th>
                <th>Branch</th>
                <th>Verified CGPA</th>
                <th>Active Backlogs</th>
                <th>Placement Status</th>
                <th>Recruiter (If Placed)</th>
                <th>HoD Academic Lock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.75rem', backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.92rem' }}>{s.name}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.usn}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                      {s.branch}
                    </span>
                  </td>
                  <td>
                    <strong>{s.cgpa} / 10.0</strong>
                  </td>
                  <td>
                    {s.backlogs === 0 ? (
                      <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>0</span>
                    ) : (
                      <span style={{ color: '#DC2626', fontWeight: 600 }}>{s.backlogs}</span>
                    )}
                  </td>
                  <td>
                    {s.status === 'Placed' ? (
                      <span className="badge-status badge-status-verified">
                        ✓ Placed
                      </span>
                    ) : (
                      <span className="badge-status badge-status-pending">
                        ⏳ In Pipeline
                      </span>
                    )}
                  </td>
                  <td>
                    {s.company ? (
                      <div>
                        <strong>{s.company}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--emerald)', fontWeight: 600 }}>{s.ctc}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className="badge-tag badge-verified">
                      🔒 Verified & Locked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
