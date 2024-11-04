import axios from "axios";

const API_URL = "http://localhost:5001/api/message";

export const sendMessage = async (applicationId: string, content: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_URL}`,
    { applicationId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getMessages = async (applicationId: string) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/application/${applicationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
