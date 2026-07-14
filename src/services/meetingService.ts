import axios from "axios";

const API_URL = "http://localhost:5000/api/meetings";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(
      "business_nexus_token"
    )}`,
  },
});

export const getMyMeetings = async () => {
  const { data } = await axios.get(API_URL, getAuthHeader());
  return data;
};

export const getMeetingById = async (id: string) => {
  const { data } = await axios.get(
    `${API_URL}/${id}`,
    getAuthHeader()
  );
  return data;
};

export const createMeeting = async (meeting: any) => {
  const { data } = await axios.post(
    API_URL,
    meeting,
    getAuthHeader()
  );
  return data;
};

export const acceptMeeting = async (id: string) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/accept`,
    {},
    getAuthHeader()
  );
  return data;
};

export const rejectMeeting = async (id: string) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/reject`,
    {},
    getAuthHeader()
  );
  return data;
};

export const cancelMeeting = async (id: string) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/cancel`,
    {},
    getAuthHeader()
  );
  return data;
};

export const deleteMeeting = async (id: string) => {
  const { data } = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );
  return data;
};

/* ==========================================
   START MEETING
========================================== */

export const startMeeting = async (id: string) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/start`,
    {},
    getAuthHeader()
  );

  return data;
};

/* ==========================================
   END MEETING
========================================== */

export const endMeeting = async (id: string) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/end`,
    {},
    getAuthHeader()
  );

  return data;
};