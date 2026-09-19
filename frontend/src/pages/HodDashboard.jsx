import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import HodSidebar from '../components/hod/HodSidebar';
import HodOverview from '../components/hod/HodOverview';
import HodRoster from '../components/hod/HodRoster';
import HodExceptions from '../components/hod/HodExceptions';
import HodDrives from '../components/hod/HodDrives';
import HodMutex from '../components/hod/HodMutex';
import HodProfileModal from '../components/hod/HodProfileModal';

function getInitials(name) {
  if (!name) return 'RK';
  const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

export default function HodDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getActiveHod = () => {
    if (user && (user.role === 'hod' || user.department)) return user;
    try {
      const saved = localStorage.getItem('sealnet_active_hod');
      if (saved) return JSON.parse(saved);
    } catch(e){}
    return {
      fullName: 'Dr. Rajesh Kulkarni',
      email: 'hod.cse@college.edu',
      department: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      phone: '+91 98450 11223'
    };
  };

  const initialHod = getActiveHod();
  const [hodInfo, setHodInfo] = useState({
    name: initialHod.fullName || 'Dr. Rajesh Kulkarni',
    initials: getInitials(initialHod.fullName || 'Dr. Rajesh Kulkarni'),
    email: initialHod.email || 'hod.cse@college.edu',
    department: initialHod.department || 'Computer Science & Engineering',
    departmentCode: initialHod.departmentCode || 'CSE',
    phone: initialHod.phone || '+91 98450 11223'
  });

  // Synchronize whenever user / localStorage changes
  useEffect(() => {
    const active = getActiveHod();
    if (active && active.fullName && active.fullName !== hodInfo.name) {
      setHodInfo(prev => ({
        ...prev,
        name: active.fullName,
        initials: getInitials(active.fullName),
        email: active.email || prev.email,
        department: active.department || prev.department,
        departmentCode: active.departmentCode || prev.departmentCode,
        phone: active.phone || prev.phone
      }));
    }
  }, [user]);

  // Roster Dataset
  const [students, setStudents] = useState([
    { id: 's1', name: 'Aarav Patel', usn: '1MS22CS095', cgpa: 8.42, backlogs: 0, attendance: 94, status: 'Verified' },
    { id: 's2', name: 'Priya Sharma', usn: '1MS22CS108', cgpa: 9.15, backlogs: 0, attendance: 96, status: 'Verified' },
    { id: 's3', name: 'Karan Saxena', usn: '1MS22CS054', cgpa: 7.60, backlogs: 1, attendance: 82, status: 'Pending' },
    { id: 's4', name: 'Sneha Rao', usn: '1MS22CS112', cgpa: 8.85, backlogs: 0, attendance: 68, status: 'Pending' },
    { id: 's5', name: 'Vikram Malhotra', usn: '1MS22CS178', cgpa: 6.90, backlogs: 2, attendance: 75, status: 'Flagged' },
    { id: 's6', name: 'Ananya Desai', usn: '1MS22CS014', cgpa: 8.92, backlogs: 0, attendance: 95, status: 'Verified' },
    { id: 's7', name: 'Rohan Joshi', usn: '1MS22CS088', cgpa: 7.40, backlogs: 0, attendance: 88, status: 'Verified' },
    { id: 's8', name: 'Meera Nair', usn: '1MS22CS076', cgpa: 8.12, backlogs: 0, attendance: 91, status: 'Pending' },
    { id: 's9', name: 'Tanmay Bhatia', usn: '1MS22CS142', cgpa: 6.45, backlogs: 1, attendance: 72, status: 'Flagged' },
    { id: 's10', name: 'Divya Krishnan', usn: '1MS22CS032', cgpa: 8.78, backlogs: 0, attendance: 98, status: 'Verified' }
  ]);

  // Exception Requests Dataset
  const [exceptions, setExceptions] = useState([
    {
      id: 'ex1',
      studentName: 'Karan Saxena',
      usn: '1MS22CS054',
      semester: 'Semester 5',
      category: 'Supplementary Clearance',
      reason: 'Cleared Semester 4 Data Structures backlog in supplementary exams with Grade B. University physical marksheet is in dispatch. Seeking conditional authorization to appear for Dream Tier placement drives.',
      date: '16 Sep 2026',
      status: 'Pending'
    },
    {
      id: 'ex2',
      studentName: 'Sneha Rao',
      usn: '1MS22CS112',
      semester: 'Semester 6',
      category: 'Medical Condonation',
      reason: 'Attendance recorded at 68% due to 3-week inpatient hospitalization for Dengue fever. Attaching official medical summary from Manipal Hospital certified by Chief Medical Officer.',
      date: '14 Sep 2026',
      status: 'Pending'
    },
    {
      id: 'ex3',
      studentName: 'Vikram Malhotra',
      usn: '1MS22CS178',
      semester: 'Semester 5',
      category: 'Credit Transfer Audit',
      reason: 'Credit transfer reconciliation delay from autonomous exchange semester. 2 backlogs flagged mistakenly in central database.',
      date: '11 Sep 2026',
      status: 'Pending'
    }
  ]);

  // Department Drives Dataset
  const [drives] = useState([
    { id: 'd1', company: 'Google', role: 'Software Engineer', ctc: '28.0 LPA', minCgpa: 8.0, turnout: '95%', shortlisted: 12, eligibleCount: 142, funnelStage: 'Technical Round 2 Ongoing', badgeColor: '#EEF2FF' },
    { id: 'd2', company: 'Amazon', role: 'SDE-1 (AWS Cloud)', ctc: '22.5 LPA', minCgpa: 7.5, turnout: '98%', shortlisted: 24, eligibleCount: 165, funnelStage: 'Online Assessment Evaluated', badgeColor: '#FFFBEB' },
    { id: 'd3', company: 'Goldman Sachs', role: 'Quantitative Analyst', ctc: '24.0 LPA', minCgpa: 8.0, turnout: '91%', shortlisted: 8, eligibleCount: 142, funnelStage: 'Algorithmic Coding Scheduled', badgeColor: '#ECFDF5' },
    { id: 'd4', company: 'Cisco Systems', role: 'Network Engineer', ctc: '18.0 LPA', minCgpa: 7.0, turnout: '99%', shortlisted: 32, eligibleCount: 172, funnelStage: 'Interviews in Progress', badgeColor: '#EFF6FF' },
    { id: 'd5', company: 'Oracle Cloud', role: 'MTS Cloud Platforms', ctc: '19.5 LPA', minCgpa: 7.5, turnout: '94%', shortlisted: 18, eligibleCount: 165, funnelStage: 'System Design Round', badgeColor: '#FEF2F2' },
    { id: 'd6', company: 'NVIDIA', role: 'System Software', ctc: '32.0 LPA', minCgpa: 8.5, turnout: '88%', shortlisted: 6, eligibleCount: 96, funnelStage: 'CUDA Architecture Final Round', badgeColor: '#F0FDF4' }
  ]);

  // Placed Students & Mutex Audit Dataset
  const [placedOffers] = useState([
    { id: 'o1', studentName: 'Aarav Patel', usn: '1MS22CS095', company: 'Microsoft', role: 'SDE', ctc: '21.5 LPA', tier: 'Standard Tier' },
    { id: 'o2', studentName: 'Priya Sharma', usn: '1MS22CS108', company: 'Google', role: 'Software Engineer', ctc: '28.0 LPA', tier: 'Dream Tier' },
    { id: 'o3', studentName: 'Ananya Desai', usn: '1MS22CS014', company: 'Goldman Sachs', role: 'Quant Analyst', ctc: '24.0 LPA', tier: 'Dream Tier' },
    { id: 'o4', studentName: 'Divya Krishnan', usn: '1MS22CS032', company: 'Oracle Cloud', role: 'Member Tech Staff', ctc: '19.5 LPA', tier: 'Standard Tier' }
  ]);

  // Handlers
  const handleUpdateStudentStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleApproveAllPending = () => {
    setStudents(prev => prev.map(s => s.status === 'Pending' ? { ...s, status: 'Verified' } : s));
  };

  const handleApproveException = (id) => {
    setExceptions(prev => prev.map(ex => ex.id === id ? { ...ex, status: 'Approved' } : ex));
  };

  const handleRejectException = (id) => {
    setExceptions(prev => prev.map(ex => ex.id === id ? { ...ex, status: 'Rejected' } : ex));
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Department Academic Overview';
      case 'roster': return 'Student Roster Verification';
      case 'exceptions': return 'Backlog Condonations & Exceptions';
      case 'drives': return 'Department Turnout & Drives';
      case 'mutex': return 'Offer Approvals & Mutex Audit';
      default: return 'HoD Governance Console';
    }
  };

  return (
    <div className="student-portal-layout">
      {/* Left Dock Sidebar */}
      <HodSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNavigate={onNavigate}
        hodInfo={hodInfo}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content View */}
      <div className="student-portal-main">
        <header className="student-portal-header">
          <div className="header-left">
            <span className="portal-breadcrumb">
              SEALNET &middot; HoD Academic Governance &middot; {hodInfo.departmentCode} &middot; {getTabTitle()}
            </span>
            <h2 className="portal-page-title">{getTabTitle()}</h2>
          </div>
        </header>

        <main className="student-portal-body">
          {activeTab === 'overview' && (
            <HodOverview
              hodInfo={hodInfo}
              students={students}
              onNavigateTab={setActiveTab}
              onQuickVerify={(id) => handleUpdateStudentStatus(id, 'Verified')}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'roster' && (
            <HodRoster
              students={students}
              onUpdateStudentStatus={handleUpdateStudentStatus}
              onApproveAllPending={handleApproveAllPending}
            />
          )}

          {activeTab === 'exceptions' && (
            <HodExceptions
              exceptions={exceptions}
              onApproveException={handleApproveException}
              onRejectException={handleRejectException}
            />
          )}

          {activeTab === 'drives' && (
            <HodDrives
              drives={drives}
              hodInfo={hodInfo}
            />
          )}

          {activeTab === 'mutex' && (
            <HodMutex
              placedOffers={placedOffers}
              hodInfo={hodInfo}
            />
          )}
        </main>
      </div>

      {/* Compact HoD Profile & Department Analytics Modal */}
      {isProfileOpen && (
        <HodProfileModal
          hodInfo={hodInfo}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
