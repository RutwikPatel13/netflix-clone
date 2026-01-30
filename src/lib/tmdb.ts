// TMDB API Client
// Documentation: https://developers.themoviedb.org/3

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Helper function to build API URLs
const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY || '');
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

// Fetch wrapper with error handling
async function fetchTMDB<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = buildUrl(endpoint, params);
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Image URL helpers
export const getImageUrl = (path: string | null, size: string = 'original'): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string => getImageUrl(path, 'w500');
export const getBackdropUrl = (path: string | null): string => getImageUrl(path, 'original');

// API Functions

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
  return data.results;
};

// Get trending TV shows
export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week'): Promise<TVShow[]> => {
  const data = await fetchTMDB<TMDBResponse<TVShow>>(`/trending/tv/${timeWindow}`);
  return data.results;
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/popular', { page: page.toString() });
  return data.results;
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/top_rated', { page: page.toString() });
  return data.results;
};

// Get upcoming movies
export const getUpcomingMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/upcoming', { page: page.toString() });
  return data.results;
};

// Get now playing movies
export const getNowPlayingMovies = async (page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/now_playing', { page: page.toString() });
  return data.results;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/discover/movie', {
    with_genres: genreId.toString(),
    page: page.toString(),
  });
  return data.results;
};

// Search movies
export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/search/movie', {
    query,
    page: page.toString(),
  });
  return data.results;
};

// Get movie details
export const getMovieDetails = async (movieId: number) => {
  return fetchTMDB(`/movie/${movieId}`, { append_to_response: 'videos,credits' });
};

// Get movie videos (trailers, teasers, etc.)
export const getMovieVideos = async (movieId: number): Promise<Video[]> => {
  const data = await fetchTMDB<{ results: Video[] }>(`/movie/${movieId}/videos`);
  return data.results;
};

// Get movie genres
export const getMovieGenres = async (): Promise<Genre[]> => {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
};

