import axios from "axios";

export interface Movie {
  production_year: Date;
  title: string;
  watch_date: Date;
  director: string; // TODO this should be a list of directors
  id: number; // TODO this should be a string
}

export async function getMovies(): Promise<Movie[]> {
  const response = await axios.get("http://localhost:8010/api/movies");
  const movies = response.data;
  return movies;
}
