const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    /* ==========================================
       PARTICIPANTS
    ========================================== */

    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ==========================================
       MEETING DETAILS
    ========================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    meetingType: {
      type: String,
      enum: ["Video Call", "Phone Call", "In Person"],
      default: "Video Call",
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    /* ==========================================
       STATUS
    ========================================== */

    status: {
      type: String,
      enum: [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
  "Completed",
  "Missed",
],
      default: "Pending",
    },
/* ==========================================
   CALL DETAILS
========================================== */

callStartedAt: {
  type: Date,
  default: null,
},

callEndedAt: {
  type: Date,
  default: null,
},

callDuration: {
  type: Number,
  default: 0, // Stored in seconds
},


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);