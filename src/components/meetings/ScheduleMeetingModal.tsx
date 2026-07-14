import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { X } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { createMeeting } from "../../services/meetingService";
import { getUsers } from "../../services/userService";

interface UserOption {
  _id: string;
  name: string;
  email: string;
  role: "entrepreneur" | "investor";
}

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/* ==========================================
   SCHEDULE MEETING MODAL
========================================== */

const ScheduleMeetingModal = ({
  open,
  onClose,
  onSuccess,
}: ScheduleMeetingModalProps) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<UserOption[]>([]);

  const [formData, setFormData] = useState({
    investor: "",
    entrepreneur: "",
    title: "",
    description: "",
    meetingType: "Video Call",
    date: "",
    startTime: "",
    endTime: "",
  });

  /* ==========================================
     LOAD USERS
  ========================================== */

  useEffect(() => {
    if (!open || !user) return;

const loadUsers = async () => {
  try {
    const users = await getUsers();
    setUsers(users);

  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to load users."
    );
  }
};

    loadUsers();
  }, [open, user]);

  /* ==========================================
     AUTO SELECT CURRENT USER
  ========================================== */

  useEffect(() => {
    if (!user) return;

    if (user.role === "entrepreneur") {
      setFormData((prev) => ({
        ...prev,
        entrepreneur: user.id,
      }));
    }

    if (user.role === "investor") {
      setFormData((prev) => ({
        ...prev,
        investor: user.id,
      }));
    }
  }, [user]);

  /* ==========================================
     INPUT CHANGE
  ========================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    /* ==========================================
     SUBMIT
  ========================================== */
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  /* ==========================
     FRONTEND VALIDATION
  ========================== */

  if (!formData.investor) {
    toast.error("Please select an investor.");
    return;
  }

  if (!formData.entrepreneur) {
    toast.error("Please select an entrepreneur.");
    return;
  }

  if (!formData.title.trim()) {
    toast.error("Meeting title is required.");
    return;
  }

  if (!formData.date) {
    toast.error("Please choose a meeting date.");
    return;
  }

  if (!formData.startTime) {
    toast.error("Please select a start time.");
    return;
  }

  if (!formData.endTime) {
    toast.error("Please select an end time.");
    return;
  }

  if (formData.startTime >= formData.endTime) {
    toast.error("End time must be later than start time.");
    return;
  }

  try {
    setLoading(true);

    await createMeeting(formData);

    toast.success("Meeting scheduled successfully.");

    onSuccess();

    onClose();

    setFormData({
      investor: user?.role === "investor" ? user.id : "",
      entrepreneur:
        user?.role === "entrepreneur" ? user.id : "",
      title: "",
      description: "",
      meetingType: "Video Call",
      date: "",
      startTime: "",
      endTime: "",
    });
  } catch (error: any) {
    console.error(error);

    /* ==========================
       BACKEND VALIDATION
    ========================== */

    const response = error.response?.data;

    // Express-validator errors
    if (response?.errors && Array.isArray(response.errors)) {
      response.errors.forEach((err: any) => {
        toast.error(err.msg);
      });
      return;
    }

    // Conflict detection (409)
    if (error.response?.status === 409) {
      toast.error(
        response?.message ||
          "Meeting conflict detected. Please choose another time."
      );
      return;
    }

    // Bad request (400)
    if (error.response?.status === 400) {
      toast.error(
        response?.message || "Invalid meeting information."
      );
      return;
    }

    // Forbidden
    if (error.response?.status === 403) {
      toast.error(
        response?.message ||
          "You are not allowed to schedule this meeting."
      );
      return;
    }

    // Not found
    if (error.response?.status === 404) {
      toast.error(
        response?.message || "Selected user not found."
      );
      return;
    }

    // Server error
    if (error.response?.status === 500) {
      toast.error(
        response?.message ||
          "Internal server error. Please try again."
      );
      return;
    }

    // Fallback
    toast.error(
      response?.message ||
        "Failed to schedule meeting."
    );
  } finally {
    setLoading(false);
  }
};

  /* ==========================================
     CLOSE
  ========================================== */

  if (!open) return null;

  const availableUsers =
    user?.role === "entrepreneur"
      ? users.filter((u) => u.role === "investor")
      : users.filter((u) => u.role === "entrepreneur");

  /* ==========================================
     JSX
  ========================================== */

  return (
    <div
  className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    overflow-y-auto
    bg-black/40
    p-4
  "
>

      <div
  className="
    w-full
    max-w-2xl
    max-h-[90vh]
    overflow-y-auto
    rounded-2xl
    bg-white
    shadow-2xl
  "
>

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Schedule Meeting
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new meeting invitation.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* FORM */}

        <form
  onSubmit={handleSubmit}
  className="
    max-h-[70vh]
    overflow-y-auto
    space-y-6
    p-6
  "
>

          {/* USER */}

          {user?.role === "entrepreneur" ? (
            <div>

              <label className="mb-2 block text-sm font-medium">
                Select Investor
              </label>

              <select
  name="investor"
  value={formData.investor}
  onChange={(e) => {
    console.log("Selected Investor:", e.target.value);

    handleChange(e);
  }}
  className="w-full rounded-xl border p-3"
>
                <option value="">
                  Choose Investor
                </option>

                {availableUsers.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                  >
                    {u.name} ({u.email})
                  </option>
                ))}

              </select>

            </div>
          ) : (
            <div>

              <label className="mb-2 block text-sm font-medium">
                Select Entrepreneur
              </label>

              <select
                name="entrepreneur"
                value={formData.entrepreneur}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Choose Entrepreneur
                </option>

                {availableUsers.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                  >
                    {u.name} ({u.email})
                  </option>
                ))}

              </select>

            </div>
          )}

          {/* TITLE */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Meeting Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Investment Discussion"
              className="w-full rounded-xl border p-3"
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write meeting agenda..."
              className="w-full rounded-xl border p-3 resize-none"
            />

          </div>

          {/* TYPE */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Meeting Type
            </label>

            <select
              name="meetingType"
              value={formData.meetingType}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option>Video Call</option>
              <option>Phone Call</option>
              <option>In Person</option>
            </select>

          </div>

          {/* DATE / TIME */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Start Time
              </label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                End Time
              </label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-medium
                text-white
                hover:bg-blue-700
                disabled:opacity-60
              "
            >
              {loading
                ? "Scheduling..."
                : "Schedule Meeting"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ScheduleMeetingModal;