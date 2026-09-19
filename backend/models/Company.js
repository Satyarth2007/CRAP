// models/Company.js
// Company/employer record. Not tenant-scoped by itself — a Company can
// relate to a Workspace via Connection (many-to-many capable, though
// Phase 1 is effectively one Workspace).

import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);