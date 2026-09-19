// utils/eligibility.js
// Standalone eligibility check — department-level, not college-wide, per
// the locked architecture decision. Kept separate from any controller so
// it can be unit-tested on its own (pass in plain objects, no DB needed).

export function checkEligibility(student, eligibility) {
  const reasons = [];

  if (eligibility.departments?.length && !eligibility.departments.includes(student.departmentCode)) {
    reasons.push(`Department ${student.departmentCode} is not eligible for this drive.`);
  }

  if (eligibility.minCgpa != null) {
    if (student.cgpa == null || student.cgpa < eligibility.minCgpa) {
      reasons.push(`Minimum CGPA required is ${eligibility.minCgpa}.`);
    }
  }

  if (eligibility.maxBacklogs != null && student.backlogs > eligibility.maxBacklogs) {
    reasons.push(`Maximum allowed backlogs is ${eligibility.maxBacklogs}.`);
  }

  if (eligibility.passingYears?.length && !eligibility.passingYears.includes(student.passingYear)) {
    reasons.push(`This drive is only open to passing years: ${eligibility.passingYears.join(", ")}.`);
  }

  return { eligible: reasons.length === 0, reasons };
}