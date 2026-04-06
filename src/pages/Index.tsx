import { useState, useEffect } from "react";
import { Music } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import SongList from "@/components/SongList";
import PlayerBar from "@/components/PlayerBar";
import QueuePanel from "@/components/QueuePanel";
import { usePlayerStore } from "@/hooks/usePlayerStore";

const Index = () => {
  const store = usePlayerStore();
  const [queueOpen, setQueueOpen] = useState(false);
  const { isPlaying, currentSong, setProgress, skipNext } = store;

  useEffect(() => {
    if (!isPlaying || !currentSong) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          skipNext();
          return 0;
        }
        return prev + 100 / currentSong.durationSeconds;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, setProgress, skipNext]);

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
        onProgressChange={store.setProgress}
        onToggleLike={() => store.currentSong && store.toggleLike(store.currentSong.id)}
      />
    </div>
  );
};

export default Index;
