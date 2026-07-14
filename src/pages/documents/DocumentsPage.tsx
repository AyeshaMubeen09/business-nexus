import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FilePlus } from "lucide-react";

import DocumentCard from "../../components/documents/DocumentCard";
import UploadDocumentModal from "../../components/documents/UploadDocumentModal";
import DocumentPreviewModal from "../../components/documents/DocumentPreviewModal";
import SignatureModal from "../../components/documents/SignatureModal";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from "../../services/documentService";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  /* ==========================================
     LOAD DOCUMENTS
  ========================================== */

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await getDocuments();

      setDocuments(response.documents || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchDocuments();
}, []);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showPreviewModal) {
      setShowPreviewModal(false);
      setSelectedDocument(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [showPreviewModal]);

  /* ==========================================
     UPLOAD DOCUMENT
  ========================================== */

  const handleUpload = async (title: string, file: File) => {
    try {
      await uploadDocument(title, file);

      toast.success("Document uploaded successfully.");

      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    }
  };

  /* ==========================================
     DELETE DOCUMENT
  ========================================== */

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await deleteDocument(id);

      toast.success("Document deleted.");

      if (selectedDocument?._id === id) {
        setShowPreviewModal(false);
        setSelectedDocument(null);
      }

      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete document.");
    }
  };

  /* ==========================================
     DOWNLOAD DOCUMENT
  ========================================== */

  const handleDownload = (id: string) => {
    downloadDocument(id);
  };

  /* ==========================================
     OPEN DOCUMENT PREVIEW
  ========================================== */

  const handlePreview = (document: any) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  /* ==========================================
     SIGN DOCUMENT
  ========================================== */

 const [showSignatureModal, setShowSignatureModal] = useState(false);

const handleSign = (id: string) => {
  const doc = documents.find((d) => d._id === id);

  if (!doc) return;

  setSelectedDocument(doc);
  setShowSignatureModal(true);
};

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Document Chamber
          </h1>

          <p className="mt-2 text-base text-gray-500">
            Upload, manage and sign your business documents.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
        >
          <FilePlus size={18} />
          Upload
        </button>
      </div>

      {/* Content */}

      {loading ? (
       <div className="flex h-64 items-center justify-center">
  <div className="text-center">
    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

    <p className="text-gray-500">
      Loading documents...
    </p>
  </div>
</div>
      ) : documents.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            No Documents Found
          </h2>

          <p className="mt-3 text-gray-500">
            Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <div
  key={document._id}
  onClick={() => handlePreview(document)}
  className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
>
              <DocumentCard
                document={document}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onSign={handleSign}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}

      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {/* Preview Modal */}

      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onDownload={handleDownload}
      />

<SignatureModal
  isOpen={showSignatureModal}
  onClose={() => {
    setShowSignatureModal(false);
    setSelectedDocument(null);
  }}
  document={selectedDocument}
  onSigned={() => {
    fetchDocuments();
  }}
/>
    </div>
  );
};

export default DocumentsPage;