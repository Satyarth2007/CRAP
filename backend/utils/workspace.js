// utils/workspace.js
// This deployment is single-college (Phase 1 scope): exactly one active
// Workspace document exists in the DB, seeded at deploy time via
// scripts/seedTPO.js. This helper resolves it once and caches it in
// memory for the life of the process, since it never changes at runtime.

import Workspace from "../models/Workspace.js";

let cachedWorkspace = null;

export async function getWorkspace() {
  if (cachedWorkspace) return cachedWorkspace;

  const workspace = await Workspace.findOne({ isActive: true });
  if (!workspace) {
    throw new Error(
      "No active Workspace found. Run scripts/seedTPO.js before starting the server."
    );
  }

  cachedWorkspace = workspace;
  return workspace;
}

// Call this if the seeded Workspace is ever updated at runtime (rare —
// mainly useful in tests / re-seeding) to avoid serving a stale cache.
export function clearWorkspaceCache() {
  cachedWorkspace = null;
}