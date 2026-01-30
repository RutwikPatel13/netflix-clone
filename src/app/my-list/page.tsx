'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MovieCard } from '@/components/movie-card';
import { useMyList } from '@/hooks/use-my-list';
import { getMovieDetails, Movie } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase/client';

export default function MyListPage() {
  const router = useRouter();
  const { myList, loading: listLoading, isAuthenticated } = useMyList();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router, supabase]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (listLoading) return;
      
      if (myList.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const moviePromises = myList
          .filter(item => item.media_type === 'movie')
          .map(item => getMovieDetails(item.media_id));
        
        const fetchedMovies = await Promise.all(moviePromises);
        setMovies(fetchedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [myList, listLoading]);

  if (listLoading || loading) {
    return (
      <main className="min-h-screen px-4 py-20 md:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="mb-8 text-3xl font-bold md:text-4xl">My List</h1>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent mx-auto"></div>
              <p className="text-netflix-lightGray">Loading your list...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">My List</h1>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-6xl">📺</div>
            <h2 className="mb-2 text-2xl font-semibold">Your list is empty</h2>
            <p className="mb-6 text-netflix-lightGray">
              Add movies and shows to your list to watch them later
            </p>
            <button
              onClick={() => router.push('/')}
              className="rounded bg-netflix-red px-6 py-3 font-semibold hover:bg-netflix-red/90 transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-netflix-lightGray">
              {movies.length} {movies.length === 1 ? 'title' : 'titles'}
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

