import React, { useState } from 'react';

export default function StudentProfile({ studentInfo, onUpdateProfile }) {
  const [phone, setPhone] = useState(studentInfo.phone || '+91 98765 00000');
  const [github, setGithub] = useState(studentInfo.github || 'https://github.com/aaravpatel');
  const [linkedin, setLinkedin] = useState(studentInfo.linkedin || 'https://linkedin.com/in/aarav-patel');
  const [portfolio, setPortfolio] = useState(studentInfo.portfolio || 'https://aarav.dev');
  const [skills, setSkills] = useState(studentInfo.skills || ['React', 'Node.js', 'Python', 'C++', 'Data Structures & Algorithms', 'MongoDB', 'System Design']);
  const [newSkill, setNewSkill] = useState('');
  const [resumeName, setResumeName] = useState(studentInfo.resumeName || 'Aarav_Patel_Resume_2026.pdf');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    onUpdateProfile({
      phone,
      github,
      linkedin,
      portfolio,
      skills,
      resumeName
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Profile & Placement Credentials
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Official institutional records, editable contact handles, and verified resume file.
        </p>
      </div>

      {saveSuccess && (
        <div className="alert-box alert-success" style={{ marginBottom: '20px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Verified Institutional Records (Locked) */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Academic Records</h3>
            <span className="badge-tag" style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Locked by HoD
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
            These credentials are sync-locked with your institutional roster to eliminate fraud. Edits require HoD authorization.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="locked-field">
              <span className="locked-label">Full Name</span>
              <span className="locked-value">{studentInfo.name}</span>
            </div>

            <div className="locked-field">
              <span className="locked-label">Roll Number</span>
              <span className="locked-value">{studentInfo.rollNumber}</span>
            </div>

            <div className="locked-field">
              <span className="locked-label">Department Code</span>
              <span className="locked-value">{studentInfo.departmentCode || 'CSE'}</span>
            </div>

            <div className="locked-field">
              <span className="locked-label">Verified CGPA</span>
              <span className="locked-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {studentInfo.cgpa} / 10.0
              </span>
            </div>

            <div className="locked-field">
              <span className="locked-label">Active Backlogs</span>
              <span className="locked-value" style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                {studentInfo.backlogs} (Clear)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Contact & Socials */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>Personal Contact & Links</h3>

          <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-input"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="url"
                className="form-input"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio Website</label>
              <input
                type="url"
                className="form-input"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Save Contact Details
            </button>
          </form>
        </div>
      </div>

      {/* Skills & Resume Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Skills Management */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px' }}>Technical Skills & Tags</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
            Companies use these tags to match candidate profiles during AI shortlisting rounds.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                  &times;
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add skill (e.g. Docker, GraphQL)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="submit" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
              + Add
            </button>
          </form>
        </div>

        {/* Resume Hub */}
        <div className="bento-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px' }}>Verified Master Resume</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
            This resume is automatically attached when you 1-click apply to campus drives.
          </p>

          <div className="resume-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: '#EEF2FF', borderRadius: '8px', color: 'var(--primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{resumeName}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Uploaded &bull; Verified PDF &bull; 1.2 MB</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <label className="btn btn-primary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                Upload New PDF
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleResumeUpload} />
              </label>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
                onClick={() => alert(`Downloading current resume: ${resumeName}`)}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
