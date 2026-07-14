import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  Maximize2,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
  onDownload: (id: string) => void;
}

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
  onDownload,
}: DocumentPreviewModalProps) => {
  const [numPages, setNumPages] = useState(0);

  // Default opens closer to Fit Page
  const [scale, setScale] = useState(0.8);

  if (!isOpen || !document) return null;

  const onDocumentLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(numPages);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await window.document.documentElement.requestFullscreen();
      } else {
        await window.document.exitFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">

      <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ===========================
            Header
        ============================ */}

        <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-blue-100 p-3">
              <FileText
                className="text-blue-600"
                size={28}
              />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {document.title}
              </h2>

              <p className="text-sm text-gray-500">
                {document.originalName}
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={22} />
          </button>

        </div>

        {/* ===========================
            Toolbar
        ============================ */}

        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-gray-200 bg-gray-50 px-7 py-4">

          {/* Left Side */}

          <div className="flex flex-wrap items-center gap-3">

            <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {numPages || 0} Pages
            </div>

            <button
              onClick={() => setScale(0.8)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              Fit
            </button>

            <button
              onClick={() => setScale(1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              100%
            </button>

            <button
              onClick={() => setScale(1.5)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              150%
            </button>

          </div>

          {/* Right Side */}

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() =>
                setScale((prev) => Math.max(0.2, prev - 0.1))
              }
              className="rounded-xl border border-gray-300 bg-white p-2 transition hover:bg-gray-100"
            >
              <ZoomOut size={18} />
            </button>

            <div className="min-w-[75px] rounded-xl bg-white px-3 py-2 text-center text-sm font-semibold shadow-sm">
              {Math.round(scale * 100)}%
            </div>

            <button
              onClick={() =>
                setScale((prev) => Math.min(5, prev + 0.1))
              }
              className="rounded-xl border border-gray-300 bg-white p-2 transition hover:bg-gray-100"
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="rounded-xl border border-gray-300 bg-white p-2 transition hover:bg-gray-100"
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>

            <button
              onClick={() => onDownload(document._id)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              <Download size={18} />
              Download
            </button>

          </div>

        </div>

        {/* ===========================
            PDF
        ============================ */}

        <div className="flex-1 overflow-auto bg-gray-100 p-8">

          <div className="mx-auto flex flex-col items-center gap-8">
                        <Document
              file={document.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error(error);
              }}
              loading={
                <div className="flex h-72 w-full items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              }
              error={
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                  <h3 className="text-lg font-semibold text-red-600">
                    Unable to load this PDF
                  </h3>

                  <p className="mt-2 text-sm text-red-500">
                    Please try downloading the document instead.
                  </p>
                </div>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="mb-8 flex flex-col items-center"
                >
                  <div className="mb-3 rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-600 shadow">
                    Page {index + 1}
                  </div>

                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    renderAnnotationLayer
                    renderTextLayer
                    className="overflow-hidden rounded-xl shadow-2xl"
                  />
                </div>
              ))}
            </Document>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentPreviewModal;