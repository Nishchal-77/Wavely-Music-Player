import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/lib/songs";
import defaultAlbum from "@/assets/default-album.jpg";

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  isLiked: boolean;
  onTogglePlay: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  onVolumeChange: (v: number) => void;
  onProgressChange: (v: number) => void;
  onToggleLike: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const PlayerBar = ({
  currentSong,
  isPlaying,
  volume,
  progress,
  isLiked,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  onVolumeChange,
  onProgressChange,
  onToggleLike,
}: PlayerBarProps) => {
  const elapsed = currentSong ? (progress / 100) * currentSong.durationSeconds : 0;
  const total = currentSong?.durationSeconds ?? 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-player/95 backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 -translate-y-full px-4 pb-1">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={([v]) => onProgressChange(v)}
          className="w-full"
        />
      </div>
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
            {currentSong ? (
              <img src={defaultAlbum} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {currentSong ? currentSong.title : "No song selected"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentSong ? currentSong.artist : "—"}
            </p>
          </div>
          {currentSong ? (
            <button
              type="button"
              onClick={onToggleLike}
              className={`ml-1 hidden shrink-0 p-1.5 rounded-full hover:bg-secondary sm:block ${
                isLiked ? "text-liked" : "text-muted-foreground"
              }`}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onSkipPrev}
              className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
              aria-label="Previous"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              className="p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 pl-0.5" />}
            </button>
            <button
              type="button"
              onClick={onSkipNext}
              className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
              aria-label="Next"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden text-[10px] tabular-nums text-muted-foreground sm:flex gap-2">
            <span>{formatTime(elapsed)}</span>
            <span>/</span>
            <span>{currentSong ? formatTime(total) : "--:--"}</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onVolumeChange(volume === 0 ? 75 : 0)}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground shrink-0"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={([v]) => onVolumeChange(v)}
            className="w-24 hidden sm:flex"
          />
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
