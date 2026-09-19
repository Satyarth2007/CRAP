// controller/roster.controller.js
import { parse } from "csv-parse/sync";
import Student from "../models/Student.js";
import { getWorkspace } from "../utils/workspace.js";

const REQUIRED_COLUMNS = ["rollNumber", "name", "departmentCode"];

// ---------- TPO UPLOADS THE STUDENT ROSTER (CSV) ----------
// Creates unclaimed Student shells (Phase 1 of the two-phase record —
// see models/Student.js). Never touches a student who has already
// self-registered, so a re-upload can't silently overwrite anything the
// student themselves provided.
export async function uploadRoster(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Upload a CSV file under the field "roster".' });
    }

    let rows;
    try {
      rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    } catch {
      return res.status(400).json({ message: "Could not parse CSV file. Check the format." });
    }

    if (rows.length === 0) {
      return res.status(400).json({ message: "CSV file has no data rows." });
    }

    const missingColumns = REQUIRED_COLUMNS.filter((c) => !(c in rows[0]));
    if (missingColumns.length > 0) {
      return res.status(400).json({
        message: `CSV is missing required column(s): ${missingColumns.join(", ")}.`,
      });
    }

    const workspace = await getWorkspace();
    const validDeptCodes = new Set(workspace.departments.map((d) => d.code));

    const rollNumbersInFile = rows
      .map((r) => (r.rollNumber || "").trim().toUpperCase())
      .filter(Boolean);

    // Pre-fetch already-registered students so we can skip them explicitly
    // (with a clear reason) rather than relying on a duplicate-key error
    // from bulkWrite to catch it implicitly.
    const alreadyRegistered = await Student.find(
      { workspaceId: workspace._id, rollNumber: { $in: rollNumbersInFile }, status: "registered" },
      { rollNumber: 1 }
    );
    const registeredSet = new Set(alreadyRegistered.map((s) => s.rollNumber));

    const errors = [];
    const operations = [];

    rows.forEach((row, i) => {
      const rowNum = i + 2; // +1 for the header row, +1 for 1-indexing
      const rollNumber = (row.rollNumber || "").trim().toUpperCase();
      const name = (row.name || "").trim();
      const departmentCode = (row.departmentCode || "").trim().toUpperCase();
      const cgpa = row.cgpa ? Number(row.cgpa) : undefined;
      const backlogs = row.backlogs ? Number(row.backlogs) : 0;
      const passingYear = row.passingYear ? Number(row.passingYear) : undefined;

      if (!rollNumber || !name || !departmentCode) {
        errors.push(`Row ${rowNum}: missing rollNumber, name, or departmentCode.`);
        return;
      }
      if (!validDeptCodes.has(departmentCode)) {
        errors.push(`Row ${rowNum}: unknown department code "${departmentCode}".`);
        return;
      }
      if (cgpa !== undefined && Number.isNaN(cgpa)) {
        errors.push(`Row ${rowNum}: invalid cgpa.`);
        return;
      }
      if (registeredSet.has(rollNumber)) {
        errors.push(`Row ${rowNum}: ${rollNumber} is already registered — skipped to avoid overwriting student data.`);
        return;
      }

      operations.push({
        updateOne: {
          filter: { workspaceId: workspace._id, rollNumber, status: "unclaimed" },
          update: {
            $setOnInsert: {
              workspaceId: workspace._id,
              rollNumber,
              status: "unclaimed",
            },
            $set: {
              name,
              departmentCode,
              ...(cgpa !== undefined && { cgpa }),
              backlogs,
              ...(passingYear !== undefined && { passingYear }),
            },
          },
          upsert: true,
        },
      });
    });

    if (operations.length === 0) {
      return res.status(400).json({ message: "No valid rows to import.", errors });
    }

    const result = await Student.bulkWrite(operations, { ordered: false });

    return res.status(200).json({
      message: "Roster processed.",
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      skipped: errors.length,
      errors,
    });
  } catch (err) {
    next(err);
  }
}