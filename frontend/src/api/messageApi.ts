import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/messages";

export const sendMessageToAdmin = async (data: { content: string }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_BASE_URL}/send`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
