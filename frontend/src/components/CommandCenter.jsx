import React, { useState } from 'react';

export default function CommandCenter() {
  // Micro-Engine 1: Eligibility Radar
  const [cgpa, setCgpa] = useState(7.8);
  const [branch, setBranch] = useState('CSE');
  const [backlogs, setBacklogs] = useState(0);

  const isGoogleEligible = (branch === 'CSE' || branch === 'ECE') && cgpa >= 8.0 && backlogs === 0;
  const isDeloitteEligible = cgpa >= 6.5 && backlogs <= 1;
  const isTataEligible = (branch === 'MECH' || branch === 'ECE') && cgpa >= 7.0 && backlogs === 0;

  // Micro-Engine 2: Mutex Collision Test
  const [mutexLogs, setMutexLogs] = useState([
    { text: "// Current Student: Aarav (USN: 22CS094)", type: "normal" },
    { text: "STATUS: [1 ACCEPTED OFFER] -> Microsoft", type: "success" },
    { text: "Index Lock: ACTIVE (student_accepted_offer_1)", type: "accent" }
  ]);
  const [isConflictTriggered, setIsConflictTriggered] = useState(false);

  const triggerCollision = () => {
    setIsConflictTriggered(true);
    setMutexLogs(prev => [
      ...prev,
      { text: "POST /api/offers/accept { studentId: '22CS094', drive: 'Amazon' }", type: "warning" },
      { text: "[E11000 duplicate key error] index: student_accepted_offer_1 dup key: { studentId: '22CS094' }", type: "error" },
      { text: "ATOMIC MUTEX ENFORCED: 409 Conflict. Duplicate offer blocked.", type: "warning" }
    ]);
  };

  const resetMutex = () => {
    setIsConflictTriggered(false);
    setMutexLogs([
      { text: "// Current Student: Aarav (USN: 22CS094)", type: "normal" },
      { text: "STATUS: [1 ACCEPTED OFFER] -> Microsoft", type: "success" },
      { text: "Index Lock: ACTIVE (student_accepted_offer_1)", type: "accent" }
    ]);
  };

  // Micro-Engine 3: Stepper Pipeline
  const [stage, setStage] = useState(3);
  const stages = [
    { num: 1, title: "Online Assessment", status: "Completed" },
    { num: 2, title: "Coding Test", status: "Completed" },
    { num: 3, title: "Technical Interview", status: "In Progress" },
    { num: 4, title: "HR Interview", status: "Upcoming" },
    { num: 5, title: "Offer Extended", status: "Final Stage" }
  ];

  const advanceStage = () => {
    setStage(prev => (prev < 5 ? prev + 1 : 1));
  };

  return (
    <section id="engines" className="bento-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Interactive Architecture</div>
          <h2 className="section-title">The Placement Command Center</h2>
          <p className="section-desc">
            Test the core logic engines running beneath the platform in real time.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Multi-Factor Eligibility Radar */}
          <div className="bento-card col-span-7">
            <div className="card-top">
              <span className="badge-engine">Real-Time Evaluator</span>
              <span className="live-indicator">
                <span className="pulse-dot"></span> Live Engine
              </span>
            </div>
            <h3 className="card-title">Multi-Factor Eligibility Radar</h3>
            <p className="card-desc">
              Adjust academic criteria to test how candidate qualifications evaluate against active company drive cutoffs.
            </p>

            <div className="radar-controls">
              <div className="control-item">
                <div className="control-label">
                  <span>Student CGPA</span>
                  <span className="control-val">{cgpa.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value))}
                  className="clean-slider"
                />
              </div>

              <div className="control-item">
                <div className="control-label">
                  <span>Engineering Branch</span>
                </div>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="clean-select"
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="MECH">Mechanical (MECH)</option>
                  <option value="CIVIL">Civil Engineering</option>
                </select>
              </div>

              <div className="control-item" style={{ gridColumn: 'span 2' }}>
                <div className="control-label">
                  <span>Active Standing Backlogs</span>
                  <span className="control-val">{backlogs}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={backlogs}
                  onChange={(e) => setBacklogs(parseInt(e.target.value))}
                  className="clean-slider"
                />
              </div>
            </div>

            <div className="radar-results">
              <div className="company-row">
                <div>
                  <div className="company-name">Google · SWE Intern</div>
                  <div className="company-meta">CSE/ECE &ge; 8.0 CGPA &middot; 0 Backlogs</div>
                </div>
                <span className={`status-badge ${isGoogleEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
                  {isGoogleEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                </span>
              </div>

              <div className="company-row">
                <div>
                  <div className="company-name">Deloitte · Analyst</div>
                  <div className="company-meta">All Branches &ge; 6.5 CGPA &middot; &le; 1 Backlog</div>
                </div>
                <span className={`status-badge ${isDeloitteEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
                  {isDeloitteEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                </span>
              </div>

              <div className="company-row">
                <div>
                  <div className="company-name">Tata Motors · Graduate Trainee</div>
                  <div className="company-meta">MECH/ECE &ge; 7.0 CGPA &middot; 0 Backlogs</div>
                </div>
                <span className={`status-badge ${isTataEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
                  {isTataEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Strict One-Offer Lock */}
          <div className="bento-card col-span-5">
            <div className="card-top">
              <span className="badge-engine">Database Mutex</span>
              <span className="live-indicator">MongoDB Index</span>
            </div>
            <h3 className="card-title">Strict One-Offer Lock</h3>
            <p className="card-desc">
              Guarantees zero double-offer hoarding at the database layer via a unique partial index on accepted offers.
            </p>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="term-dot term-dot-red"></div>
                <div className="term-dot term-dot-yellow"></div>
                <div className="term-dot term-dot-green"></div>
                <span className="term-title">offer_mutex_monitor.log</span>
              </div>
              {mutexLogs.map((log, idx) => (
                <div key={idx} className={`term-line term-${log.type}`}>
                  {log.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isConflictTriggered ? (
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={triggerCollision}>
                  Trigger 2nd Offer Collision Test
                </button>
              ) : (
                <button className="btn btn-subtle" style={{ width: '100%' }} onClick={resetMutex}>
                  Reset Mutex State
                </button>
              )}
            </div>
          </div>

          {/* Card 3: Selection Stepper */}
          <div className="bento-card col-span-8">
            <div className="card-top">
              <span className="badge-engine">Selection Pipeline</span>
              <button className="btn btn-subtle" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={advanceStage}>
                Advance Round &rarr;
              </button>
            </div>
            <h3 className="card-title">Multi-Round Progression Engine</h3>
            <p className="card-desc">
              Granular status tracking for every applicant. When disqualified, students receive exact milestone clarity rather than vague rejection.
            </p>

            <div className="stepper-container">
              <div className="stepper-track">
                <div className="stepper-progress" style={{ width: `${((stage - 1) / 4) * 100}%` }}></div>
              </div>
              <div className="stepper-nodes">
                {stages.map((s) => {
                  const isCompleted = s.num < stage;
                  const isCurrent = s.num === stage;
                  return (
                    <div key={s.num} className="step-item" onClick={() => setStage(s.num)}>
                      <div className={`step-bubble ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                        {isCompleted ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          s.num
                        )}
                      </div>
                      <span className="step-label">{s.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="stepper-summary">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Active Milestone:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Round {stage}: {stages[stage - 1].title} ({stages[stage - 1].status})
                </div>
              </div>
              <span className="status-badge badge-eligible">Automated Notification Sent</span>
            </div>
          </div>

          {/* Card 4: Institutional Telemetry */}
          <div className="bento-card col-span-4">
            <div className="card-top">
              <span className="badge-engine">Institutional Telemetry</span>
              <span className="live-indicator">Live Campus Stream</span>
            </div>
            <h3 className="card-title">Placement Metrics</h3>
            <p className="card-desc">Real-time aggregate data for administrative reporting.</p>

            <div className="telemetry-stat">78.4%</div>
            <div className="telemetry-pill">+14.2% Compared to Previous Batch</div>

            <div className="telemetry-meta-grid">
              <div className="meta-box">
                <div className="meta-box-label">Average CTC</div>
                <div className="meta-box-val">14.2 LPA</div>
              </div>
              <div className="meta-box">
                <div className="meta-box-label">Visiting Drives</div>
                <div className="meta-box-val">46 Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
