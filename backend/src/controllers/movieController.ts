import { Request, Response } from "express";
import Movie from "../models/movieModel";
import { IMovie } from "../models/movieModel";
import { handleError } from "../utils/errorHandler";
import movieService from "../services/movieService";

/**
 * Create a new movie
 * @param req Request object containing movie data
 * @param res Response object
 */
export const createMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieData = { ...req.body, status: req.body.status || "available" };
    const movie = await Movie.create(movieData);
    res.status(201).json({ status: "success", data: movie });
  } catch (error) {
    handleError(res, 400, "Failed to create movie", error);
  }
};

/**
 * Update movie information
 * @param req Request object containing updated movie data
 * @param res Response object
 */
export const updateMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      handleError(res, 404, "Movie not found");
      return;
    }
    res.json({ status: "success", data: movie });
  } catch (error) {
    handleError(res, 400, "Failed to update movie", error);
  }
};

/**
 * Delete a movie
 * @param req Request object containing movie ID
 * @param res Response object
 */
export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      handleError(res, 404, "Movie not found");
      return;
    }
    res.json({ status: "success", message: "Movie deleted successfully" });
  } catch (error) {
    handleError(res, 400, "Failed to delete movie", error);
  }
};

/**
 * Update movie availability status
 * @param req Request object containing availability status
 * @param res Response object
 */
export const updateMovieAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true }
    );
    if (!movie) {
      handleError(res, 404, "Movie not found");
      return;
    }
    res.json({ status: "success", data: movie });
  } catch (error) {
    handleError(res, 400, "Failed to update movie availability", error);
  }
};

/**
 * Get all movies with pagination
 * @param req Request object containing query parameters
 * @param res Response object
 */
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const genre = req.query.genre as string;
    const query = genre ? { genre: { $in: [genre] } } : {};

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Movie.countDocuments(query);

    res.json({
      status: "success",
      data: {
        movies,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    handleError(res, 500, "Failed to fetch movies", error);
  }
};

/**
 * Get movie by ID
 * @param req Request object containing movie ID
 * @param res Response object
 */
export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      handleError(res, 404, "Movie not found");
      return;
    }
    res.json({ status: "success", data: movie });
  } catch (error) {
    handleError(res, 500, "Failed to fetch movie", error);
  }
};

/**
 * Search movies by title, genre, or director
 * @param req Request object containing search parameters
 * @param res Response object
 */
export const searchMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query, genre, director } = req.query;
    const searchQuery: any = {};

    if (query) searchQuery.title = { $regex: query, $options: "i" };
    if (genre) searchQuery.genre = { $in: [genre] };
    if (director) searchQuery.director = { $regex: director, $options: "i" };

    const movies = await movieService.searchMovie(query as string);
    if (!movies || !Array.isArray(movies.results)) {
      throw new Error("Invalid movie data received");
    }

    const formattedMovies = movies.results.map((movie: any) => ({
      title: movie.title,
      description: movie.overview,
      genre: movie.genre_ids.slice(0, 3).join(", "),
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://example.com/default-poster.jpg",
      price: 4.99,
      status: "available",
    }));

    res.json({ status: "success", data: formattedMovies });
  } catch (error) {
    handleError(res, 500, "Search failed", error);
  }
};

/**
 * Save selected movies
 * @param req Request object containing movies data
 * @param res Response object
 */
export const saveSelectedMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movies = req.body.movies;
    if (!Array.isArray(movies) || movies.length === 0) {
      handleError(res, 400, "Invalid movies data");
      return;
    }

    const savedMovies = await Movie.insertMany(
      movies.map((movie) => ({
        ...movie,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    res.json({ status: "success", data: savedMovies });
  } catch (error) {
    handleError(res, 500, "Failed to save movies", error);
  }
};
