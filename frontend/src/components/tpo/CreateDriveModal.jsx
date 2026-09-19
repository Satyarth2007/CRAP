import React, { useState } from 'react';

export default function CreateDriveModal({ onClose, onCreateDrive }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [tier, setTier] = useState('Dream Tier');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [driveDate, setDriveDate] = useState('2026-10-15');
  const [selectedBranches, setSelectedBranches] = useState(['CSE', 'ISE', 'AI/ML']);
  const [rounds, setRounds] = useState(['Online Coding Test', 'Technical Round 1', 'Managerial & HR']);

  const allBranches = ['CSE', 'ISE', 'AI/ML', 'ECE', 'MECH', 'CIVIL'];

  const toggleBranch = (branch) => {
    setSelectedBranches(prev =>
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !ctc.trim()) {
      alert('Please fill all required fields');
      return;
    }
    if (selectedBranches.length === 0) {
      alert('Please select at least one eligible engineering branch');
      return;
    }

    const newDrive = {
      id: `drive_${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      ctc: ctc.includes('LPA') ? ctc.trim() : `${ctc.trim()} LPA`,
      tier,
      minCgpa: parseFloat(minCgpa) || 7.0,
      driveDate,
      branches: selectedBranches,
      registeredCount: 0,
      eligiblePool: selectedBranches.length * 110,
      funnelStage: 'Candidate Registration Open',
      badgeColor: tier === 'Super Dream' ? '#ECFDF5' : '#EEF2FF',
      isNew: true
    };

    onCreateDrive(newDrive);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
            Publish New Campus Placement Drive
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Broadcast eligibility cutoffs, schedule selection rounds, and enforce HoD verification across selected branches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Recruiting Company *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Microsoft / Atlassian"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Profile / Role *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Software Development Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Package (CTC) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 24.5 LPA"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Offer Tier</label>
              <select className="form-input" value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="Super Dream">Super Dream (> 20 LPA)</option>
                <option value="Dream Tier">Dream Tier (12 - 20 LPA)</option>
                <option value="Standard Tier">Standard Tier (&lt; 12 LPA)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Min CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="10.0"
                className="form-input"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Drive Assessment Date</label>
            <input
              type="date"
              className="form-input"
              value={driveDate}
              onChange={(e) => setDriveDate(e.target.value)}
              required
            />
          </div>

          {/* Eligible Branches Selection */}
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '8px' }}>Eligible Engineering Branches *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allBranches.map((b) => (
                <div
                  key={b}
                  className={`pill-checkbox ${selectedBranches.includes(b) ? 'checked' : ''}`}
                  onClick={() => toggleBranch(b)}
                >
                  <span>{selectedBranches.includes(b) ? '✓' : '+'}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              🚀 Publish Placement Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
