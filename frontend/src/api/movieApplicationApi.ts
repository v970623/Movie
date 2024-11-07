import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/movie-applications";

interface MovieApplicationData {
  title: string;
  actorsOrDirectors: string;
  posterUrl: string;
  price: number;
  genre: string[];
}

//Submit new movie application
export const submitMovieApplication = async (data: MovieApplicationData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Submit application error:", error);
    throw error;
  }
};

//Fetch all movie applications (admin use)
export const getMovieApplications = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch applications error:", error);
    throw error;
  }
};

//Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: "approved" | "rejected"
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${applicationId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update status error:", error);
    throw error;
  }
};
