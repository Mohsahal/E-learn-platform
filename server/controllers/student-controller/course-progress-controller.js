const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const User = require("../../models/User");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const { randomBytes } = require("crypto");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const { generateUniqueStudentId } = require("../../helpers/studentIdGenerator");


//mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    console.log(`Marking lecture as viewed: userId=${userId}, courseId=${courseId}, lectureId=${lectureId}`);

    let progress = await CourseProgress.findOne({ userId, courseId });
    const isFirstTimeWatching = !progress;
    
    console.log(`Progress found: ${!!progress}, isFirstTimeWatching: ${isFirstTimeWatching}`);
    
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true, // Mark as viewed directly
            dateViewed: new Date(),
            progressPercentage: 100, // Assume 100% if explicitly marked as viewed
          },
        ],
      });
      await progress.save();
      

    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      // Only update if not already viewed to prevent unnecessary database writes
      if (lectureProgress && !lectureProgress.viewed) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
        await progress.save();
      } else if (!lectureProgress) {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
          
        });
        await progress.save();
      } else {
        // Lecture already viewed, return existing progress without modification
        return res.status(200).json({
          success: true,
          message: "Lecture already marked as viewed",
          data: progress,
        });
      }
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //check all the lectures are viewed or not based on course completion percentage
    const completionThreshold = (course.completionPercentage || 95) / 100; // Convert percentage to decimal
    
    const viewedLecturesCount = progress.lecturesProgress.filter(p => p.viewed).length;
    const totalLectures = course.curriculum.length;
    const requiredLecturesForCompletion = Math.ceil(totalLectures * completionThreshold);

    if (viewedLecturesCount >= requiredLecturesForCompletion && !progress.completed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: {
        lecturesProgress: progress.lecturesProgress,
        completed: progress.completed,
        completionDate: progress.completionDate
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Get course details to check if it's free
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if course is free (pricing = 0 or null)
    const isFreeOrNoPricing = !course.pricing || course.pricing === 0;

    // Check if student purchased the course
    const studentPurchasedCourses = await StudentCourses.findOne({ userId });
    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    // Check if student is directly enrolled in the course
    const isStudentEnrolledInCourse = course.students?.some(
      (student) => student.studentId === userId
    );

    // Allow access if: course is free, student purchased it, or student is enrolled
    const hasAccess = isFreeOrNoPricing || isCurrentCoursePurchasedByCurrentUserOrNot || isStudentEnrolledInCourse;

    if (!hasAccess) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      // Course already fetched above, no need to fetch again

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// generate and stream certificate PDF for completed courses
const generateCompletionCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    let progress = await CourseProgress.findOne({ userId, courseId });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    
    if (!progress && course.curriculum.length > 0) {
      progress = new CourseProgress({
        userId, courseId, completed: true, completionDate: new Date(),
        lecturesProgress: course.curriculum.map(l => ({ lectureId: l._id, viewed: true, dateViewed: new Date(), progressPercentage: 100 }))
      });
      await progress.save();
    }

    if (!progress || (!progress.completed && !course.curriculum.every(cl => progress.lecturesProgress.find(p => p.lectureId.toString() === cl._id.toString())?.viewed))) {
      return res.status(400).json({ success: false, message: "Course not completed." });
    }

    const CertificateApproval = require("../../models/CertificateApproval");
    const approval = await CertificateApproval.findOne({ courseId, studentId: userId, approvedAt: { $exists: true, $ne: null }, revoked: { $ne: true } });
    if (!approval) return res.status(403).json({ success: false, message: "Not approved." });

    const user = await User.findById(userId);
    const studentNameToPrint = progress.certificateDetails?.fullName || user.userName || "Student";
    const courseNameToPrint = approval.courseTitle || course.title;
    const printedGrade = approval.grade || "A+";
    let studentIdToPrint = user.studentId || await generateUniqueStudentId();
    if (!user.studentId) { user.studentId = studentIdToPrint; await user.save(); }

    let certificateId = approval.certificateId || randomBytes(8).toString("hex").toUpperCase();
    if (!approval.certificateId) { approval.certificateId = certificateId; }
    const issuedOn = new Date(progress.completionDate || Date.now()).toDateString();

    approval.customStudentId = studentIdToPrint;
    await approval.save();

    // Set headers for optimal PDF compatibility
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=certificate_${(studentNameToPrint || "student").replace(/\s+/g, "_")}.pdf`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const mainPurple = "#6a1b9a";

    // 1. Thick purple border
    const bPadding = 10;
    doc.save().lineWidth(12).strokeColor(mainPurple).rect(bPadding, bPadding, pageWidth - bPadding * 2, pageHeight - bPadding * 2).stroke();

    // 2. Header
    doc.moveDown(5);
    doc.font("Helvetica-Bold").fontSize(48).fillColor(mainPurple).text("CERTIFICATE", { align: "center", characterSpacing: 3,});
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(18).fillColor("#000").text("OF COMPLETION", { align: "center" });

    // 3. certify text
    doc.moveDown(1.5).fontSize(18).text("This is to certify that", { align: "center" });

    // 4. Student Name
    doc.moveDown(0.8).font("Helvetica-Bold").fontSize(42).text(studentNameToPrint, { align: "center" });
    const nWidth = doc.widthOfString(studentNameToPrint);
    doc.moveTo((pageWidth - nWidth) / 2, doc.y + 2).lineTo((pageWidth + nWidth) / 2, doc.y + 2).lineWidth(2).strokeColor("#ccc").stroke();

    // background (optional - URL from course settings or local file)

    

    
    // 5. Course Completion Section
    doc.moveDown(0.2);
    doc.font("Helvetica")
       .fontSize(18)
       .fillColor("#000")
       .text("has successfully completed the course", { align: "center" });

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold")
       .fontSize(28)
       .fillColor(mainPurple)
       .text(courseNameToPrint, { align: "center" });

    doc.moveDown(0.5);
    doc.font("Helvetica")
       .fontSize(18)
       .fillColor("#000")
       .text("with outstanding performance", { align: "center" });

    // 6. Informational Grid
    const infoStartY = 390;
    const leftColX = 100;
    const rightColX = pageWidth - 260;

    doc.fontSize(16).fillColor("#000");
    
    doc.font("Helvetica-Bold").text("Date: ", leftColX, infoStartY, { continued: true })
       .font("Helvetica").text(issuedOn);
    doc.font("Helvetica-Bold").text("Certificate ID: ", leftColX, infoStartY + 25, { continued: true })
       .font("Helvetica").text(certificateId);

    doc.font("Helvetica-Bold").text("Student ID: ", rightColX, infoStartY, { continued: true })
       .font("Helvetica").text(studentIdToPrint);
    doc.font("Helvetica-Bold").text("Grade: ", rightColX, infoStartY + 25, { continued: true })
       .font("Helvetica").text(printedGrade);

    // 7. Footer: Nexora Learn Authorized Signature and Verification
    const footY = pageHeight - 120;
    
    // Verification QR Code positioned on the left
    try {
      const clientUrlFromEnv = process.env.CLIENT_URL || "http://localhost:5173";
      const primaryUrl = clientUrlFromEnv.split(',')[0].trim();
      const qrData = await QRCode.toDataURL(`${primaryUrl}/verify-certificate/${certificateId}`, { errorCorrectionLevel: "H", margin: 1 });
      const qBuf = Buffer.from(qrData.split(",")[1], "base64");
      const qSize = 70;
      const qPosX = 120;
      doc.image(qBuf, qPosX, footY - 15, { width: qSize, height: qSize });
      doc.fontSize(8).text("Scan to Verify", qPosX, footY - 15 + qSize + 5, { width: qSize, align: "center" });
    } catch (_) {}
    
    // Stylized Nexora Learn Signature positioned on the right
    const authWidth = 220;
    const authX = pageWidth - 120 - authWidth;
    
    doc.font("Times-BoldItalic").fontSize(26).fillColor("#000")
       .text("Nexora Learn", authX, footY - 15, { width: authWidth, align: "center" });
       
    doc.moveTo(authX, footY + 15).lineTo(authX + authWidth, footY + 15).lineWidth(1.2).strokeColor("#000").stroke();
    doc.font("Helvetica").fontSize(10).text("Authorized Signature", authX, footY + 20, { width: authWidth, align: "center" });

    doc.fontSize(8).fillColor("#777").text("Generated by Nexora Learn", bPadding + 20, pageHeight - bPadding - 15);
    doc.end();
  } catch (error) {
    console.error('Certificate generation error:', error);
    if (!res.headersSent) res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//update video progress percentage
const updateVideoProgress = async (req, res) => {
  try {
    const { userId, courseId, lectureId, progressPercentage } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: false,
            dateViewed: null,
            progressPercentage: progressPercentage || 0,
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.progressPercentage = progressPercentage || 0;
        
        // Check if this lecture meets the completion threshold
        const course = await Course.findById(courseId);
        const completionThreshold = (course?.completionPercentage || 95);
        
        if (lectureProgress.progressPercentage >= completionThreshold && !lectureProgress.viewed) {
          lectureProgress.viewed = true;
          lectureProgress.dateViewed = new Date();
        }
        
        await progress.save();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: false,
          dateViewed: null,
          progressPercentage: progressPercentage || 0,
        });
        await progress.save();
      }
    }

    // Check if course is completed
    const course = await Course.findById(courseId);
    if (course) {
      const allLecturesViewed = course.curriculum.every(courseLecture => {
        const progressEntry = progress.lecturesProgress.find(p => p.lectureId.toString() === courseLecture._id.toString());
        return progressEntry && progressEntry.viewed;
      });

      console.log(`All lectures viewed: ${allLecturesViewed}, Current completed: ${progress.completed}`);
      console.log(`Course curriculum length: ${course.curriculum.length}, Progress lectures: ${progress.lecturesProgress.length}`);

      if (allLecturesViewed && !progress.completed) {
        progress.completed = true;
        progress.completionDate = new Date();
        await progress.save();
        console.log('Course marked as completed');
      }
    }

    res.status(200).json({
      success: true,
      message: "Video progress updated",
      data: {
        lecturesProgress: progress.lecturesProgress,
        completed: progress.completed,
        completionDate: progress.completionDate
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  generateCompletionCertificate,
  updateVideoProgress,
};

// Helper function to check and set overall course completion
const checkAndSetOverallCourseCompletion = async (progress, course) => {
  if (!course || !progress || course.curriculum.length === 0) {
    return;
  }

  const totalLectures = course.curriculum.length;
  let totalProgressSum = 0;

  for (const lecture of course.curriculum) {
    const progressEntry = progress.lecturesProgress.find(p => p.lectureId.toString() === lecture._id.toString());
    totalProgressSum += (progressEntry?.progressPercentage || 0);
  }

  const overallCourseProgress = (totalProgressSum / totalLectures);
  const courseCompletionThreshold = (course.completionPercentage || 95);

  if (overallCourseProgress >= courseCompletionThreshold && !progress.completed) {
    progress.completed = true;
    progress.completionDate = new Date();
    await progress.save();
  } else if (overallCourseProgress < courseCompletionThreshold && progress.completed) {
    // If progress drops below threshold after being completed (e.g., due to reset or re-watch)
    progress.completed = false;
    progress.completionDate = null;
    await progress.save();
  }
};
