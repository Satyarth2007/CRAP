# SEALNET · Project Folder Structure & Architecture

> **Campus Recruitment Automation Infrastructure**  
> *Frontend Architecture, Modular Role-Based Portals, and Backend API Specs*

---

## 📁 Complete Directory Tree

```
sealnet/
├── index.html                           # Standalone browser executable (React 18 + Babel in-browser runner)
├── style.css                            # Global design system & theme stylesheet (100% responsive)
├── script.js                            # Standalone auxiliary scripts
├── package.json                         # Vite/React project dependencies
├── vite.config.js                       # Vite bundler configuration
├── PROJECT_STRUCTURE.md                 # Project structure & file overview documentation
│
├── src/                                 # Modular React Frontend Source
│   ├── main.jsx                         # React DOM application root entry point
│   ├── App.jsx                          # Primary client-side route manager ('/', '/student', '/hod', '/tpo')
│   │
│   ├── components/                      # Shared Components
│   │   ├── Navbar.jsx                   # Sticky top header navigation with auth triggers
│   │   ├── Hero.jsx                     # Hero section with CTA & brand presentation
│   │   ├── CommandCenter.jsx             # Live placement telemetry & architectural showcase
│   │   ├── RoleShowcase.jsx             # Three-tier institutional role cards (Student, HoD, TPO)
│   │   ├── Footer.jsx                   # System architecture footer
│   │   ├── AuthModal.jsx                # Unified authentication dialog (Login, Student Register, HoD Register with OTP)
│   │   │
│   │   ├── student/                     # Student Placement Portal Components
│   │   │   ├── StudentSidebar.jsx       # Executive light dock sidebar (brand emblem, 5 tabs, avatar)
│   │   │   ├── StudentOverview.jsx      # Student dashboard home (KPIs, active schedule, placement progress)
│   │   │   ├── StudentDrives.jsx        # Visiting drives directory, eligibility check & 1-click apply
│   │   │   ├── StudentApplications.jsx  # Live application stage tracker & selection funnel
│   │   │   ├── StudentOffers.jsx        # Atomic single-offer ledger & Dream upgrade policy
│   │   │   └── StudentProfile.jsx       # Student verified credentials, locked CGPA & resume portfolio
│   │   │
│   │   ├── hod/                         # Head of Department (HoD) Governance Components
│   │   │   ├── HodSidebar.jsx           # HoD executive light dock sidebar (tooltips, avatar, brand)
│   │   │   ├── HodOverview.jsx          # Departmental overview, 4 live KPIs & urgent verification queue
│   │   │   ├── HodRoster.jsx            # Student verification desk, anti-fraud CGPA lock & batch approval
│   │   │   ├── HodExceptions.jsx        # Backlog condonations desk & verified PDF document inspection
│   │   │   ├── HodDrives.jsx            # Departmental candidate turnout & drive monitoring
│   │   │   ├── HodMutex.jsx             # Department offer approvals & atomic mutex audit
│   │   │   └── HodProfileModal.jsx      # HoD profile drawer, round elimination audit & YoY growth tracker
│   │   │
│   │   └── tpo/                         # Training & Placement Officer (TPO) Command Center
│   │       ├── TpoSidebar.jsx           # TPO executive light dock sidebar (5 tabs, dean badge)
│   │       ├── TpoAnalytics.jsx         # College-wide analytics, branch bar chart, CTC tiers & hiring velocity
│   │       ├── TpoHodGovernance.jsx     # HoD accreditation authority desk (verify/revoke department heads)
│   │       ├── TpoDrives.jsx            # Campus drives management & live listing grid
│   │       ├── CreateDriveModal.jsx     # Interactive modal to create and publish new placement drives
│   │       ├── TpoMutexMaster.jsx       # College-wide single-offer mutex ledger & CSV export
│   │       ├── TpoStudents.jsx          # Master cohort student talent pool across all 6 departments
│   │       └── TpoProfileModal.jsx      # TPO Dean profile card & institutional accreditation status
│   │
│   ├── pages/                           # Application Route Pages
│   │   ├── LandingPage.jsx              # Main public landing page
│   │   ├── StudentDashboard.jsx         # Authenticated Student portal page
│   │   ├── HodDashboard.jsx             # Authenticated HoD governance page
│   │   └── TpoDashboard.jsx             # Authenticated TPO central command page
│   │
│   ├── contexts/                        # React Global State Contexts
│   │   └── AuthContext.jsx              # Session state, JWT persistence, local fallback authentication
│   │
│   ├── hooks/                           # Custom React Hooks
│   │   └── useAuth.js                   # Hook wrapper for accessing AuthContext
│   │
│   └── services/                        # API Integration Layer
│       └── api.js                       # Axios/Fetch API client for Node/Express backend endpoints
│
└── server/                              # Node.js + Express Backend & Database (In Progress by Teammate)
    ├── .env                             # Environment variables (PORT, MONGO_URI, JWT_SECRET)
    ├── package.json                     # Backend dependencies (express, mongoose, bcryptjs, jsonwebtoken)
    ├── package-lock.json                # Lockfile for backend npm dependencies
    ├── server.js                        # Express server entry point & MongoDB connection
    │
    ├── config/
    │   └── db.js                        # MongoDB database connection configuration
    │
    ├── controllers/
    │   └── authController.js            # Registration, login, and JWT issuance controllers
    │
    ├── middleware/
    │   └── authMiddleware.js            # JWT verification & role-based access control (RBAC)
    │
    ├── models/
    │   ├── User.js                      # User schema (Student, HoD, TPO roles)
    │   └── StudentRoster.js             # Student academic credentials, CGPA lock & status schema
    │
    └── routes/
        └── authRoutes.js                # Authentication API routes (/api/auth/login, /register, etc.)
```

