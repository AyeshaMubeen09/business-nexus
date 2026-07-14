import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import toast from "react-hot-toast";
import { PenSquare, RotateCcw, Save, X } from "lucide-react";

import { saveSignature } from "../../services/documentService";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
  onSigned: () => void;
}

const SignatureModal = ({
  isOpen,
  onClose,
  document,
  onSigned,
}: SignatureModalProps) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [loading, setLoading] = useState(false);

if (!isOpen || !document) return null;

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

const handleSave = async () => {
  if (!signatureRef.current) return;

  if (signatureRef.current.isEmpty()) {
    toast.error("Please draw your signature first.");
    return;
  }

  try {
    setLoading(true);

    const signature = signatureRef.current
      .getCanvas()
      .toDataURL("image/png");

    await saveSignature(document._id, signature);
    onSigned();

    toast.success("Document signed successfully.");

    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to save signature.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <PenSquare className="text-blue-600" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                E-Signature
              </h2>

              <p className="text-sm text-gray-500">
                Draw your signature below to sign this document.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Canvas */}

        <div className="p-6">
          <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">

            <SignatureCanvas
              ref={signatureRef}
              penColor="#111827"
              canvasProps={{
                width: 900,
                height: 320,
                className: "w-full bg-white",
              }}
            />

          </div>

          <p className="mt-3 text-sm text-gray-500">
            Use your mouse or touchpad to draw your signature.
          </p>
          {document.status === "Signed" && (
  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
    <p className="mb-3 font-medium text-green-700">
      This document has already been signed.
    </p>

    <img
      src={document.signature}
      alt="Signature"
      className="h-20 object-contain"
    />
  </div>
)}
        </div>

        {/* Footer */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5">

          <button
            onClick={clearSignature}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={18} />
            Clear
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />

              {loading ? "Saving..." : "Save Signature"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SignatureModal;