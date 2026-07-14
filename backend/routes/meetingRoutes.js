const express = require("express");
const router = express.Router();

const {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  acceptMeeting,
  rejectMeeting,
  cancelMeeting,
  deleteMeeting,
  startMeeting,
  endMeeting,
} = require("../controllers/meetingController");

const { protect } = require("../middleware/authMiddleware");

/* ==========================================
   MEETING ROUTES
========================================== */

// Schedule Meeting
router.post("/", protect, createMeeting);

// Get Logged-in User Meetings
router.get("/", protect, getMyMeetings);

// Get Single Meeting
router.get("/:id", protect, getMeetingById);

// Accept Meeting
router.put("/:id/accept", protect, acceptMeeting);

// Reject Meeting
router.put("/:id/reject", protect, rejectMeeting);

// Cancel Meeting
router.put("/:id/cancel", protect, cancelMeeting);

/* ==========================================
   START MEETING
========================================== */

router.put("/:id/start", protect, startMeeting);

/* ==========================================
   END MEETING
========================================== */

router.put("/:id/end", protect, endMeeting);

// Delete Meeting
router.delete("/:id", protect, deleteMeeting);

module.exports = router;