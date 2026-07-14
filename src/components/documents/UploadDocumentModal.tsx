import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => Promise<void>;
}

const UploadDocumentModal = ({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentModalProps) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a document title.");
      return;
    }

    if (!file) {
      toast.error("Please select a document.");
      return;
    }

    try {
      setLoading(true);

      await onUpload(title, file);

      setTitle("");
      setFile(null);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Upload Document
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Document Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Select File
            </label>

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {file && (
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
              <p className="font-medium text-white">{file.name}</p>
              <p className="mt-1 text-sm text-slate-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={18} />

            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;