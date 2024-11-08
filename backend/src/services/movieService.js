import axios from "axios";

const TMDB_API_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = process.env.API_KEY;
const searchMovie = async (query) => {
  try {
    const response = await axios.get(TMDB_API_URL, {
      params: {
        api_key: API_KEY,
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    throw new Error("Could not fetch movie data");
  }
};

export default { searchMovie };
