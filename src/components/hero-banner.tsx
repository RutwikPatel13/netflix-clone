'use client';

import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { getBackdropUrl } from '@/lib/tmdb';

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  return (
    <div className="relative h-[56.25vw] max-h-[800px] min-h-[400px] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">{movie.title}</h1>

            {/* Overview */}
            <p className="line-clamp-3 text-sm text-netflix-lightGray md:text-base lg:text-lg">
              {movie.overview}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm md:text-base">
              <span className="flex items-center gap-1">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
              </span>
              <span className="text-netflix-lightGray">
                {movie.release_date?.split('-')[0] || 'N/A'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded bg-white px-6 py-2 text-lg font-semibold text-black transition-colors hover:bg-white/80 md:px-8 md:py-3">
                <Play className="h-5 w-5 fill-current md:h-6 md:w-6" />
                Play
              </button>
              <button className="flex items-center gap-2 rounded bg-white/20 px-6 py-2 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:px-8 md:py-3">
                <Info className="h-5 w-5 md:h-6 md:w-6" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

