const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* ==========================================
       BASIC INFORMATION
    ========================================== */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["entrepreneur", "investor"],
      required: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    /* ==========================================
       ENTREPRENEUR PROFILE
    ========================================== */

    startupName: {
      type: String,
      default: "",
    },

    startupTagline: {
      type: String,
      default: "",
    },

    startupDescription: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    stage: {
      type: String,
      enum: [
        "",
        "Idea",
        "Prototype",
        "MVP",
        "Early Revenue",
        "Growth",
        "Scaling",
      ],
      default: "",
    },

    foundedYear: {
      type: Number,
    },

    fundingGoal: {
      type: Number,
      default: 0,
      min: 0,
    },

    fundingRaised: {
      type: Number,
      default: 0,
      min: 0,
    },

    equityOffered: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    skills: {
      type: [String],
      default: [],
    },

    pitchDeck: {
      type: String,
      default: "",
    },

    /* ==========================================
       INVESTOR PROFILE
    ========================================== */

    company: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    preferredIndustries: {
      type: [String],
      default: [],
    },

    minimumInvestment: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumInvestment: {
      type: Number,
      default: 0,
      min: 0,
    },

    experience: {
      type: String,
      default: "",
    },

    portfolioCompanies: {
      type: [String],
      default: [],
    },

    /* ==========================================
       PROFILE STATUS
    ========================================== */

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);