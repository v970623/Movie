import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/rentals";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const rentalApi = {
  createRental: async (data: {
    movieId: string;
    startDate: string;
    endDate: string;
  }) => {
    return axios.post(`${API_BASE_URL}/`, data, {
      headers: getAuthHeaders(),
    });
  },

  getRentals: async () => {
    return axios.get(`${API_BASE_URL}/`, {
      headers: getAuthHeaders(),
    });
  },

  getAllRentals: async () => {
    return axios.get(`${API_BASE_URL}/admin`, {
      headers: getAuthHeaders(),
    });
  },

  updateRentalStatus: async (rentalId: string, status: string) => {
    return axios.put(
      `${API_BASE_URL}/status`,
      { rentalId, status },
      {
        headers: getAuthHeaders(),
      }
    );
  },
};
