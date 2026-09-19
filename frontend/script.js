// SEALNET BENTO INTERACTIVE MICRO-ENGINES

// 1. Live Eligibility Evaluator
function runBentoEval() {
  const cgpa = parseFloat(document.getElementById('cgpaSlider').value);
  const dept = document.getElementById('branchSelect').value;
  const backlogs = parseInt(document.getElementById('backlogSlider').value);

  document.getElementById('cgpaText').innerText = cgpa.toFixed(2);
  document.getElementById('backlogText').innerText = backlogs;

  // Google: CSE/ECE, CGPA >= 8.0, 0 Backlogs
  const googleBadge = document.getElementById('status-google');
  if ((dept === 'CSE' || dept === 'ECE') && cgpa >= 8.0 && backlogs === 0) {
    googleBadge.className = 'badge-status badge-pass';
    googleBadge.innerText = 'ELIGIBLE';
  } else {
    googleBadge.className = 'badge-status badge-fail';
    googleBadge.innerText = 'INELIGIBLE';
  }

  // Deloitte: All Depts, CGPA >= 6.5, Backlogs <= 1
  const deloitteBadge = document.getElementById('status-deloitte');
  if (cgpa >= 6.5 && backlogs <= 1) {
    deloitteBadge.className = 'badge-status badge-pass';
    deloitteBadge.innerText = 'ELIGIBLE';
  } else {
    deloitteBadge.className = 'badge-status badge-fail';
    deloitteBadge.innerText = 'INELIGIBLE';
  }

  // Tata: MECH/ECE, CGPA >= 7.0, 0 Backlogs
  const tataBadge = document.getElementById('status-tata');
  if ((dept === 'MECH' || dept === 'ECE') && cgpa >= 7.0 && backlogs === 0) {
    tataBadge.className = 'badge-status badge-pass';
    tataBadge.innerText = 'ELIGIBLE';
  } else {
    tataBadge.className = 'badge-status badge-fail';
    tataBadge.innerText = 'INELIGIBLE';
  }
}

// 2. Simulate 2nd Offer Collision (Demonstrates MongoDB Partial Index Mutex)
function simulateOfferCollision() {
  const consoleBox = document.getElementById('mutexConsole');
  const statusText = document.getElementById('mutexStatusText');
  
  statusText.innerText = "POST /api/offers/accept { studentId: '22CS094', drive: 'Amazon' }...";
  
  setTimeout(() => {
    consoleBox.innerHTML += `
      <div class="mutex-line error" style="margin-top: 6px;">[E11000 duplicate key error] index: student_accepted_offer_1 dup key: { studentId: "22CS094" }</div>
      <div class="mutex-line" style="color: #FBBF24;">⚡ ATOMIC MUTEX PREVENTED DOUBLE-OFFER HOARDING!</div>
    `;
    statusText.innerText = "MUTEX ENFORCED: 409 Conflict blocked by Mongo Index.";
  }, 400);
}

// 3. Selection Pipeline Stepper
let currentStage = 3;
const stages = [
  { step: 1, name: "Round 1 (Online Assessment)" },
  { step: 2, name: "Round 2 (Coding Evaluation)" },
  { step: 3, name: "Round 3 (Technical Interview)" },
  { step: 4, name: "Round 4 (HR Interview)" },
  { step: 5, name: "Selected & Offer Extended" }
];

function advanceCandidateRound() {
  if (currentStage < 5) {
    currentStage++;
  } else {
    currentStage = 1;
  }

  const fill = document.getElementById('stepperFill');
  fill.style.width = `${((currentStage - 1) / 4) * 100}%`;

  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById('step' + i);
    if (i < currentStage) {
      node.className = 'step-circle done';
      node.innerText = '✓';
    } else if (i === currentStage) {
      node.className = 'step-circle current';
      node.innerText = i === 5 ? '★' : i;
    } else {
      node.className = 'step-circle';
      node.innerText = i === 5 ? '★' : i;
    }
  }

  document.getElementById('currentStageText').innerText = stages[currentStage - 1].name;
}

// 4. Role Tabs
function switchRoleTab(role, event) {
  document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.role-view-card').forEach(c => c.classList.remove('active'));

  event.currentTarget.classList.add('active');
  document.getElementById('role-' + role).classList.add('active');
}

// 5. Cmd+K Quick Nav
function openCmdPalette() {
  document.getElementById('cmdModal').classList.add('open');
  document.getElementById('cmdSearchInput').focus();
}

function closeCmdPalette(e) {
  if (e.target.id === 'cmdModal' || e.key === 'Escape') {
    document.getElementById('cmdModal').classList.remove('open');
  }
}

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openCmdPalette();
  }
  if (e.key === 'Escape') {
    document.getElementById('cmdModal').classList.remove('open');
  }
});

function triggerCmd(role) {
  alert(`Navigating to ${role.toUpperCase()} Portal in full React deployment!`);
  document.getElementById('cmdModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  runBentoEval();
});
