'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface LikedItem {
  id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  created_at: string;
}

export function useLikedItems() {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const supabase = createClient();

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          await fetchLikedItems(user.id);
        }
      } catch (error) {
        // User not logged in
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchLikedItems(session.user.id);
      } else {
        setLikedItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLikedItems = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLikedItems(data || []);
    } catch (error) {
      console.error('Error fetching liked items:', error);
    }
  };

  const isLiked = (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    return likedItems.some(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  const toggleLike = async (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    if (!user) {
      return false;
    }

    const alreadyLiked = isLiked(mediaId, mediaType);

    try {
      const supabase = createClient();
      
      if (alreadyLiked) {
        const { error } = await supabase
          .from('liked_items')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('liked_items')
          .insert({ media_id: mediaId, media_type: mediaType, user_id: user.id } as any);

        if (error) throw error;
      }

      await fetchLikedItems(user.id);
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  return {
    likedItems,
    loading,
    user,
    isLiked,
    toggleLike,
  };
}

