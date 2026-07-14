const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =====================================================
   GET LOGGED-IN USER
===================================================== */

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE PROFILE
===================================================== */

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
const allowedFields = [
  "name",
  "bio",
  "avatarUrl",
  "location",
  "website",
  "linkedin",

  "startupName",
  "startupTagline",
  "startupDescription",
  "industry",
  "stage",
  "foundedYear",
  "fundingGoal",
  "fundingRaised",
  "equityOffered",
  "skills",
  "pitchDeck",

  "company",
  "designation",
  "preferredIndustries",
  "minimumInvestment",
  "maximumInvestment",
  "experience",
  "portfolioCompanies",
];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

/* ==========================================
   CHANGE EMAIL
========================================== */

if (req.body.email && req.body.email !== user.email) {
  if (!req.body.currentPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password is required",
    });
  }

  const isMatch = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const existingUser = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user.id },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already in use",
    });
  }

  updates.email = req.body.email;
}

/* ==========================================
   CHANGE PASSWORD
========================================== */

if (req.body.newPassword) {
  if (!req.body.currentPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password is required",
    });
  }

  const isMatch = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  updates.password = await bcrypt.hash(req.body.newPassword, 10);
}

    // Determine whether profile is reasonably complete
    if (
      updates.name ||
      updates.bio ||
      updates.location ||
      updates.website ||
      updates.linkedin ||
      updates.startupName ||
      updates.company
    ) {
      updates.profileCompleted = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
  req.body.newPassword
    ? "Password updated successfully"
    : req.body.email && req.body.email !== user.email
    ? "Email updated successfully"
    : "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET ALL USERS
========================================== */

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email role avatarUrl");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
};