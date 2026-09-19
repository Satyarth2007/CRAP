import React, { useState } from 'react';

export default function RoleShowcase({ onOpenAuth }) {
  const [activeRole, setActiveRole] = useState('student');

  const roleData = {
    student: {
      title: "Transparent Student Placement Portal",
      desc: "Instant access via official join codes. Academic CGPA and backlog records are locked directly from the verified institutional roster.",
      features: [
        "Real-time automated eligibility screening on active company drives",
        "Stage-by-stage transparent rejection and interview feedback",
        "Direct verified offer acceptance with automatic lock activation"
      ],
      drive1: { company: "Microsoft", role: "Software Engineer", ctc: "21.5 LPA", status: "ELIGIBLE" },
      drive2: { company: "Qualcomm", role: "Hardware Systems Eng", ctc: "18.0 LPA", status: "BRANCH MISMATCH" }
    },
    tpo: {
      title: "TPO Central Command & Policy Enforcer",
      desc: "Master administrative console for managing visiting enterprise companies, automated student eligibility cutoffs, and offer distribution limits.",
      features: [
        "Single-click bulk CSV roster ingestion with regex sanity check",
        "Strict one-offer policy guardrails guaranteed at database layer",
        "Live placement rate telemetry and department-level audit logs"
      ],
      drive1: { company: "Google India", role: "Drive Live (124 Applied)", ctc: "32.0 LPA", status: "ROUND 2 ACTIVE" },
      drive2: { company: "Deloitte USI", role: "Shortlist Generated (42 Selected)", ctc: "8.5 LPA", status: "VERIFIED" }
    },
    hod: {
      title: "Department HoD Academic Verification Desk",
      desc: "Eliminate fraudulent self-reported credentials. Department heads verify student eligibility, approve condoned backlogs, and inspect batch progress.",
      features: [
        "Department-level student approval queue with fast batch actions",
        "Direct audit trail for semester backlog condonations",
        "Departmental placement statistics exportable for accreditation (NBA/NAAC)"
      ],
      drive1: { company: "CSE Dept Audit", role: "Batch 2026 Verification", ctc: "180 Students", status: "VERIFIED" },
      drive2: { company: "Backlog Clearance", role: "Pending HoD Review", ctc: "4 Records", status: "REQUIRES ACTION" }
    },
    recruiter: {
      title: "Corporate Recruiter Candidate Pipeline",
      desc: "Clean portal for visiting HR teams to define multi-factor job criteria, conduct interview rounds, and disburse verifiable offers.",
      features: [
        "Structured round-by-round candidate advancement workflow",
        "Exportable shortlisted candidate dossiers formatted with USN and verified CGPA",
        "Direct digital offer letter issuance"
      ],
      drive1: { company: "Amazon AWS", role: "Campus SDE-1 Drive", ctc: "28.0 LPA", status: "SHORTLISTING" },
      drive2: { company: "Cisco Systems", role: "Network Engineer Track", ctc: "16.5 LPA", status: "INTERVIEW STAGE" }
    }
  };

  return (
    <section id="portals" className="roles-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Role Architecture</div>
          <h2 className="section-title">Tailored Portals for Every Role</h2>
          <p className="section-desc">
            Four specialized consoles designed to meet the exact workflow needs of each institutional stakeholder.
          </p>
        </div>

        <div className="role-tabs">
          <button
            className={`role-tab-btn ${activeRole === 'student' ? 'active' : ''}`}
            onClick={() => setActiveRole('student')}
          >
            Student Portal
          </button>
          <button
            className={`role-tab-btn ${activeRole === 'tpo' ? 'active' : ''}`}
            onClick={() => setActiveRole('tpo')}
          >
            TPO Command
          </button>
          <button
            className={`role-tab-btn ${activeRole === 'hod' ? 'active' : ''}`}
            onClick={() => setActiveRole('hod')}
          >
            HoD Governance
          </button>
          <button
            className={`role-tab-btn ${activeRole === 'recruiter' ? 'active' : ''}`}
            onClick={() => setActiveRole('recruiter')}
          >
            Recruiter Desk
          </button>
        </div>

        <div className="role-content-card">
          <div className="role-details">
            <h3>{roleData[activeRole].title}</h3>
            <p>{roleData[activeRole].desc}</p>

            <ul className="role-feature-list">
              {roleData[activeRole].features.map((feat, idx) => (
                <li key={idx} className="role-feature-item">
                  <span className="check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-primary"
              onClick={() => onOpenAuth(activeRole === 'tpo' ? 'tpo' : 'student')}
            >
              Access {activeRole === 'tpo' ? 'TPO Command' : 'Student Portal'}
            </button>
          </div>

          <div className="role-preview-box">
            <div className="preview-header">
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Live Portal View</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>USN: 1MS22CS094 &middot; Verified Profile</div>
              </div>
              <span className="preview-badge">Active Session</span>
            </div>

            <div className="drive-card-item">
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{roleData[activeRole].drive1.company}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {roleData[activeRole].drive1.role} &middot; {roleData[activeRole].drive1.ctc}
                </div>
              </div>
              <span className="status-badge badge-eligible">{roleData[activeRole].drive1.status}</span>
            </div>

            <div className="drive-card-item">
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{roleData[activeRole].drive2.company}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {roleData[activeRole].drive2.role} &middot; {roleData[activeRole].drive2.ctc}
                </div>
              </div>
              <span className="status-badge badge-ineligible">{roleData[activeRole].drive2.status}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
