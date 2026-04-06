import { useState, useCallback } from "react";
import { Song, songs } from "@/lib/songs";

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function usePlayerStore() {
  const [librarySongs, setLibrarySongs] = useState<Song[]>(songs);
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
    if (!currentSong && librarySongs.length > 0) {
      setCurrentSong(librarySongs[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  }, [currentSong, librarySongs]);

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
    const idx = librarySongs.findIndex((s) => s.id === currentSong.id);
    const next = librarySongs[(idx + 1) % librarySongs.length];
    setCurrentSong(next);
    setProgress(0);
    setIsPlaying(true);
  }, [currentSong, queue, librarySongs]);

  const skipPrev = useCallback(() => {
    if (!currentSong) return;
    if (progress > 10) {
      setProgress(0);
      return;
    }
    const idx = librarySongs.findIndex((s) => s.id === currentSong.id);
    const prev = librarySongs[(idx - 1 + librarySongs.length) % librarySongs.length];
    setCurrentSong(prev);
    setProgress(0);
    setIsPlaying(true);
  }, [currentSong, progress, librarySongs]);

  const addLocalSongs = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith("audio/"));
    if (fileArray.length === 0) return;

    const now = Date.now();
    const newSongs: Song[] = fileArray.map((file, i) => ({
      id: `local-${now}-${i}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      album: "My Device",
      duration: "--:--",
      durationSeconds: 0,
      audioUrl: URL.createObjectURL(file),
    }));

    setLibrarySongs((prev) => [...newSongs, ...prev]);
  }, []);

  const updateCurrentSongDuration = useCallback((seconds: number) => {
    if (!currentSong || !Number.isFinite(seconds) || seconds <= 0) return;

    const rounded = Math.round(seconds);
    setLibrarySongs((prev) =>
      prev.map((song) =>
        song.id === currentSong.id
          ? { ...song, durationSeconds: rounded, duration: formatDuration(rounded) }
          : song
      )
    );
    setCurrentSong((prev) =>
      prev ? { ...prev, durationSeconds: rounded, duration: formatDuration(rounded) } : prev
    );
  }, [currentSong]);

  const filteredSongs = librarySongs.filter(
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
    addLocalSongs,
    updateCurrentSongDuration,
    setVolume,
    setProgress,
    setSearchQuery,
  };
}
