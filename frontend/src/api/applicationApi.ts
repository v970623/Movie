import axios, { AxiosResponse } from "axios";
import { Application, SearchParams } from "../types/application";

const API_URL = "http://localhost:5001/api/application";

export const submitApplication = async (title: string, content: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_URL}/submit`,
    { title, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${API_URL}/update`,
    { applicationId, status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getApplications = async (): Promise<
  AxiosResponse<Application[]>
> => {
  const token = localStorage.getItem("token");
  return axios.get<Application[]>(`${API_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const searchApplications = async (
  params: SearchParams
): Promise<AxiosResponse<Application[]>> => {
  const token = localStorage.getItem("token");
  const queryString = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  return axios.get<Application[]>(`${API_URL}/search?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadAttachment = async (applicationId: string, file: File) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("applicationId", applicationId);
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/${applicationId}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
