const CertificateApproval = require("../../models/CertificateApproval");
const User = require("../../models/User");
const Course = require("../../models/Course");
const mongoose = require("mongoose");

const approveCertificate = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    const approverId = req.body.approverId || req.user?._id || req.user?.id;
    if (!courseId || !studentId) return res.status(400).json({ success: false, message: "courseId and studentId are required" });
    // Fetch enrollment certificate details if available
    const CourseProgress = require("../../models/CourseProgress");
    const [user, course, progress] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
      CourseProgress.findOne({ userId: studentId, courseId })
    ]);
    const enrollmentDetails = progress?.certificateDetails || {};

    const studentNameFromEnrollment = enrollmentDetails.fullName || user?.userName || user?.userEmail || String(studentId);
    const studentEmailFromEnrollment = enrollmentDetails.email || user?.userEmail || undefined;
    const studentFatherNameFromEnrollment = enrollmentDetails.fatherName || user?.guardianName || user?.guardianDetails || undefined;
    const studentCollegeNameFromEnrollment = enrollmentDetails.collegeName || undefined;
    const studentPhoneFromEnrollment = enrollmentDetails.phone || undefined;
    const customStudentId = user?.studentId || undefined; // Custom student ID (NXL-STU-XXXX)
    const courseTitle = course?.certificateCourseName || course?.title || undefined;

    // Generate unique certificate ID if not present
    const certificateId = `NXL-CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const doc = await CertificateApproval.findOneAndUpdate(
      { courseId, studentId },
      { 
        approvedBy: approverId, 
        approvedAt: new Date(), 
        revoked: false, 
        revokedAt: null,
        certificateId,
        studentName: studentNameFromEnrollment,
        studentEmail: studentEmailFromEnrollment,
        studentFatherName: studentFatherNameFromEnrollment,
        studentCollegeName: studentCollegeNameFromEnrollment,
        studentPhone: studentPhoneFromEnrollment,
        customStudentId,
        courseTitle,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to approve certificate" });
  }
};

const revokeCertificate = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    if (!courseId || !studentId) return res.status(400).json({ success: false, message: "courseId and studentId are required" });
    const doc = await CertificateApproval.findOneAndUpdate(
      { courseId, studentId },
      { revoked: true, revokedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to revoke certificate" });
  }
};

const requestCertificate = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    if (!courseId || !studentId) return res.status(400).json({ success: false, message: "courseId and studentId are required" });

    // Check if already requested or approved
    const existing = await CertificateApproval.findOne({ courseId, studentId });
    if (existing && !existing.revoked) {
      return res.status(200).json({ success: true, message: "Certificate already requested or approved", data: existing });
    }

    const doc = await CertificateApproval.findOneAndUpdate(
      { courseId, studentId },
      { requestedAt: new Date(), revoked: false, revokedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, message: "Certificate requested successfully", data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to request certificate" });
  }
};

const listApprovedForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const docs = await CertificateApproval.find({ courseId, revoked: { $ne: true } });
    res.status(200).json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to list approvals" });
  }
};

const checkEligibility = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const doc = await CertificateApproval.findOne({ courseId, studentId });
    
    res.status(200).json({ 
      success: true, 
      data: {
        requested: !!doc?.requestedAt,
        approved: !!doc?.approvedAt && !doc?.revoked,
        rejected: !!doc?.revoked
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to check eligibility" });
  }
};

const bulkApproveCertificates = async (req, res) => {
  try {
    // Handle potential casing issues or missing body
    const courseId = req.body.courseId || req.body.courseid;
    const studentIds = req.body.studentIds || req.body.studentids;
    const approverId = req.body.approverId || req.body.approverid || req.user?._id || req.user?.id;
    
    console.log('Bulk approve check:', { courseId, studentIds, isArray: Array.isArray(studentIds) });
    
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }
    if (!studentIds) {
      return res.status(400).json({ success: false, message: "studentIds is required" });
    }
    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ success: false, message: "studentIds must be an array" });
    }

    const validStudentIds = studentIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    const [users, course, allProgress] = await Promise.all([
      User.find({ _id: { $in: validStudentIds } }),
      Course.findById(courseId),
      require("../../models/CourseProgress").find({ courseId, userId: { $in: validStudentIds } })
    ]);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u; });

    const progressMap = {};
    allProgress.forEach(p => { progressMap[p.userId] = p; });
    
    const courseTitle = course.certificateCourseName || course.title || undefined;

    // Use bulkWrite for better performance if updating many docs
    const operations = validStudentIds.map((studentId) => {
      const user = userMap[studentId];
      if (!user) return null;

      const progress = progressMap[studentId];
      const enrollmentDetails = progress?.certificateDetails || {};

      const studentName = enrollmentDetails.fullName || user.userName || user.userEmail || String(studentId);
      const studentEmail = enrollmentDetails.email || user.userEmail || undefined;
      const studentFatherName = enrollmentDetails.fatherName || user.guardianName || user.guardianDetails || undefined;
      const studentCollegeName = enrollmentDetails.collegeName || undefined;
      const studentPhone = enrollmentDetails.phone || undefined;
      const customStudentId = user.studentId || undefined;
      
      const certificateId = `NXL-CERT-B-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      return {
        updateOne: {
          filter: { courseId, studentId },
          update: {
            $set: {
              approvedBy: approverId,
              approvedAt: new Date(),
              revoked: false,
              revokedAt: null,
              certificateId,
              studentName,
              studentEmail,
              studentFatherName,
              studentCollegeName,
              studentPhone,
              customStudentId,
              courseTitle,
            }
          },
          upsert: true
        }
      };
    }).filter(Boolean);

    if (operations.length > 0) {
      await CertificateApproval.bulkWrite(operations);
    }

    res.status(200).json({ success: true, count: operations.length });
  } catch (e) {
    console.error('Bulk approve error:', e);
    res.status(500).json({ 
      success: false, 
      message: e.message || "Failed to bulk approve certificates",
      error: e.name
    });
  }
};

const bulkRevokeCertificates = async (req, res) => {
  try {
    const { courseId, studentIds } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }
    if (!studentIds) {
      return res.status(400).json({ success: false, message: "studentIds is required" });
    }
    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ success: false, message: "studentIds must be an array" });
    }

    await CertificateApproval.updateMany(
      { courseId, studentId: { $in: studentIds } },
      { $set: { revoked: true, revokedAt: new Date() } }
    );

    res.status(200).json({ success: true, message: "Certificates revoked successfully" });
  } catch (e) {
    console.error('Bulk revoke error:', e);
    res.status(500).json({ success: false, message: "Failed to bulk revoke certificates", error: e.message });
  }
};

module.exports = { 
  approveCertificate, 
  revokeCertificate, 
  listApprovedForCourse, 
  checkEligibility,
  bulkApproveCertificates,
  bulkRevokeCertificates,
  requestCertificate
};


