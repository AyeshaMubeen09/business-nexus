import axios from "axios";

const API_URL = "https://business-nexus-production-88ff.up.railway.app/api/documents";

/* ==========================================
   AUTH HEADER
========================================== */

const getAuthHeader = () => {
  const token = localStorage.getItem("business_nexus_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ==========================================
   GET MY DOCUMENTS
========================================== */

export const getDocuments = async () => {
  const response = await axios.get(API_URL, getAuthHeader());

  return response.data;
};

/* ==========================================
   GET DOCUMENT BY ID
========================================== */

export const getDocument = async (id: string) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthHeader()
  );

  return response.data;
};

/* ==========================================
   UPLOAD DOCUMENT
========================================== */

export const uploadDocument = async (
  title: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("document", file);

  const token = localStorage.getItem("business_nexus_token");

  const response = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/* ==========================================
   SAVE SIGNATURE
========================================== */

export const saveSignature = async (
  documentId: string,
  signature: string
) => {
  const response = await axios.put(
    `${API_URL}/sign/${documentId}`,
    {
      signature,
    },
    getAuthHeader()
  );

  return response.data.document;
};

/* ==========================================
   DELETE DOCUMENT
========================================== */

export const deleteDocument = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );

  return response.data;
};

/* ==========================================
   DOWNLOAD DOCUMENT
========================================== */

export const downloadDocument = async (id: string) => {
  const token = localStorage.getItem("business_nexus_token");

  window.open(
    `${API_URL}/download/${id}?token=${token}`,
    "_blank"
  );
};