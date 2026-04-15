const CertificateApproval = require("../models/CertificateApproval");
const Course = require("../models/Course");
const User = require("../models/User");

// Public certificate verification endpoint - no authentication required
const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    // Find certificate approval by certificate ID
    const approval = await CertificateApproval.findOne({ certificateId });

    console.log('CertificateApproval query result:', approval);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found. Please verify the certificate ID is correct.",
      });
    }

    // Get course details
    const course = await Course.findById(approval.courseId);
    
    // Get student details (optional - only public info)
    const [student, progress, order] = await Promise.all([
      User.findById(approval.studentId).select('userName userEmail studentId'),
      require("../models/CourseProgress").findOne({ userId: approval.studentId, courseId: approval.courseId }),
      require("../models/Order").findOne({ userId: approval.studentId, courseId: approval.courseId, paymentStatus: 'paid' }).sort({ createdAt: -1 })
    ]);

    const certificateName = progress?.certificateDetails?.fullName || order?.certificateFullName || approval.studentName || student?.userName;
    const certificateFatherName = progress?.certificateDetails?.fatherName || order?.certificateFatherName || approval.studentFatherName;
    const certificateCollegeName = progress?.certificateDetails?.collegeName || order?.certificateCollegeName || approval.studentCollegeName;

    // Return verification data
    return res.status(200).json({
      success: true,
      data: {
        certificateId: approval.certificateId,
        studentId: approval.customStudentId || student?.studentId, // Custom student ID (NXL-STU-XXXX)
        studentName: certificateName,
        studentFatherName: certificateFatherName,
        studentCollegeName: certificateCollegeName,
        courseTitle: approval.courseTitle || course?.title,
        grade: approval.grade,
        issueDate: approval.approvedAt || approval.createdAt,
        issuedBy: course?.certificateOrganization || "Nexora Learn",
        revoked: approval.revoked || false,
        verified: true,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify certificate. Please try again later.",
    });
  }
};

module.exports = {
  verifyCertificate,
};
