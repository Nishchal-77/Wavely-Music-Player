import { useState, useCallback } from "react";
import { Song, songs } from "@/lib/songs";

export function usePlayerStore() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<Song[]>([]);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  }, [currentSong]);

  const toggleLike = useCallback((id: string) => {
    setLikedSongs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((q) => [...q, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  }, []);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrentSong(next);
      setQueue(rest);
      setProgress(0);
      setIsPlaying(true);
      return;
    }
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const next = songs[(idx + 1) % songs.length];
    setCurrentSong(next);
    setProgress(0);
    setIsPlaying(true);
  }, [currentSong, queue]);

  const skipPrev = useCallback(() => {
    if (!currentSong) return;
    if (progress > 10) {
      setProgress(0);
      return;
    }
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setCurrentSong(prev);
    setProgress(0);
    setIsPlaying(true);
  }, [currentSong, progress]);

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    currentSong,
    isPlaying,
    likedSongs,
    queue,
    volume,
    progress,
    searchQuery,
    filteredSongs,
    playSong,
    togglePlay,
    toggleLike,
    addToQueue,
    removeFromQueue,
    skipNext,
    skipPrev,
    setVolume,
    setProgress,
    setSearchQuery,
  };
}
