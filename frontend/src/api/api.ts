import request from "../utils/request";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../tsconfig.json";
import imageCompression from "browser-image-compression";

interface LoginData {
  username: string;
  password?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  code?: string;
}

interface MovieData {
  title: string;
  description: string;
  genre: string[];
  posterUrl: string;
  price: number;
  status: string;
}

interface RentalData {
  movieId: string;
  startDate: string;
  endDate: string;
}

interface MovieApplicationData {
  title: string;
  actorsOrDirectors: string;
  posterUrl: string;
  price: number;
  genre: string[];
}

// Auth API
const authAPI = {
  login: async (data: LoginData) => {
    const response = await request.post("/auth/login", data);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  },

  register: (data: RegisterData) => request.post("/auth/register", data),

  logout: () => {
    localStorage.removeItem("token");
  },
};

// Movie API
const movieAPI = {
  getMovies: async () => {
    const response = await request.get("/movies");
    return {
      data: {
        movies: response.data.movies || [],
      },
    };
  },
  getMovieById: (id: string) => request.get(`/movies/${id}`),

  createMovie: (data: MovieData) => request.post("/movies", data),

  updateMovie: (id: string, data: Partial<MovieData>) =>
    request.put(`/movies/${id}`, data),

  deleteMovie: (id: string) => request.delete(`/movies/${id}`),
  searchMovie: (query: string) => request.get(`/movies/search?query=${query}`),
};

// Rental API
const rentalAPI = {
  getRentals: () => request.get("/rentals"),

  getAllRentals: () => request.get("/rentals/admin"),

  createRental: (data: RentalData) => request.post("/rentals", data),

  updateRentalStatus: (id: string, status: string) =>
    request.put(`/rentals/status`, { rentalId: id, status }),
};

// Movie Application API
const movieApplicationAPI = {
  submitApplication: async (data: MovieApplicationData) => {
    return request.post("/movie-applications/submit", data, {
      timeout: 10000,
    });
  },

  getApplications: () => request.get("/movie-applications"),

  updateStatus: (id: string, status: "approved" | "rejected") =>
    request.patch(`/movie-applications/${id}/status`, { status }),
};

// Attachment API
const attachmentAPI = {
  uploadImage: async (file: File, options = { compress: true }) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Only JPG/PNG images are supported");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size cannot exceed 5MB");
    }

    let imageFile = file;

    if (options.compress) {
      const compressOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };
      imageFile = await imageCompression(file, compressOptions);
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await request.post("/attachments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return response.url;
  },
};

// Message API
const messageAPI = {
  sendMessageToAdmin: async (data: { content: string }) => {
    try {
      const response = await request.post("/messages/send", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export {
  authAPI,
  movieAPI,
  rentalAPI,
  movieApplicationAPI,
  attachmentAPI,
  messageAPI,
};
