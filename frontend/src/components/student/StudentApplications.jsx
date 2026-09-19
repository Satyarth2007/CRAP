import React, { useState } from 'react';

export default function StudentApplications({ applications }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const stagesList = ['Applied', 'OA Test', 'Technical Round', 'HR Round', 'Offer'];

  const getStageIndex = (stageName) => {
    switch (stageName) {
      case 'Applied': return 0;
      case 'OA Test': return 1;
      case 'Technical Round': return 2;
      case 'HR Round': return 3;
      case 'Offer': return 4;
      default: return 0;
    }
  };

  return (
    <div className="student-tab-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          My Applications Tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
          Real-time hiring pipeline tracking for all your institutional job applications.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {applications.map((app) => {
          const currentStageIndex = getStageIndex(app.currentStage);
          const isSelected = app.status === 'Selected' || app.status === 'Offer Received';

          return (
            <div key={app.id} className="bento-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="drive-company-avatar" style={{ width: '44px', height: '44px', fontSize: '1.2rem', backgroundColor: app.badgeColor || '#EEF2FF' }}>
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{app.company}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                      {app.role} &middot; Applied on {app.appliedDate}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="drive-ctc-pill" style={{ marginBottom: '6px', display: 'inline-block' }}>
                    {app.ctc}
                  </span>
                  <div>
                    {isSelected ? (
                      <span className="badge-tag" style={{ backgroundColor: '#ECFDF5', color: 'var(--emerald)', fontWeight: 700 }}>
                        ★ Offer Extended
                      </span>
                    ) : (
                      <span className="badge-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', fontWeight: 600 }}>
                        Current Stage: {app.currentStage}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pipeline-stepper">
                {stagesList.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex || isSelected;
                  const isCurrent = idx === currentStageIndex && !isSelected;

                  return (
                    <div key={stage} className={`pipeline-step ${isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}>
                      <div className="step-circle">
                        {isCompleted ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className="step-label">{stage}</span>
                    </div>
                  );
                })}
              </div>

              {/* Next Action / Round Details Bar */}
              {app.nextRound && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Next Event:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{app.nextRound}</strong>
                    <span style={{ color: 'var(--text-light)' }}>&bull;</span>
                    <span style={{ color: 'var(--text-muted)' }}>Date: {app.nextDate}</span>
                  </div>

                  {app.meetingLink && (
                    <a
                      href={app.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    >
                      Join Meeting &rarr;
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {applications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>You haven't applied to any placement drives yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
