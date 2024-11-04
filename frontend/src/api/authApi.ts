import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  code?: string
) => {
  return axios.post(`${API_URL}/register`, { username, email, password, code });
};

export const loginUser = async (username: string, password?: string) => {
  const loginData: { username: string; password?: string } = { username };
  if (password) {
    loginData.password = password;
  }
  const response = await axios.post(`${API_URL}/login`, loginData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
