import {
  Download,
  Trash2,
  PenSquare,
  Check,
  FileText,
  Calendar,
  HardDrive,
  Layers,
  Eye,
} from "lucide-react";

interface DocumentCardProps {
  document: any;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onSign: (id: string) => void;
}

const DocumentCard = ({
  document,
  onDownload,
  onDelete,
  onSign,
}: DocumentCardProps) => {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString();

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      {/* Decorative Background */}

      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-100 blur-3xl opacity-60 transition group-hover:opacity-100" />

      {/* Header */}

     <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <FileText size={28} />
          </div>

          <div>
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {document.title}
            </h3>

            <p className="mt-1 truncate text-sm text-gray-500">
              {document.originalName}
            </p>
          </div>
        </div>

        <span
  className={`ml-3 shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap ${
    document.status === "Signed"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {document.status}
</span>
      </div>

      {/* Information */}

      <div className="relative mt-6 space-y-3 rounded-2xl bg-gray-50 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-blue-500" />
          <span>{formatDate(document.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Layers size={16} className="text-purple-500" />
          <span>Version {document.version}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HardDrive size={16} className="text-emerald-500" />
          <span>{formatSize(document.fileSize)}</span>
        </div>
      </div>

      {/* Hint */}

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-600">
        <Eye size={14} />
        Click card to preview
      </div>

      {/* Actions */}

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(document._id);
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Download size={17} />
          Download
        </button>

<button
  onClick={(e) => {
    e.stopPropagation();

    if (document.status !== "Signed") {
      onSign(document._id);
    }
  }}
  disabled={document.status === "Signed"}
  className={`rounded-xl p-2.5 text-white transition ${
    document.status === "Signed"
      ? "cursor-not-allowed bg-green-500 opacity-70"
      : "bg-emerald-500 hover:bg-emerald-600"
  }`}
  title={
    document.status === "Signed"
      ? "Document Already Signed"
      : "Sign Document"
  }
>
  {document.status === "Signed" ? (
    <Check size={18} />
  ) : (
    <PenSquare size={18} />
  )}
</button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document._id);
          }}
          className="rounded-xl bg-red-500 p-2.5 text-white transition hover:bg-red-600"
          title="Delete Document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;