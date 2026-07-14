const fs = require("fs");
const path = require("path");

const Document = require("../models/Document");

/* ==========================================
   HELPER FUNCTION
========================================== */

const getFileUrl = (req, fileName) => {
  return `${req.protocol}://${req.get(
    "host"
  )}/uploads/documents/${fileName}`;
};

/* ==========================================
   UPLOAD DOCUMENT
========================================== */

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document.",
      });
    }

    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document: {
        ...document.toObject(),
        fileUrl: getFileUrl(req, document.fileName),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET MY DOCUMENTS
========================================== */

exports.getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents: documents.map((doc) => ({
        ...doc.toObject(),
        fileUrl: getFileUrl(req, doc.fileName),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET DOCUMENT BY ID
========================================== */

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "uploadedBy",
      "name email role"
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      document: {
        ...document.toObject(),
        fileUrl: getFileUrl(req, document.fileName),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DOWNLOAD DOCUMENT
========================================== */

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const filePath = path.resolve(document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File does not exist.",
      });
    }

    res.download(filePath, document.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE DOCUMENT
========================================== */

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   SAVE SIGNATURE
========================================== */

exports.saveSignature = async (req, res) => {
  try {
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Signature is required.",
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Prevent signing twice
    if (document.status === "Signed") {
      return res.status(400).json({
        success: false,
        message: "This document has already been signed.",
      });
    }

    document.signature = signature;
    document.status = "Signed";
    document.signedBy = req.user.id;
    document.signedAt = new Date();

    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate("uploadedBy", "name email role")
      .populate("signedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Document signed successfully.",
      document: {
        ...populatedDocument.toObject(),
        fileUrl: getFileUrl(req, populatedDocument.fileName),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};