---

## 🧭 Module Breakdown & Responsibility

### 1. Root Directory
| File | Role |
| :--- | :--- |
| [`index.html`](file:///C:/Users/rohan/OneDrive/Desktop/sealnet/index.html) | Standalone single-file executable runner. Enables instant double-click execution directly in any browser with in-browser React 18 & Babel compilation. |
| [`style.css`](file:///C:/Users/rohan/OneDrive/Desktop/sealnet/style.css) | Core CSS design system. Contains executive light dock theme, bento cards, responsive data tables, micro-charts, and animation keyframes. |
| [`vite.config.js`](file:///C:/Users/rohan/OneDrive/Desktop/sealnet/vite.config.js) | Vite configuration for running the modular React codebase via `npm run dev`. |

---

### 2. Frontend Modules (`src/components/`)

#### 🎓 Student Portal (`src/components/student/`)
- **StudentSidebar**: Clean executive dock navigation with hover tooltips and dynamic student avatar.
- **StudentOverview**: Academic KPIs, active interview schedules, and application status.
- **StudentDrives**: Searchable list of visiting company drives with eligibility gating and 1-click apply.
- **StudentApplications**: Stage-by-stage hiring funnel (Applied &rarr; OA &rarr; Tech 1 &rarr; Tech 2 &rarr; HR).
- **StudentOffers**: Single-offer ledger enforcing mutex rules and Dream Tier upgrade requests.
- **StudentProfile**: Verified academic records, lock indicator, skills, and resume portfolio.

#### 🏛️ HoD Academic Governance (`src/components/hod/`)
- **HodSidebar**: Executive light dock sidebar with HoD initials badge.
- **HodOverview**: Departmental snapshot (class size, verification counters, 1-click urgent queue).
- **HodRoster**: Interactive candidate verification table with tamper-proof "Verify & Lock" and batch approval.
- **HodExceptions**: Backlog condonation desk for reviewing medical/special appeals with PDF inspect simulator.
- **HodDrives**: Department turnout monitoring across all visiting companies.
- **HodMutex**: Enforces unique accepted offer constraints for the department with CSV export.
- **HodProfileModal**: Mini-dashboard showing placed vs unplaced, round elimination diagnostic bars (OA, Tech 1, Tech 2, HR), and 3-year YoY department growth tracker.

#### 🏢 TPO Central Command (`src/components/tpo/`)
- **TpoSidebar**: Full-featured dock navigation for institutional administration.
- **TpoAnalytics**: College-wide analytics with interactive micro-charts:
  - Branch-wise placement performance bar chart (CSE, ISE, AI/ML, ECE, MECH, CIVIL).
  - CTC tier distribution pyramid (Super Dream >20 LPA, Dream, Core, Mass).
  - Recruitment velocity monthly trend curve (Aug to Mar).
  - Hiring sector breakdown (Product, FinTech, Cloud, Core).
- **TpoHodGovernance**: Institutional authority desk to verify, approve, or revoke Department HoDs.
- **TpoDrives**: Campus drives management with live listing grid.
- **CreateDriveModal**: Live modal form to publish new placement drives across selected engineering branches.
- **TpoMutexMaster**: Cross-departmental offer mutex ledger preventing multi-offer seat hoarding.
- **TpoStudents**: Master cohort talent pool across all 720 students.
- **TpoProfileModal**: Dean placement accreditation profile card.

---

### 3. Backend Architecture (`server/`)
- Designed for seamless integration with the frontend via [`src/services/api.js`](file:///C:/Users/rohan/OneDrive/Desktop/sealnet/src/services/api.js).
- Handles MongoDB persistence, JWT authentication, and RBAC authorization headers (`Student`, `HoD`, `TPO`).
