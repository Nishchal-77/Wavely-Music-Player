import { Heart, ListPlus, Play, Pause } from "lucide-react";
import { Song } from "@/lib/songs";
import defaultAlbum from "@/assets/default-album.jpg";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  likedSongs: Set<string>;
  onPlay: (song: Song) => void;
  onToggleLike: (id: string) => void;
  onAddToQueue: (song: Song) => void;
}

const SongList = ({
  songs,
  currentSong,
  isPlaying,
  likedSongs,
  onPlay,
  onToggleLike,
  onAddToQueue,
}: SongListProps) => {
  if (songs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/50 py-16 text-center">
        <p className="text-muted-foreground font-medium">No songs found</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Try a different search</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {songs.map((song, i) => {
        const isCurrent = currentSong?.id === song.id;
        const isLiked = likedSongs.has(song.id);
        return (
          <li
            key={song.id}
            onClick={() => onPlay(song)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              isCurrent ? "bg-primary/10" : "hover:bg-song-hover"
            }`}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
              <img src={defaultAlbum} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
                {isCurrent && isPlaying ? (
                  <Pause className="h-4 w-4 text-foreground" />
                ) : (
                  <Play className="h-4 w-4 text-foreground" />
                )}
              </div>
            </div>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-xs text-muted-foreground tabular-nums">
              {isCurrent && isPlaying ? (
                <span className="flex gap-0.5">
                  <span className="h-2 w-0.5 animate-pulse rounded-full bg-primary" />
                  <span className="h-3 w-0.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-2 w-0.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              ) : (
                i + 1
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">{song.title}</p>
              <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
            </div>
            <span className="hidden sm:block truncate text-xs text-muted-foreground max-w-[100px]">
              {song.album}
            </span>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(song.id);
                }}
                className={`p-1.5 rounded-full hover:bg-secondary transition-colors ${
                  isLiked ? "text-liked" : "text-muted-foreground"
                }`}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToQueue(song);
                }}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                title="Add to queue"
                aria-label="Add to queue"
              >
                <ListPlus className="h-4 w-4" />
              </button>
            </div>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {song.duration}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default SongList;
