import axios, { AxiosResponse } from "axios";
import { IMovie as Movie, SearchParams } from "../types/movie";

const API_URL = "http://localhost:5001/api/movies";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const createMovie = async (movieData: Movie) => {
  return axios.post(`${API_URL}/`, movieData, { headers: getAuthHeaders() });
};

export const updateMovieStatus = async (movieId: string, status: string) => {
  return axios.put(
    `${API_URL}/${movieId}`,
    { status },
    { headers: getAuthHeaders() }
  );
};

export const getMovies = async (): Promise<AxiosResponse<Movie[]>> => {
  return axios.get<Movie[]>(`${API_URL}/list`, {
    headers: getAuthHeaders(),
  });
};

export const searchMovies = async (
  params: SearchParams
): Promise<AxiosResponse<Movie[]>> => {
  const queryString = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  return axios.get<Movie[]>(`${API_URL}/search?${queryString}`, {
    headers: getAuthHeaders(),
  });
};

export const deleteMovie = async (movieId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${movieId}`, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error: any) {
    console.error(
      "Failed to delete movie:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const uploadAttachment = async (movieId: string, file: File) => {
  if (
    !file.type.startsWith("image/png") &&
    !file.type.startsWith("image/jpeg")
  ) {
    throw new Error("Only image files are allowed");
  }

  try {
    const formData = new FormData();

    formData.append("movieId", movieId);
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/${movieId}/upload`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};
