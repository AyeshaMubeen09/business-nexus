const User = require("../models/User");

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
    const allowedFields = [
      // Basic
      "name",
      "bio",
      "avatarUrl",
      "location",
      "website",
      "linkedin",

      // Entrepreneur
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

      // Investor
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
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};