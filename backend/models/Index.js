// models/index.js
// Central export for all 11 SealNet schemas (ES Modules).
// SuperAdmin and AdminAuditLog were removed — single-college scope means
// TPO is the top-level in-app authority; no platform-level admin remains.

export { default as Workspace } from "./Workspace.js";
export { default as Company } from "./Company.js";
export { default as User } from "./User.js";
export { default as TPO } from "./Tpo.js";
export { default as HoD } from "./Hod.js";
export { default as Student } from "./Student.js";
export { default as HR } from "./Hr.js";
export { default as Connection } from "./Connection.js";
export { default as JobPosting } from "./JobPosting.js";
export { default as Application } from "./Application.js";
export { default as Offer } from "./Offer.js";