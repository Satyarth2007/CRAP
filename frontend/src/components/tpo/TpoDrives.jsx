import React, { useState } from 'react';
import CreateDriveModal from './CreateDriveModal';

export default function TpoDrives({ drives, onCreateDrive }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleDriveCreated = (newDrive) => {
    onCreateDrive(newDrive);
    showToast(`Successfully published placement drive for ${newDrive.company} (${newDrive.role})!`);
  };

  const filteredDrives = drives.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'super-dream') return d.tier && d.tier.includes('Super');
    if (filter === 'dream') return d.tier && d.tier.includes('Dream') && !d.tier.includes('Super');
    if (filter === 'standard') return d.tier && d.tier.includes('Standard');
    return true;
  });

  return (
    <div className="student-tab-content">
      {/* Top Banner with Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Campus Placement Drives Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Schedule recruitment schedules, set cross-branch cutoffs, and monitor registration funnels.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            + Create New Placement Drive
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
          className={`btn ${filter === 'super-dream' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={() => setFilter('super-dream')}
        >
          Super Dream (>20 LPA)
        </button>
        <button
          type="button"
          className={`btn ${filter === 'dream' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={() => setFilter('dream')}
        >
          Dream Tier (12-20 LPA)
        </button>
        <button
          type="button"
          className={`btn ${filter === 'standard' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={() => setFilter('standard')}
        >
          Standard Tier (&lt;12 LPA)
        </button>
      </div>

      {/* Drives Grid */}
      <div className="drives-grid">
        {filteredDrives.map((drive) => (
          <div key={drive.id} className="drive-card">
            <div className="drive-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="drive-company-avatar" style={{ backgroundColor: drive.badgeColor || '#EEF2FF' }}>
                  {drive.company.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 className="drive-company-name">{drive.company}</h3>
                    {drive.isNew && (
                      <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)', fontSize: '0.7rem' }}>
                        NEWLY CREATED
                      </span>
                    )}
                  </div>
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
                Tier: <strong>{drive.tier || 'Dream Tier'}</strong>
              </span>
              <span className="criteria-chip">
                Date: <strong>{drive.driveDate || 'Ongoing'}</strong>
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-page)', padding: '12px 14px', borderRadius: '10px', margin: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Eligible Branches:</span>
                <strong>{drive.branches ? drive.branches.join(', ') : 'CSE, ISE, AI/ML, ECE'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Eligible Talent Pool:</span>
                <strong>{drive.eligiblePool || 480} Students</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hiring Stage:</span>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{drive.funnelStage || 'Shortlisting Complete'}</span>
              </div>
            </div>

            <div className="drive-card-footer">
              <span className="badge-tag badge-verified">
                ● TPO Sanctioned
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => alert(`Exporting registered candidate pool for ${drive.company}`)}
                >
                  Candidate Pool &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for creating drives */}
      {isCreateOpen && (
        <CreateDriveModal
          onClose={() => setIsCreateOpen(false)}
          onCreateDrive={handleDriveCreated}
        />
      )}
    </div>
  );
}
