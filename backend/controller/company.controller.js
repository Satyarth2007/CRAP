// controller/company.controller.js
// Company is NOT tenant-scoped (see models/Company.js) — this is a global
// directory shared across every college deployment's data model, even
// though Phase 1 only has one Workspace. Per-college relationship state
// (approved/pending/rejected) lives on Connection, not here.

import Company from "../models/Company.js";

// ---------- CREATE COMPANY (TPO) ----------
export async function createCompany(req, res, next) {
  try {
    const { name, description, industry, website, logoUrl } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Company name is required." });
    }

    const company = await Company.create({ name, description, industry, website, logoUrl });
    return res.status(201).json({ company });
  } catch (err) {
    next(err);
  }
}

// ---------- LIST COMPANIES ----------
export async function listCompanies(req, res, next) {
  try {
    const companies = await Company.find({}).sort({ name: 1 }).limit(200);
    return res.status(200).json({ companies });
  } catch (err) {
    next(err);
  }
}

// ---------- GET COMPANY BY ID ----------
export async function getCompanyById(req, res, next) {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json({ company });
  } catch (err) {
    next(err);
  }
}