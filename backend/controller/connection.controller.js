// controller/connection.controller.js
import Connection from "../models/Connection.js";
import Company from "../models/Company.js";
import { getScopedWorkspaceId } from "../utils/scopeHelpers.js";

// ---------- TPO CONNECTS A COMPANY TO THEIR OWN WORKSPACE (auto-approved) ----------
// A TPO adding a company on their own college's behalf doesn't need a
// separate approval step — they ARE the approval authority for their
// workspace.
export async function connectCompany(req, res, next) {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const existing = await Connection.findOne({ companyId, workspaceId: req.workspaceId });
    if (existing) {
      return res.status(409).json({ message: `A connection already exists (status: ${existing.status}).` });
    }

    const connection = await Connection.create({
      companyId,
      workspaceId: req.workspaceId,
      status: "approved",
      requestedBy: req.profile._id,
      requestedByModel: "TPO",
      approvedBy: req.profile._id,
      respondedAt: new Date(),
    });

    return res.status(201).json({ connection });
  } catch (err) {
    next(err);
  }
}

// ---------- HR REQUESTS A CONNECTION TO A WORKSPACE (pending TPO approval) ----------
export async function requestConnection(req, res, next) {
  try {
    const { companyId } = req.params;
    const { workspaceId } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }
    if (req.profile.companyId.toString() !== companyId) {
      return res.status(403).json({ message: "You can only request connections for your own company." });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const existing = await Connection.findOne({ companyId, workspaceId });
    if (existing) {
      return res.status(409).json({ message: `A connection already exists (status: ${existing.status}).` });
    }

    const connection = await Connection.create({
      companyId,
      workspaceId,
      status: "pending",
      requestedBy: req.profile._id,
      requestedByModel: "HR",
    });

    return res.status(201).json({ connection });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO APPROVES/REJECTS A PENDING CONNECTION ----------
export async function respondToConnection(req, res, next) {
  try {
    const { connectionId } = req.params;
    const { approve } = req.body; // boolean

    if (typeof approve !== "boolean") {
      return res.status(400).json({ message: '"approve" must be true or false.' });
    }

    const connection = await Connection.findOne({
      _id: connectionId,
      workspaceId: req.workspaceId, // tenantScope-compliant filter; also confirms this TPO owns the workspace
    });
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }
    if (connection.status !== "pending") {
      return res.status(409).json({ message: `This request has already been ${connection.status}.` });
    }

    connection.status = approve ? "approved" : "rejected";
    connection.approvedBy = req.profile._id;
    connection.respondedAt = new Date();
    await connection.save();

    return res.status(200).json({ connection });
  } catch (err) {
    next(err);
  }
}

// ---------- LIST CONNECTIONS ----------
// TPO sees their own workspace's connections. HR must specify which
// workspace (see utils/scopeHelpers.js) — required so the query still
// satisfies tenantScope's mandatory workspaceId filter.
export async function listConnections(req, res, next) {
  try {
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const filter = { workspaceId };
    if (req.role === "HR") {
      filter.companyId = req.profile.companyId;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const connections = await Connection.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ connections });
  } catch (err) {
    next(err);
  }
}