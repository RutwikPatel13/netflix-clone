'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/toast';

interface MyListItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  created_at: string;
}

export function useMyList() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const initialized = useRef(false);

  // Check if user is authenticated - only run once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.log('Auth check skipped - user not logged in');
          return;
        }
        setUser(user);
        if (user) {
          await fetchMyList(user.id);
        }
      } catch (error) {
        // Silently fail - user is not logged in
        console.log('Auth check failed:', error);
      }
    };
    checkUser();
  }, []);

  // Fetch user's list
  const fetchMyList = async (userId?: string) => {
    if (!userId && !user) return;

    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('my_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching my list:', error.message);
        return;
      }
      setMyList(data || []);
    } catch (error) {
      console.log('Error fetching my list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in list
  const isInList = (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    return myList.some(
      (item) => item.media_id === mediaId && item.media_type === mediaType
    );
  };

  // Add to list
  const addToList = async (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    if (!user) {
      showToast('Please sign in to add to your list', 'info');
      router.push('/login');
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('my_list')
        .insert({ media_id: mediaId, media_type: mediaType, user_id: user.id } as any);

      if (error) throw error;
      await fetchMyList(user.id);
      showToast('Added to My List', 'success');
      return true;
    } catch (error) {
      console.error('Error adding to list:', error);
      showToast('Failed to add to list', 'error');
      return false;
    }
  };

  // Remove from list
  const removeFromList = async (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    if (!user) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchMyList(user.id);
      showToast('Removed from My List', 'success');
      return true;
    } catch (error) {
      console.error('Error removing from list:', error);
      showToast('Failed to remove from list', 'error');
      return false;
    }
  };

  // Toggle item in list
  const toggleList = async (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    if (isInList(mediaId, mediaType)) {
      return await removeFromList(mediaId, mediaType);
    } else {
      return await addToList(mediaId, mediaType);
    }
  };

  return {
    myList,
    loading,
    isInList,
    addToList,
    removeFromList,
    toggleList,
    isAuthenticated: !!user,
  };
}

