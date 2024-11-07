import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/rentals";

interface RentalData {
  movieId: string;
  startDate: string;
  endDate: string;
}

export const createRental = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE_URL}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getRentals = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRentalStatus = async (rentalId: string, status: string) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${API_BASE_URL}/status`,
    { rentalId, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getAllRentals = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
