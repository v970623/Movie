import axios from "axios";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const sendMessageToAdmin = async ({
  userId,
  message,
}: {
  userId: string;
  message: string;
}) => {
  return axios.post(
    "http://localhost:5001/api/messages",
    { userId, message },
    { headers: getAuthHeaders() }
  );
};
export const replyToUserMessage = async ({
  userId,
  replyMessage,
}: {
  userId: string;
  replyMessage: string;
}) => {
  return axios.post(
    "http://localhost:5001/api/messages/reply",
    { userId, replyMessage },
    { headers: getAuthHeaders() }
  );
};
