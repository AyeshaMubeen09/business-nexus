import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import ScheduleMeetingModal from "../../components/meetings/ScheduleMeetingModal";

import {
  getMyMeetings,
  acceptMeeting,
  rejectMeeting,
  cancelMeeting,
  deleteMeeting,
} from "../../services/meetingService";

import { Meeting } from "../../types";

/* ==========================================
   MEETINGS PAGE
========================================== */

const MeetingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  /* ==========================================
     LOAD MEETINGS
  ========================================== */

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);

      const data = await getMyMeetings();

const statusPriority: Record<string, number> = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
  Cancelled: 3,
  Missed: 4,
  Completed: 5,
};

const sortedMeetings = [...(data.meetings || [])].sort((a, b) => {
  const priorityA = statusPriority[a.status] ?? 99;
  const priorityB = statusPriority[b.status] ?? 99;

  // First sort by meeting status
  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  // Accepted meetings:
  // Show the earliest upcoming meeting first.
  if (a.status === "Accepted" && b.status === "Accepted") {
    const dateTimeA = new Date(`${a.date}T${a.startTime}`).getTime();
    const dateTimeB = new Date(`${b.date}T${b.startTime}`).getTime();

    return dateTimeA - dateTimeB;
  }

  // All other statuses:
  // Show newest created first (if timestamps exist).
  return (
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
  );
});

setMeetings(sortedMeetings);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load meetings."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  /* ==========================================
     ACTIONS
  ========================================== */

  const handleAccept = async (id: string) => {
    try {
      await acceptMeeting(id);

      toast.success("Meeting accepted.");

      fetchMeetings();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMeeting(id);

      toast.success("Meeting rejected.");

      fetchMeetings();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMeeting(id);

      toast.success("Meeting cancelled.");

      fetchMeetings();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this meeting?")) return;

    try {
      await deleteMeeting(id);

      toast.success("Meeting deleted.");

      fetchMeetings();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  /* ==========================================
     STATUS COLOR
  ========================================== */

 const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-gray-200 text-gray-700";

    case "Completed":
      return "bg-emerald-100 text-emerald-700";

    case "Missed":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "-";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
};

  /* ==========================================
     LOADING
  ========================================== */

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Meetings
        </h1>

        <p className="mt-6 text-gray-500">
          Loading meetings...
        </p>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Meetings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all your scheduled meetings.
          </p>
        </div>

       <button
  onClick={() => setShowScheduleModal(true)}
  className="
    rounded-xl
    bg-blue-600
    px-5
    py-3
    font-medium
    text-white
    hover:bg-blue-700
    transition
  "
>
  Schedule Meeting
</button>

      </div>

      {/* EMPTY */}

      {meetings.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            bg-white
            py-20
            text-center
          "
        >
          <h2 className="text-xl font-semibold">
            No Meetings Yet
          </h2>

          <p className="mt-3 text-gray-500">
            Schedule your first meeting.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {meetings.map((meeting) => {
            const isInvestor =
              meeting.investor?._id === user?.id;

            const isCreator =
              meeting.createdBy?._id === user?.id;

            return (
              <div
                key={meeting._id}
                className="
                  rounded-2xl
                  border
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <div className="flex justify-between">

                  <div className="space-y-2">

                    <h3 className="text-xl font-semibold">
                      {meeting.title}
                    </h3>

                    <p className="text-gray-500">
                      {meeting.description}
                    </p>

                    <div className="text-sm text-gray-500 space-y-1">

                    {meeting.status === "Completed" ? (
  <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">

    <div>
      <strong>Entrepreneur:</strong><br />
      {meeting.entrepreneur?.name}
    </div>

    <div>
      <strong>Investor:</strong><br />
      {meeting.investor?.name}
    </div>

    <div>
      <strong>Call Started:</strong><br />
      {formatDateTime(meeting.callStartedAt)}
    </div>

    <div>
      <strong>Call Ended:</strong><br />
      {formatDateTime(meeting.callEndedAt)}
    </div>

    <div>
      <strong>Duration:</strong><br />
      {formatDuration(meeting.callDuration)}
    </div>

    <div>
      <strong>Meeting Type:</strong><br />
      {meeting.meetingType}
    </div>

  </div>
) : (
  <>
    <p>
      <strong>Date:</strong>{" "}
      {new Date(meeting.date).toLocaleDateString()}
    </p>

    <p>
      <strong>Time:</strong>{" "}
      {meeting.startTime} - {meeting.endTime}
    </p>

    <p>
      <strong>Type:</strong>{" "}
      {meeting.meetingType}
    </p>

    <p>
      <strong>Entrepreneur:</strong>{" "}
      {meeting.entrepreneur?.name}
    </p>

    <p>
      <strong>Investor:</strong>{" "}
      {meeting.investor?.name}
    </p>
  </>
)}

                    </div>

                  </div>

                  <span
                    className={`
                      rounded-full
                      px-4
                      py-2
                      h-fit
                      text-sm
                      font-medium
                      ${getStatusColor(meeting.status)}
                    `}
                  >
                    {meeting.status}
                  </span>

                </div>

                <div className="mt-6 flex gap-3 flex-wrap">

                  {meeting.status === "Pending" &&
                    isInvestor && (
                      <>
                        <button
                          onClick={() =>
                            handleAccept(meeting._id)
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-white"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleReject(meeting._id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {meeting.status === "Accepted" && (
  <button
    onClick={() =>
      navigate(`/video-call/${meeting._id}`)
    }
    className="
      flex
      items-center
      gap-2
      rounded-lg
      bg-indigo-600
      px-4
      py-2
      font-medium
      text-white
      transition
      hover:bg-indigo-700
    "
  >
    <Video size={18} />
    Join Call
  </button>
)}

                  {!["Cancelled", "Completed", "Missed"].includes(
  meeting.status
) && (
                      <button
                        onClick={() =>
                          handleCancel(meeting._id)
                        }
                        className="rounded-lg bg-gray-700 px-4 py-2 text-white"
                      >
                        Cancel
                      </button>
                    )}

                  {meeting.status === "Pending" &&
                    isCreator && (
                      <button
                        onClick={() =>
                          handleDelete(meeting._id)
                        }
                        className="rounded-lg bg-red-700 px-4 py-2 text-white"
                      >
                        Delete
                      </button>
                    )}

                </div>

              </div>
            );
          })}

        </div>
      )}
<ScheduleMeetingModal
  open={showScheduleModal}
  onClose={() => setShowScheduleModal(false)}
  onSuccess={fetchMeetings}
/>
    </div>
    
  );
};

export default MeetingsPage;