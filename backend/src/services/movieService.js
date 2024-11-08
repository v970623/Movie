import axios from "axios";

const TMDB_API_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = process.env.API_KEY;
const searchMovie = async (query) => {
  try {
    if (!query) {
      return { results: [] };
    }
    console.log("Searching with query:", query);
    console.log("API URL:", TMDB_API_URL);
    console.log("API KEY exists:", !!API_KEY);
    const response = await axios.get(TMDB_API_URL, {
      params: {
        api_key: API_KEY,
        query,
        language: "en-US",
        include_adult: false,
        page: 1,
      },
    });
    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error("Could not fetch movie data");
  }
};

export default { searchMovie };
