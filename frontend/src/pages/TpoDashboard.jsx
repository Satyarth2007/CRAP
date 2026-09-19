import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import TpoSidebar from '../components/tpo/TpoSidebar';
import TpoAnalytics from '../components/tpo/TpoAnalytics';
import TpoHodGovernance from '../components/tpo/TpoHodGovernance';
import TpoDrives from '../components/tpo/TpoDrives';
import TpoMutexMaster from '../components/tpo/TpoMutexMaster';
import TpoStudents from '../components/tpo/TpoStudents';
import TpoProfileModal from '../components/tpo/TpoProfileModal';

export default function TpoDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const tpoInfo = {
    name: user?.fullName || 'Dr. Suresh Nair',
    initials: 'SN',
    email: user?.email || 'tpo@college.edu',
    institution: 'RV Institute of Technology & Management',
    role: 'Dean / Head of Training & Placement'
  };

  // 1. Department HoD Governance Dataset (For HoD verification requirement)
  const [hodList, setHodList] = useState([
    { id: 'h1', name: 'Dr. Rajesh Kulkarni', department: 'Computer Science & Engineering', code: 'CSE', email: 'hod.cse@college.edu', readinessPct: 92, verifiedStudents: 165, totalStudents: 180, status: 'Verified' },
    { id: 'h2', name: 'Dr. Vandana Sharma', department: 'Information Science & Engineering', code: 'ISE', email: 'hod.ise@college.edu', readinessPct: 88, verifiedStudents: 106, totalStudents: 120, status: 'Verified' },
    { id: 'h3', name: 'Dr. Ramesh Rao', department: 'Electronics & Communication', code: 'ECE', email: 'hod.ece@college.edu', readinessPct: 65, verifiedStudents: 117, totalStudents: 180, status: 'Pending' },
    { id: 'h4', name: 'Dr. Ananth Kumar', department: 'Artificial Intelligence & Machine Learning', code: 'AI/ML', email: 'hod.aiml@college.edu', readinessPct: 95, verifiedStudents: 57, totalStudents: 60, status: 'Verified' },
    { id: 'h5', name: 'Dr. Suresh Hegde', department: 'Mechanical Engineering', code: 'MECH', email: 'hod.mech@college.edu', readinessPct: 58, verifiedStudents: 58, totalStudents: 100, status: 'Pending' },
    { id: 'h6', name: 'Dr. Preeti Sinha', department: 'Civil Engineering', code: 'CIVIL', email: 'hod.civil@college.edu', readinessPct: 82, verifiedStudents: 66, totalStudents: 80, status: 'Verified' }
  ]);

  // 2. Drives Dataset (Can be added to by TPO)
  const [drives, setDrives] = useState([
    { id: 'd1', company: 'Atlassian', role: 'Software Engineer', ctc: '44.0 LPA', tier: 'Super Dream', minCgpa: 8.5, driveDate: '2026-10-04', branches: ['CSE', 'ISE', 'AI/ML'], eligiblePool: 340, funnelStage: 'Final Interviews Scheduled', badgeColor: '#ECFDF5' },
    { id: 'd2', company: 'Google', role: 'SWE-1 Systems', ctc: '28.0 LPA', tier: 'Super Dream', minCgpa: 8.0, driveDate: '2026-10-12', branches: ['CSE', 'ISE', 'AI/ML', 'ECE'], eligiblePool: 480, funnelStage: 'Technical Round 2 Ongoing', badgeColor: '#EEF2FF' },
    { id: 'd3', company: 'Amazon', role: 'SDE-1 (AWS Cloud)', ctc: '22.5 LPA', tier: 'Super Dream', minCgpa: 7.5, driveDate: '2026-10-18', branches: ['CSE', 'ISE', 'AI/ML', 'ECE'], eligiblePool: 520, funnelStage: 'OA Results Released', badgeColor: '#FFFBEB' },
    { id: 'd4', company: 'Goldman Sachs', role: 'Quantitative Analyst', ctc: '24.0 LPA', tier: 'Super Dream', minCgpa: 8.0, driveDate: '2026-10-22', branches: ['CSE', 'ISE', 'AI/ML'], eligiblePool: 320, funnelStage: 'Coding Test Completed', badgeColor: '#ECFDF5' },
    { id: 'd5', company: 'Cisco Systems', role: 'Network Software Engineer', ctc: '18.0 LPA', tier: 'Dream Tier', minCgpa: 7.0, driveDate: '2026-10-28', branches: ['CSE', 'ISE', 'ECE'], eligiblePool: 440, funnelStage: 'Registration Active', badgeColor: '#EFF6FF' },
    { id: 'd6', company: 'Texas Instruments', role: 'Analog & Embedded Systems', ctc: '19.5 LPA', tier: 'Dream Tier', minCgpa: 7.5, driveDate: '2026-11-05', branches: ['ECE'], eligiblePool: 140, funnelStage: 'Resume Screening', badgeColor: '#FEF2F2' },
    { id: 'd7', company: 'Schneider Electric', role: 'Graduate Engineer Trainee', ctc: '9.5 LPA', tier: 'Standard Tier', minCgpa: 6.5, driveDate: '2026-11-12', branches: ['MECH', 'CIVIL', 'ECE'], eligiblePool: 360, funnelStage: 'Shortlisting Active', badgeColor: '#F0FDF4' }
  ]);

  // 3. Mutex Master Offers Ledger
  const [placedOffers] = useState([
    { id: 'o1', studentName: 'Aarav Patel', usn: '1MS22CS095', branch: 'CSE', company: 'Microsoft', role: 'SDE', ctc: '21.5 LPA', tier: 'Standard Tier' },
    { id: 'o2', studentName: 'Priya Sharma', usn: '1MS22CS108', branch: 'CSE', company: 'Google', role: 'Software Engineer', ctc: '28.0 LPA', tier: 'Dream Tier' },
    { id: 'o3', studentName: 'Kavya Hegde', usn: '1MS22IS042', branch: 'ISE', company: 'Atlassian', role: 'Software Engineer', ctc: '44.0 LPA', tier: 'Super Dream' },
    { id: 'o4', studentName: 'Nikhil Verma', usn: '1MS22AI018', branch: 'AI/ML', company: 'NVIDIA', role: 'ML Research Engineer', ctc: '32.0 LPA', tier: 'Super Dream' },
    { id: 'o5', studentName: 'Sanjay Deshmukh', usn: '1MS22EC089', branch: 'ECE', company: 'Qualcomm', role: 'ASIC Design Engineer', ctc: '22.0 LPA', tier: 'Dream Tier' },
    { id: 'o6', studentName: 'Aditya Kulkarni', usn: '1MS22ME034', branch: 'MECH', company: 'Mercedes-Benz R&D', role: 'CAE Simulation Engineer', ctc: '14.0 LPA', tier: 'Dream Tier' },
    { id: 'o7', studentName: 'Divya Krishnan', usn: '1MS22CS032', branch: 'CSE', company: 'Oracle Cloud', role: 'Member Tech Staff', ctc: '19.5 LPA', tier: 'Standard Tier' },
    { id: 'o8', studentName: 'Pooja Reddy', usn: '1MS22CV012', branch: 'CIVIL', company: 'Larsen & Toubro', role: 'Structural Design GET', ctc: '9.0 LPA', tier: 'Standard Tier' }
  ]);

  // 4. All-College Student Pool
  const [studentsPool] = useState([
    { id: 'sp1', name: 'Aarav Patel', usn: '1MS22CS095', branch: 'CSE', cgpa: 8.42, backlogs: 0, status: 'Placed', company: 'Microsoft', ctc: '21.5 LPA' },
    { id: 'sp2', name: 'Priya Sharma', usn: '1MS22CS108', branch: 'CSE', cgpa: 9.15, backlogs: 0, status: 'Placed', company: 'Google', ctc: '28.0 LPA' },
    { id: 'sp3', name: 'Kavya Hegde', usn: '1MS22IS042', branch: 'ISE', cgpa: 9.34, backlogs: 0, status: 'Placed', company: 'Atlassian', ctc: '44.0 LPA' },
    { id: 'sp4', name: 'Nikhil Verma', usn: '1MS22AI018', branch: 'AI/ML', cgpa: 9.02, backlogs: 0, status: 'Placed', company: 'NVIDIA', ctc: '32.0 LPA' },
    { id: 'sp5', name: 'Rahul Chawla', usn: '1MS22EC045', branch: 'ECE', cgpa: 7.85, backlogs: 0, status: 'In Pipeline', company: null, ctc: null },
    { id: 'sp6', name: 'Neha Joshi', usn: '1MS22IS081', branch: 'ISE', cgpa: 8.12, backlogs: 0, status: 'In Pipeline', company: null, ctc: null },
    { id: 'sp7', name: 'Aditya Kulkarni', usn: '1MS22ME034', branch: 'MECH', cgpa: 8.24, backlogs: 0, status: 'Placed', company: 'Mercedes-Benz R&D', ctc: '14.0 LPA' },
    { id: 'sp8', name: 'Sumanth Roy', usn: '1MS22CV052', branch: 'CIVIL', cgpa: 7.45, backlogs: 1, status: 'In Pipeline', company: null, ctc: null }
  ]);

  // Handlers
  const handleUpdateHodStatus = (id, newStatus) => {
    setHodList(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  const handleApproveAllHods = () => {
    setHodList(prev => prev.map(h => ({ ...h, status: 'Verified' })));
  };

  const handleCreateDrive = (newDrive) => {
    setDrives(prev => [newDrive, ...prev]);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'analytics': return 'Institution Analytics & Velocity';
      case 'hod-verify': return 'Departmental HoD Governance';
      case 'drives': return 'Campus Placement Drives';
      case 'mutex-master': return 'Single-Offer Mutex Control';
      case 'students-all': return 'Master Cohort Pool';
      default: return 'TPO Master Administration';
    }
  };

  return (
    <div className="student-portal-layout">
      {/* Left Dock Sidebar */}
      <TpoSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNavigate={onNavigate}
        tpoInfo={tpoInfo}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content View */}
      <div className="student-portal-main">
        <header className="student-portal-header">
          <div className="header-left">
            <span className="portal-breadcrumb">
              SEALNET &middot; TPO Central Administration &middot; {getTabTitle()}
            </span>
            <h2 className="portal-page-title">{getTabTitle()}</h2>
          </div>
        </header>

        <main className="student-portal-body">
          {activeTab === 'analytics' && (
            <TpoAnalytics
              tpoInfo={tpoInfo}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'hod-verify' && (
            <TpoHodGovernance
              hodList={hodList}
              onUpdateHodStatus={handleUpdateHodStatus}
              onApproveAllHods={handleApproveAllHods}
            />
          )}

          {activeTab === 'drives' && (
            <TpoDrives
              drives={drives}
              onCreateDrive={handleCreateDrive}
            />
          )}

          {activeTab === 'mutex-master' && (
            <TpoMutexMaster
              placedOffers={placedOffers}
              tpoInfo={tpoInfo}
            />
          )}

          {activeTab === 'students-all' && (
            <TpoStudents
              studentsPool={studentsPool}
            />
          )}
        </main>
      </div>

      {/* TPO Profile Modal */}
      {isProfileOpen && (
        <TpoProfileModal
          tpoInfo={tpoInfo}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
