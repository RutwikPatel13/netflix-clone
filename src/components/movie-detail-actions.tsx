'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { useMyList } from '@/hooks/use-my-list';

interface MovieDetailActionsProps {
  movieId: number;
  hasTrailer: boolean;
}

export function MovieDetailActions({ movieId, hasTrailer }: MovieDetailActionsProps) {
  const searchParams = useSearchParams();
  const { myList, addToList, removeFromList } = useMyList();
  
  const isInList = myList.some(item => item.media_id === movieId && item.media_type === 'movie');
  const autoplay = searchParams.get('autoplay') === 'true';

  const scrollToTrailer = () => {
    const trailerSection = document.getElementById('trailer-section');
    if (trailerSection) {
      trailerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Auto-scroll to trailer if autoplay=true
  useEffect(() => {
    if (autoplay && hasTrailer) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        scrollToTrailer();
      }, 500);
    }
  }, [autoplay, hasTrailer]);

  const handlePlay = () => {
    if (hasTrailer) {
      scrollToTrailer();
    }
  };

  const handleMyList = async () => {
    if (isInList) {
      await removeFromList(movieId, 'movie');
    } else {
      await addToList(movieId, 'movie');
    }
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={handlePlay}
        className="flex items-center gap-2 rounded bg-white px-6 py-2 text-lg font-semibold text-black transition-colors hover:bg-white/80"
      >
        <Play className="h-5 w-5 fill-current" />
        Play
      </button>
      <button 
        onClick={handleMyList}
        className="flex items-center gap-2 rounded bg-white/20 px-6 py-2 text-lg font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        {isInList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {isInList ? 'In My List' : 'My List'}
      </button>
      <button className="flex items-center gap-2 rounded bg-white/20 px-6 py-2 text-lg font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
        <ThumbsUp className="h-5 w-5" />
      </button>
    </div>
  );
}

