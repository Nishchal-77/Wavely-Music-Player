import { X, ListMusic } from "lucide-react";
import { Song } from "@/lib/songs";

interface QueuePanelProps {
  queue: Song[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (index: number) => void;
}

const QueuePanel = ({ queue, isOpen, onToggle, onRemove }: QueuePanelProps) => (
  <>
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground shadow-lg border border-border hover:bg-muted transition-colors sm:bottom-28"
      aria-label={isOpen ? "Close queue" : "Open queue"}
    >
      <ListMusic className="h-5 w-5" />
      {queue.length > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {queue.length}
        </span>
      ) : null}
    </button>

    {isOpen ? (
      <div className="fixed inset-0 z-40 flex justify-end sm:items-end sm:justify-end pointer-events-none">
        <button
          type="button"
          className="absolute inset-0 bg-background/60 pointer-events-auto sm:hidden"
          onClick={onToggle}
          aria-label="Close overlay"
        />
        <div className="pointer-events-auto mt-auto w-full max-h-[50vh] rounded-t-xl border border-border bg-card shadow-xl sm:mb-24 sm:mr-4 sm:max-h-[min(70vh,420px)] sm:w-80 sm:rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-sm">Queue ({queue.length})</h3>
            <button
              type="button"
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="max-h-[calc(50vh-52px)] overflow-y-auto p-2 sm:max-h-[min(70vh-52px,368px)]">
            {queue.length === 0 ? (
              <li className="py-12 text-center text-sm text-muted-foreground">Queue is empty</li>
            ) : (
              queue.map((song, i) => (
                <li
                  key={`${song.id}-${i}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-song-hover"
                >
                  <span className="w-5 text-center text-xs text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{song.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-opacity text-muted-foreground"
                    aria-label="Remove from queue"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    ) : null}
  </>
);

export default QueuePanel;
