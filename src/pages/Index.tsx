import { useState, useEffect, useRef, useCallback } from "react";
import { Music, Upload } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import SongList from "@/components/SongList";
import PlayerBar from "@/components/PlayerBar";
import QueuePanel from "@/components/QueuePanel";
import { usePlayerStore } from "@/hooks/usePlayerStore";

const Index = () => {
  const store = usePlayerStore();
  const [queueOpen, setQueueOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const skipNextRef = useRef(store.skipNext);
  const { isPlaying, currentSong, setProgress, skipNext, volume, updateCurrentSongDuration } = store;

  useEffect(() => {
    skipNextRef.current = skipNext;
  }, [skipNext]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      setProgress(0);
      skipNextRef.current();
    };
    const onLoadedMetadata = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      updateCurrentSongDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioRef.current = null;
    };
  }, [setProgress, updateCurrentSongDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setProgress(0);
      return;
    }

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      setProgress(0);
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        // Playback can be blocked until a user gesture in some browsers.
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, setProgress]);

  const handleSeek = useCallback(
    (value: number) => {
      setProgress(value);
      const audio = audioRef.current;
      if (!audio || !audio.duration || Number.isNaN(audio.duration)) return;
      audio.currentTime = (value / 100) * audio.duration;
    },
    [setProgress]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Music className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Wavely</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 pb-32">
        <div className="mx-auto max-w-3xl space-y-4">
          <SearchBar value={store.searchQuery} onChange={store.setSearchQuery} />
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (!e.target.files || e.target.files.length === 0) return;
              store.addLocalSongs(e.target.files);
              e.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            Load songs from device
          </button>
          <h2 className="text-sm font-medium text-muted-foreground">
            {store.searchQuery ? "Search Results" : "All Songs"}
          </h2>
          <SongList
            songs={store.filteredSongs}
            currentSong={store.currentSong}
            isPlaying={store.isPlaying}
            likedSongs={store.likedSongs}
            onPlay={store.playSong}
            onToggleLike={store.toggleLike}
            onAddToQueue={store.addToQueue}
          />
        </div>
      </main>

      <QueuePanel
        queue={store.queue}
        isOpen={queueOpen}
        onToggle={() => setQueueOpen(!queueOpen)}
        onRemove={store.removeFromQueue}
      />

      <PlayerBar
        currentSong={store.currentSong}
        isPlaying={store.isPlaying}
        volume={store.volume}
        progress={store.progress}
        isLiked={store.currentSong ? store.likedSongs.has(store.currentSong.id) : false}
        onTogglePlay={store.togglePlay}
        onSkipNext={store.skipNext}
        onSkipPrev={store.skipPrev}
        onVolumeChange={store.setVolume}
        onProgressChange={handleSeek}
        onToggleLike={() => store.currentSong && store.toggleLike(store.currentSong.id)}
      />
    </div>
  );
};

export default Index;
