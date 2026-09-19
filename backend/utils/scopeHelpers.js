// utils/scopeHelpers.js

// TPO always carries their own workspaceId (set by resolveTenant). HR has
// no workspaceId on its own profile — it's scoped by companyId instead,
// since one company can in principle connect to multiple colleges — so
// HR must specify which workspace it means on every request that touches
// a workspaceId-scoped (tenantScope-covered) collection.
export function getScopedWorkspaceId(req) {
  if (req.role === "TPO") return req.workspaceId;
  return req.body?.workspaceId || req.query?.workspaceId || null;
}