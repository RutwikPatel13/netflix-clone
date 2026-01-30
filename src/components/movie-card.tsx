'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { getPosterUrl } from '@/lib/tmdb';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative aspect-[2/3] cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* Hover Overlay */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end rounded-md bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300',
          isHovered && 'opacity-100'
        )}
      >
        {/* Action Buttons */}
        <div className="mb-2 flex gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/80 transition-colors"
            aria-label="Play"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 text-white hover:border-white transition-colors"
            aria-label="Add to My List"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 text-white hover:border-white transition-colors"
            aria-label="Like"
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 text-white hover:border-white transition-colors"
            aria-label="More Info"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Movie Info */}
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-sm font-semibold">{movie.title}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500 font-semibold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="text-netflix-lightGray">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

