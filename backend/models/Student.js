// models/Student.js
// Two-phase record:
//   Phase 1 — TPO uploads a CSV roster, pre-creating "unclaimed" Student
//             documents (rollNumber, name, department, cgpa, backlogs).
//             userId is null at this point — no login exists yet.
//   Phase 2 — Student self-registers with email + password. The system
//             looks up the existing document by rollNumber and fills in
//             userId (claims it) rather than creating a new document.
//             No matching rollNumber -> registration is blocked.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    // Populated by TPO's CSV roster upload (Phase 1):
    rollNumber: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    departmentCode: { type: String, required: true, trim: true, uppercase: true },
    cgpa: { type: Number, min: 0, max: 10 },
    backlogs: { type: Number, min: 0, default: 0 },
    passingYear: { type: Number },

    // Populated by student self-registration (Phase 2) — null until claimed:
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, unique: true, sparse: true },

    // Populated post-registration, by the student themselves:
    resumeUrl: { type: String, trim: true, default: null },

    githubUrl: { type: String, trim: true, default: null },
    linkedinUrl: { type: String, trim: true, default: null },

    phone: { type: String, trim: true, default: null, required: true },

    documents: [
      {
        label: { type: String, required: true, trim: true }, // e.g. "resume", "idProof"
        documentUrl: { type: String, required: true, trim: true },
        uploadedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],

    semesterResults: [
      {
        semester: { type: Number, required: true, min: 1 },
        documentUrl: { type: String, required: true, trim: true },
        uploadedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],

    // Derived by the system when an Offer is accepted.
    isPlaced: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["unclaimed", "registered"],
      default: "unclaimed",
    },
  },
  { timestamps: true }
);

// A roll number must be unique within a given college (Workspace).
studentSchema.index({ workspaceId: 1, rollNumber: 1 }, { unique: true });

studentSchema.plugin(tenantScope);

export default mongoose.model("Student", studentSchema);