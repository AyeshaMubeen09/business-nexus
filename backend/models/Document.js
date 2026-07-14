const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    version: {
      type: Number,
      default: 1,
    },

status: {
  type: String,
  enum: ["Pending", "Signed"],
  default: "Pending",
},

// Base64 signature image
signature: {
  type: String,
  default: "",
},

// User who signed
signedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

// Date of signing
signedAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);