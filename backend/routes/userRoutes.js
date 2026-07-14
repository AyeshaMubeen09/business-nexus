const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getAllUsers,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/* ==========================================
   USERS
========================================== */

router.get("/", protect, getAllUsers);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Entrepreneur only
router.get(
  "/entrepreneur-only",
  protect,
  authorize("entrepreneur"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Entrepreneur!",
      user: req.user,
    });
  }
);

// Investor only
router.get(
  "/investor-only",
  protect,
  authorize("investor"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Investor!",
      user: req.user,
    });
  }
);

module.exports = router;