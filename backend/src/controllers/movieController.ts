import { Request, Response } from "express";
import Movie from "../models/movieModel";

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
    const movieData = {
      title: req.body.title,
      description: req.body.description,
      releaseYear: req.body.releaseYear,
      genre: req.body.genre || [],
      director: req.body.director,
      actors: req.body.actors || [],
      posterUrl: req.body.posterUrl || undefined,
      rentalPrice: req.body.rentalPrice,
      available: true,
    };

    const movie = await Movie.create(movieData);
    res.status(201).json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create movie",
      error: error,
    });
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
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update movie",
      error: error,
    });
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
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json({
      status: "success",
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to delete movie",
      error: error,
    });
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
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update movie availability",
      error: error,
    });
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

    let query = {};

    if (genre) {
      query = { genre: { $in: [genre] } };
    }

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
    res.status(500).json({
      status: "error",
      message: "Failed to fetch movies",
    });
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
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch movie",
      error: error,
    });
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

    if (query) {
      searchQuery.title = { $regex: query, $options: "i" };
    }

    if (genre) {
      searchQuery.genre = { $in: [genre] };
    }

    if (director) {
      searchQuery.director = { $regex: director, $options: "i" };
    }

    const movies = await Movie.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      status: "success",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Search failed",
      error: error,
    });
  }
};
