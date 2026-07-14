const Meeting = require("../models/Meeting");
const User = require("../models/User");

/* ==========================================
   HELPER FUNCTION
========================================== */

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/* ==========================================
   UPDATE MISSED MEETINGS
========================================== */

const updateMissedMeetings = async () => {
  const now = new Date();

const acceptedMeetings = await Meeting.find({
  status: "Accepted",
});

  for (const meeting of acceptedMeetings) {
    const meetingDate = new Date(meeting.date);

    const [hours, minutes] = meeting.endTime
      .split(":")
      .map(Number);

    meetingDate.setHours(hours, minutes, 0, 0);

if (
  meetingDate < now &&
  meeting.status === "Accepted" &&
  !meeting.callStartedAt
) {
  meeting.status = "Missed";
  await meeting.save();
}
  }
};

/* ==========================================
   CREATE MEETING
========================================== */

const createMeeting = async (req, res) => {
  try {
    const {
      investor,
      entrepreneur,
      title,
      description,
      meetingType,
      date,
      startTime,
      endTime,
    } = req.body;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (
      !investor ||
      !entrepreneur ||
      !title ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (investor === entrepreneur) {
      return res.status(400).json({
        success: false,
        message: "Entrepreneur and Investor cannot be the same user.",
      });
    }

    /* ==========================================
       VERIFY USERS
    ========================================== */

    const investorUser = await User.findById(investor);
    const entrepreneurUser = await User.findById(entrepreneur);

    if (!investorUser || !entrepreneurUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (investorUser.role !== "investor") {
      return res.status(400).json({
        success: false,
        message: "Selected investor is not an investor account.",
      });
    }

    if (entrepreneurUser.role !== "entrepreneur") {
      return res.status(400).json({
        success: false,
        message: "Selected entrepreneur is not an entrepreneur account.",
      });
    }

    /* ==========================================
       CONFLICT DETECTION
    ========================================== */

    const existingMeetings = await Meeting.find({
      date: new Date(date),
      status: {
        $in: ["Pending", "Accepted"],
      },
      $or: [
        { entrepreneur },
        { investor },
      ],
    });

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    for (const existingMeeting of existingMeetings) {
      const existingStart = toMinutes(existingMeeting.startTime);
      const existingEnd = toMinutes(existingMeeting.endTime);

      const hasOverlap =
        newStart < existingEnd &&
        newEnd > existingStart;

      if (hasOverlap) {
        return res.status(409).json({
          success: false,
          message: "Meeting slot already booked.",
        });
      }
    }

    /* ==========================================
       CREATE MEETING
    ========================================== */

    const meeting = await Meeting.create({
      investor,
      entrepreneur,
      createdBy: req.user.id,
      title,
      description,
      meetingType,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET MY MEETINGS
========================================== */

const getMyMeetings = async (req, res) => {
  try {
    await updateMissedMeetings();
const meetings = await Meeting.find({
  $or: [
    { entrepreneur: req.user.id },
    { investor: req.user.id },
  ],
})
.populate("entrepreneur", "name email avatarUrl role")
.populate("investor", "name email avatarUrl role")
.populate("createdBy", "name email role")
.sort({
  date: 1,
  startTime: 1,
});

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET SINGLE MEETING
========================================== */

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("entrepreneur", "name email avatarUrl role")
      .populate("investor", "name email avatarUrl role")
      .populate("createdBy", "name email role");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    const isParticipant =
      meeting.entrepreneur._id.toString() === req.user.id ||
      meeting.investor._id.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this meeting.",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   ACCEPT MEETING
========================================== */

const acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // Only investor can accept
    if (meeting.investor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this meeting.",
      });
    }

    // Only pending meetings can be accepted
    if (meeting.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Meeting cannot be accepted because it is already ${meeting.status.toLowerCase()}.`,
      });
    }

    meeting.status = "Accepted";

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting accepted successfully.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   REJECT MEETING
========================================== */

const rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // Only investor can reject
    if (meeting.investor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this meeting.",
      });
    }

    // Only pending meetings can be rejected
    if (meeting.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Meeting cannot be rejected because it is already ${meeting.status.toLowerCase()}.`,
      });
    }

    meeting.status = "Rejected";

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting rejected successfully.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   CANCEL MEETING
========================================== */

const cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // Either participant can cancel
    const isParticipant =
      meeting.entrepreneur.toString() === req.user.id ||
      meeting.investor.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this meeting.",
      });
    }

    // Cannot cancel twice
   if (
  ["Cancelled", "Completed", "Missed"].includes(
    meeting.status
  )
) {
      return res.status(400).json({
        success: false,
        message: `Meeting is already ${meeting.status.toLowerCase()}.`,
      });
    }

    meeting.status = "Cancelled";

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE MEETING
========================================== */

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // Only creator can delete
    if (meeting.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this meeting.",
      });
    }

    // Only pending meetings can be deleted
    if (meeting.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Only pending meetings can be deleted. Current status is ${meeting.status}.`,
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   START MEETING
========================================== */

const startMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    const isParticipant =
      meeting.entrepreneur.toString() === req.user.id ||
      meeting.investor.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to start this meeting.",
      });
    }

    if (meeting.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: `Only accepted meetings can be started.`,
      });
    }

    if (meeting.callStartedAt) {
      return res.status(400).json({
        success: false,
        message: "Meeting has already started.",
      });
    }

    meeting.callStartedAt = new Date();

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting started.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   END MEETING
========================================== */

const endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    const isParticipant =
      meeting.entrepreneur.toString() === req.user.id ||
      meeting.investor.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to end this meeting.",
      });
    }

    if (!meeting.callStartedAt) {
      return res.status(400).json({
        success: false,
        message: "Meeting has not started yet.",
      });
    }

    if (meeting.callEndedAt) {
      return res.status(400).json({
        success: false,
        message: "Meeting has already ended.",
      });
    }

    meeting.callEndedAt = new Date();

meeting.callDuration = Math.floor(
  (meeting.callEndedAt.getTime() -
    meeting.callStartedAt.getTime()) / 1000
);

meeting.status = "Completed";

await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting completed.",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  acceptMeeting,
  rejectMeeting,
  cancelMeeting,
  deleteMeeting,
  startMeeting,
  endMeeting,
};