'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface MyListItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  created_at: string;
}

export function useMyList() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchMyList();
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Fetch user's list
  const fetchMyList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('my_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyList(data || []);
    } catch (error) {
      console.error('Error fetching my list:', error);
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
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('my_list')
        .insert([{ media_id: mediaId, media_type: mediaType, user_id: user.id }]);

      if (error) throw error;
      await fetchMyList();
      return true;
    } catch (error) {
      console.error('Error adding to list:', error);
      return false;
    }
  };

  // Remove from list
  const removeFromList = async (mediaId: number, mediaType: 'movie' | 'tv' = 'movie') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchMyList();
      return true;
    } catch (error) {
      console.error('Error removing from list:', error);
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

