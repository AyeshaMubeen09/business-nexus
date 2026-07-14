const express = require("express");

const router = express.Router();

const uploadDocument = require("../middleware/uploadDocument");
const { protect } = require("../middleware/authMiddleware");

const {
  uploadDocument: upload,
  getMyDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
  saveSignature,
} = require("../controllers/documentController");

/* ==========================================
   DOCUMENT ROUTES
========================================== */

// Upload
router.post(
  "/upload",
  protect,
  uploadDocument.single("document"),
  upload
);

// Get all documents
router.get("/", protect, getMyDocuments);

// Get single document
router.get("/:id", protect, getDocumentById);

// Download document
router.get("/download/:id", protect, downloadDocument);

// Save signature
router.put("/sign/:id", protect, saveSignature);

// Delete document
router.delete("/:id", protect, deleteDocument);

module.exports = router;