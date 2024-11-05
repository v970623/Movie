import mongoose from "mongoose";
import Movie from "../models/movieModel";

const initializeMovies = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/movie");
    console.log("Connected to database");

    await Movie.deleteMany({});
    console.log("Cleared existing movies");

    const movies = [
      {
        title: "The Shawshank Redemption",
        description:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: ["Drama"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        price: 4.99,
        status: "available",
      },
      {
        title: "Inception",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a CEO's mind.",
        genre: ["Action", "Sci-Fi", "Thriller"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        price: 5.99,
        status: "available",
      },
      {
        title: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        price: 5.99,
        status: "available",
      },
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: ["Action", "Crime", "Drama"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        price: 4.99,
        status: "available",
      },
      {
        title: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        genre: ["Crime", "Drama"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        price: 4.99,
        status: "available",
      },
    ];

    await Movie.insertMany(movies);
    console.log("Successfully inserted test movies");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

initializeMovies();
