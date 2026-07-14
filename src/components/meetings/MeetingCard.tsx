import React from "react";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
} from "lucide-react";

import { Meeting } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface MeetingCardProps {
  meeting: Meeting;

  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

/* ==========================================
   FORMAT DATE
========================================== */

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ==========================================
   FORMAT TIME
========================================== */

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  return new Date(0, 0, 0, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getDuration = (start?: string, end?: string) => {
  if (!start || !end) return "-";

  const diff = new Date(end).getTime() - new Date(start).getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return `${seconds} sec`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
};

/* ==========================================
   STATUS COLORS
========================================== */

const getStatusClasses = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-gray-100 text-gray-700";

    case "Completed":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
};

/* ==========================================
   ICON
========================================== */

const MeetingTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "Video Call":
      return <Video size={18} />;

    case "Audio Call":
      return <Phone size={18} />;

    default:
      return <MapPin size={18} />;
  }
};

/* ==========================================
   COMPONENT
========================================== */

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onAccept,
  onReject,
  onCancel,
  onDelete,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const isInvestor = meeting.investor._id === user.id;

const isCreator =
  typeof meeting.createdBy === "string"
    ? meeting.createdBy === user?.id
    : meeting.createdBy?._id === user?.id;

  const isPending = meeting.status === "Pending";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <MeetingTypeIcon type={meeting.meetingType} />

            <span className="text-sm text-gray-500">
              {meeting.meetingType}
            </span>

          </div>

          <h2 className="mt-3 text-xl font-semibold">
            {meeting.title}
          </h2>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
            meeting.status
          )}`}
        >
          {meeting.status}
        </span>

      </div>

      {/* Participants */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="flex items-center gap-3">

          <User size={18} />

          <div>

            <p className="text-xs uppercase tracking-wide text-gray-500">
              Entrepreneur
            </p>

            <p className="font-medium">
              {meeting.entrepreneur.name}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <User size={18} />

          <div>

            <p className="text-xs uppercase tracking-wide text-gray-500">
              Investor
            </p>

            <p className="font-medium">
              {meeting.investor.name}
            </p>

          </div>

        </div>

      </div>

      {/* Schedule */}

      <div className="mt-6 flex flex-wrap gap-6">

        <div className="flex items-center gap-2 text-gray-600">

          <Calendar size={18} />

          {formatDate(meeting.date)}

        </div>

        <div className="flex items-center gap-2 text-gray-600">

          <Clock size={18} />

          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}

        </div>

      </div>

      {/* Description */}
{meeting.status !== "Completed" ? (
  <div className="mt-6 flex flex-wrap gap-6">

    <div className="flex items-center gap-2 text-gray-600">
      <Calendar size={18} />
      {formatDate(meeting.date)}
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <Clock size={18} />
      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
    </div>

  </div>
) : (
  <div className="mt-6 flex items-center gap-2 text-gray-600">
    <Calendar size={18} />
    {formatDate(meeting.date)}
  </div>
)}


 {/* Actions */}

<div className="mt-8 flex flex-wrap gap-3">

  {/* Pending: Investor can Accept / Reject */}
  {isPending && isInvestor && (
    <>
      <button
        onClick={() => onAccept(meeting._id)}
        className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
      >
        Accept
      </button>

      <button
        onClick={() => onReject(meeting._id)}
        className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
      >
        Reject
      </button>
    </>
  )}

  {/* Pending: Creator can Delete */}
  {isPending && isCreator && (
    <button
      onClick={() => onDelete(meeting._id)}
      className="rounded-lg border border-red-500 px-5 py-2 font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  )}

  {/* Accepted: Either participant can Cancel */}
  {meeting.status === "Accepted" && (
    <button
      onClick={() => onCancel(meeting._id)}
      className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50"
    >
      Cancel Meeting
    </button>
  )}

</div>

    </div>
  );
};

export default MeetingCard;