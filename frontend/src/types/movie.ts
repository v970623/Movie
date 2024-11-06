export interface IMovie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  posterUrl: string;
  price: number;
  status: "available" | "unavailable";
  createdAt: string;
  updatedAt: string;
}
export interface SearchParams {
  title?: string;
  genre?: string;
  director?: string;
  releaseYear?: number;
  priceRange?: [number, number];
  price?: number;
  status?: "available" | "unavailable";
}
