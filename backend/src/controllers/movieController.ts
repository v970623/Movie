import { Request, Response } from "express";
import Movie from "../models/movieModel";
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

    // 因为拦截器处理了 response.data，所以这里直接获取的是 data 中的数据
    const movies = await movieService.searchMovie(query as string);
    console.log("movies data:", movies);
    if (!movies || !Array.isArray(movies.results)) {
      throw new Error("Invalid movie data received");
    }

    // 直接使用 movies.results，因为拦截器已经将 data 返回
    const sortedMovies = movies.results.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );
    const limitedMovies = sortedMovies.slice(0, 20);

    // 返回结果
    res.json({ status: "success", data: limitedMovies });
  } catch (error) {
    handleError(res, 500, "Search failed", error);
  }
};
