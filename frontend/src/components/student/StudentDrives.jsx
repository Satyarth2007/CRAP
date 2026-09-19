import React, { useState } from 'react';

export default function StudentDrives({ studentInfo, drives, onApplyDrive, appliedDriveIds }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'eligible' | 'dream'
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch = drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          drive.role.toLowerCase().includes(searchQuery.toLowerCase());
    const isEligible = studentInfo.cgpa >= drive.minCgpa && studentInfo.backlogs <= drive.maxBacklogs;
    const isDream = drive.ctcNumber >= 12;

    if (!matchesSearch) return false;
    if (filter === 'eligible') return isEligible;
    if (filter === 'dream') return isDream;
    return true;
  });

  return (
    <div className="student-tab-content">
      {/* Top Header & Search/Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Live Placement Drives
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Verified campus drives currently open for the 2026 Graduating Batch.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('all')}
          >
            All Drives ({drives.length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'eligible' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('eligible')}
          >
            Eligible Only
          </button>
          <button
            type="button"
            className={`btn ${filter === 'dream' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setFilter('dream')}
          >
            Dream Tier (&gt;12 LPA)
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div style={{ marginBottom: '20px' }}>
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by company or role (e.g. Microsoft, Software Engineer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Drives Grid */}
      <div className="drives-grid">
        {filteredDrives.map((drive) => {
          const isEligible = studentInfo.cgpa >= drive.minCgpa && studentInfo.backlogs <= drive.maxBacklogs;
          const isApplied = appliedDriveIds.includes(drive.id);

          return (
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

              {/* Requirements Chips */}
              <div className="drive-criteria-chips">
                <span className="criteria-chip">
                  Min CGPA: <strong>{drive.minCgpa}</strong>
                </span>
                <span className="criteria-chip">
                  Dept: <strong>{drive.allowedDepts.join(', ')}</strong>
                </span>
                <span className="criteria-chip">
                  Backlogs: <strong>{drive.maxBacklogs === 0 ? 'Nil' : `Max ${drive.maxBacklogs}`}</strong>
                </span>
              </div>

              {/* Eligibility & Action Footer */}
              <div className="drive-card-footer">
                <div>
                  {isApplied ? (
                    <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', fontWeight: 600 }}>
                      ✓ Applied
                    </span>
                  ) : isEligible ? (
                    <span className="badge-tag badge-eligible">
                      ● Eligible to Apply
                    </span>
                  ) : (
                    <span className="badge-tag badge-ineligible">
                      ✕ Min CGPA: {drive.minCgpa}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-subtle"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => setSelectedDrive(drive)}
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    disabled={!isEligible || isApplied}
                    onClick={() => onApplyDrive(drive)}
                  >
                    {isApplied ? 'Applied' : isEligible ? 'Apply Now' : 'Ineligible'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrives.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>No drives found matching your filter criteria.</p>
        </div>
      )}

      {/* Drive Details Modal */}
      {selectedDrive && (
        <div className="modal-overlay" onClick={() => setSelectedDrive(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close-btn" onClick={() => setSelectedDrive(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div className="drive-company-avatar" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                {selectedDrive.company.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{selectedDrive.company}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '2px 0 0' }}>{selectedDrive.role} &middot; {selectedDrive.ctc}</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 8px', textTransform: 'uppercase' }}>Hiring Rounds Pipeline</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{selectedDrive.roundsDescription}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px' }}>Job Description</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                {selectedDrive.description || 'Looking for passionate software engineers with strong problem-solving skills, data structures and algorithms foundations, and modern web application development experience.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => setSelectedDrive(null)}>Close</button>
              <button
                className="btn btn-primary"
                disabled={studentInfo.cgpa < selectedDrive.minCgpa || appliedDriveIds.includes(selectedDrive.id)}
                onClick={() => {
                  onApplyDrive(selectedDrive);
                  setSelectedDrive(null);
                }}
              >
                {appliedDriveIds.includes(selectedDrive.id) ? 'Already Applied' : 'Submit 1-Click Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
