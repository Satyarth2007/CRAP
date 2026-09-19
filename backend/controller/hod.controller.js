// controller/hod.controller.js
// Department-level oversight views for a logged-in, approved HoD.
// Deliberately read-only — HoD governs by visibility, not by editing
// Student/Application/Offer records directly (that stays with
// TPO/HR/Student themselves, per their own endpoints).

import Student from "../models/Student.js";
import Application from "../models/Application.js";

// ---------- LIST STUDENTS IN THIS HoD'S DEPARTMENT ----------
export async function listDepartmentStudents(req, res, next) {
  try {
    const filter = {
      workspaceId: req.workspaceId,
      departmentCode: req.profile.departmentCode,
    };
    if (req.query.status) {
      filter.status = req.query.status; // "unclaimed" | "registered"
    }
    if (req.query.isPlaced !== undefined) {
      filter.isPlaced = req.query.isPlaced === "true";
    }

    const students = await Student.find(filter)
      .select("rollNumber name cgpa backlogs passingYear status isPlaced phone")
      .sort({ rollNumber: 1 });

    return res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
}

// ---------- LIST APPLICATIONS FROM THIS HoD'S DEPARTMENT ----------
export async function listDepartmentApplications(req, res, next) {
  try {
    const deptStudents = await Student.find(
      { workspaceId: req.workspaceId, departmentCode: req.profile.departmentCode },
      { _id: 1 }
    );
    const studentIds = deptStudents.map((s) => s._id);

    const filter = { workspaceId: req.workspaceId, studentId: { $in: studentIds } };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.jobPostingId) {
      filter.jobPostingId = req.query.jobPostingId;
    }

    const applications = await Application.find(filter)
      .populate("studentId", "rollNumber name")
      .populate("jobPostingId", "title role companyId status")
      .sort({ appliedAt: -1 });

    return res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
}

// ---------- DEPARTMENT PLACEMENT SUMMARY ----------
export async function getDepartmentStats(req, res, next) {
  try {
    const filter = { workspaceId: req.workspaceId, departmentCode: req.profile.departmentCode };

    const [totalStudents, registeredStudents, placedStudents] = await Promise.all([
      Student.countDocuments(filter),
      Student.countDocuments({ ...filter, status: "registered" }),
      Student.countDocuments({ ...filter, isPlaced: true }),
    ]);

    return res.status(200).json({
      stats: {
        totalStudents,
        registeredStudents,
        unclaimedStudents: totalStudents - registeredStudents,
        placedStudents,
        placementRate: totalStudents > 0 ? Number(((placedStudents / totalStudents) * 100).toFixed(1)) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}