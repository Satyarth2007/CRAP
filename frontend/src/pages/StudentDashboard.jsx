import React, { useState } from 'react';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentOverview from '../components/student/StudentOverview';
import StudentDrives from '../components/student/StudentDrives';
import StudentApplications from '../components/student/StudentApplications';
import StudentProfile from '../components/student/StudentProfile';
import StudentOffers from '../components/student/StudentOffers';

function getStudentInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StudentDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  const getActiveStudent = () => {
    try {
      const saved = localStorage.getItem('sealnet_active_student') || localStorage.getItem('sealnet_user');
      if (saved) return JSON.parse(saved);
    } catch(e){}
    return {
      fullName: 'Aarav Patel',
      rollNumber: '1MS22CS095',
      email: 'aarav.patel@college.edu',
      phone: '+91 98765 43210',
      department: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      cgpa: 8.42,
      backlogs: 0
    };
  };

  const initialData = getActiveStudent();
  const initialName = initialData.fullName || 'Aarav Patel';

  // Student Profile State
  const [studentInfo, setStudentInfo] = useState({
    name: initialName,
    initials: getStudentInitials(initialName),
    rollNumber: initialData.rollNumber || '1MS22CS095',
    email: initialData.email || 'student@college.edu',
    phone: initialData.phone || '+91 98765 43210',
    department: initialData.department || 'Computer Science & Engineering',
    departmentCode: initialData.departmentCode || 'CSE',
    cgpa: initialData.cgpa !== undefined ? initialData.cgpa : 8.42,
    backlogs: initialData.backlogs !== undefined ? initialData.backlogs : 0,
    github: `https://github.com/${initialName.toLowerCase().replace(/\s+/g, '')}`,
    linkedin: `https://linkedin.com/in/${initialName.toLowerCase().replace(/\s+/g, '-')}`,
    portfolio: `https://${initialName.toLowerCase().replace(/\s+/g, '')}.dev`,
    resumeName: `${initialName.replace(/\s+/g, '_')}_Resume_2026.pdf`,
    skills: ['React', 'Node.js', 'Python', 'C++', 'Data Structures & Algorithms', 'MongoDB', 'System Design']
  });

  // Live Drives Dataset
  const [drives, setDrives] = useState([
    {
      id: 'd1',
      company: 'Google',
      role: 'Software Engineer',
      ctc: '28.0 LPA',
      ctcNumber: 28,
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ISE', 'ECE'],
      badgeColor: '#EEF2FF',
      roundsDescription: 'Round 1: Online Assessment (Coding + Aptitude) &rarr; Round 2: Technical Interview 1 &rarr; Round 3: Technical Interview 2 &rarr; Round 4: Googleyness & Leadership',
      description: 'Join the Google Core Engineering team building next-generation distributed systems, cloud infrastructure, and search query execution algorithms.'
    },
    {
      id: 'd2',
      company: 'Amazon',
      role: 'SDE-1 (AWS Cloud)',
      ctc: '22.5 LPA',
      ctcNumber: 22.5,
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ISE', 'ECE', 'AIML'],
      badgeColor: '#FFFBEB',
      roundsDescription: 'Round 1: OA on HackerEarth &rarr; Round 2: Data Structures & Algorithms &rarr; Round 3: Low-Level Design & LP Round',
      description: 'AWS is hiring passionate software development engineers to build hyper-scale distributed cloud storage and compute services.'
    },
    {
      id: 'd3',
      company: 'Goldman Sachs',
      role: 'Quantitative Software Analyst',
      ctc: '24.0 LPA',
      ctcNumber: 24,
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ISE'],
      badgeColor: '#ECFDF5',
      roundsDescription: 'Round 1: Math & Coding Assessment &rarr; Round 2: Algorithms & CoderPad Interview &rarr; Round 3: System Design & Fit',
      description: 'Architect low-latency financial systems, automated quantitative execution engines, and risk analysis platforms.'
    },
    {
      id: 'd4',
      company: 'Cisco Systems',
      role: 'Network Software Engineer',
      ctc: '18.0 LPA',
      ctcNumber: 18,
      minCgpa: 7.0,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ISE', 'ECE', 'EEE'],
      badgeColor: '#EFF6FF',
      roundsDescription: 'Round 1: Network Protocols & Coding Test &rarr; Round 2: Technical Interview &rarr; Round 3: Managerial Discussion',
      description: 'Develop network operating systems, enterprise security solutions, and software-defined networking APIs.'
    },
    {
      id: 'd5',
      company: 'Oracle Cloud',
      role: 'Member Technical Staff',
      ctc: '19.5 LPA',
      ctcNumber: 19.5,
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ISE'],
      badgeColor: '#FEF2F2',
      roundsDescription: 'Round 1: Coding & CS Fundamentals &rarr; Round 2: DSA Round &rarr; Round 3: Database & Cloud Architecture Round',
      description: 'Build core services powering Oracle Cloud Infrastructure (OCI) with a focus on high reliability, security, and performance.'
    },
    {
      id: 'd6',
      company: 'NVIDIA',
      role: 'System Software Engineer',
      ctc: '32.0 LPA',
      ctcNumber: 32,
      minCgpa: 8.5,
      maxBacklogs: 0,
      allowedDepts: ['CSE', 'ECE'],
      badgeColor: '#F0FDF4',
      roundsDescription: 'Round 1: C/C++ & OS Test &rarr; Round 2: GPU Architecture & Algorithms &rarr; Round 3: Deep Learning Frameworks Round',
      description: 'Pioneer the future of GPU accelerated computing, CUDA driver infrastructure, and generative AI platforms.'
    }
  ]);

  // Student Applications State
  const [appliedDriveIds, setAppliedDriveIds] = useState(['d1', 'd2']);
  const [applications, setApplications] = useState([
    {
      id: 'app_1',
      driveId: 'd1',
      company: 'Google',
      role: 'Software Engineer',
      ctc: '28.0 LPA',
      appliedDate: '12 Sep 2026',
      currentStage: 'Technical Round',
      status: 'In Progress',
      badgeColor: '#EEF2FF',
      nextRound: 'Technical Round 1 (Algorithms)',
      nextDate: '21 Sep 2026, 10:30 AM',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 'app_2',
      driveId: 'd2',
      company: 'Amazon',
      role: 'SDE-1 (AWS Cloud)',
      ctc: '22.5 LPA',
      appliedDate: '14 Sep 2026',
      currentStage: 'OA Test',
      status: 'In Progress',
      badgeColor: '#FFFBEB',
      nextRound: 'HackerEarth Online Assessment',
      nextDate: '23 Sep 2026, Closes 11:59 PM',
      meetingLink: null
    }
  ]);

  // Official Offers
  const [offers] = useState([
    {
      id: 'offer_1',
      company: 'Microsoft',
      role: 'Software Development Engineer',
      ctc: '21.5 LPA',
      base: '17.0 LPA',
      location: 'Hyderabad / Bengaluru',
      date: '10 Sep 2026',
      status: 'Pending Acceptance'
    }
  ]);

  // Handler: 1-Click Apply to Drive
  const handleApplyDrive = (drive) => {
    if (appliedDriveIds.includes(drive.id)) return;

    setAppliedDriveIds([...appliedDriveIds, drive.id]);

    const newApp = {
      id: 'app_' + Date.now(),
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      ctc: drive.ctc,
      appliedDate: 'Today',
      currentStage: 'Applied',
      status: 'Applied',
      badgeColor: drive.badgeColor,
      nextRound: 'Resume Screening by Recruitment Team',
      nextDate: 'Within 3 Business Days',
      meetingLink: null
    };

    setApplications([newApp, ...applications]);
  };

  // Handler: Update Student Profile
  const handleUpdateProfile = (updatedFields) => {
    setStudentInfo(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Placement Overview';
      case 'drives': return 'Live Campus Drives';
      case 'applications': return 'Application Pipeline';
      case 'profile': return 'Student Profile & Credentials';
      case 'offers': return 'Job Offers & One-Offer Lock';
      default: return 'Student Portal';
    }
  };

  return (
    <div className="student-portal-layout">
      {/* 1. Left Dock Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNavigate={onNavigate}
        studentInfo={studentInfo}
      />

      {/* 2. Main Portal Container */}
      <div className="student-portal-main">
        {/* Header Bar */}
        <header className="student-portal-header">
          <div className="header-left">
            <span className="portal-breadcrumb">
              SEALNET &middot; Student Console &middot; {getTabTitle()}
            </span>
            <h2 className="portal-page-title">{getTabTitle()}</h2>
          </div>
        </header>

        {/* 3. Dynamic Tab Content View */}
        <main className="student-portal-body">
          {activeTab === 'overview' && (
            <StudentOverview
              studentInfo={studentInfo}
              drives={drives}
              applications={applications}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'drives' && (
            <StudentDrives
              studentInfo={studentInfo}
              drives={drives}
              onApplyDrive={handleApplyDrive}
              appliedDriveIds={appliedDriveIds}
            />
          )}

          {activeTab === 'applications' && (
            <StudentApplications
              applications={applications}
            />
          )}

          {activeTab === 'profile' && (
            <StudentProfile
              studentInfo={studentInfo}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'offers' && (
            <StudentOffers
              offers={offers}
              studentInfo={studentInfo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
