import React, { useMemo, useRef, useState, useCallback } from "react";
import { GripVertical, Lock, Unlock, Music, Play, Pause, Trash2 } from "lucide-react";
import { listMusicFavorites } from "@/lib/favoritePlaylists";

function useDragSort(items, onReorder) {
  const listRef = useRef(null);
  const dragIndex = useRef(null);

  const finishDrag = useCallback((clientY) => {
    const container = listRef.current;
    const from = dragIndex.current;
    if (!container || from === null) return;

    const children = [...container.children];
    let to = children.length - 1;
    for (let i = 0; i < children.length; i += 1) {
      const rect = children[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        to = i;
        break;
      }
    }
    children.forEach((child) => child.classList.remove("opacity-50", "scale-[0.98]"));
    dragIndex.current = null;
    if (from !== to && to >= 0 && to < items.length) {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onReorder(next);
    }
  }, [items, onReorder]);

  const onMouseDown = (index) => (event) => {
    event.preventDefault();
    dragIndex.current = index;
    listRef.current?.children[index]?.classList.add("opacity-50", "scale-[0.98]");
    const onUp = (upEvent) => {
      window.removeEventListener("mouseup", onUp);
      finishDrag(upEvent.clientY);
    };
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (index) => () => {
    dragIndex.current = index;
    listRef.current?.children[index]?.classList.add("opacity-50", "scale-[0.98]");
    const onMove = (moveEvent) => moveEvent.preventDefault();
    const onEnd = (endEvent) => {
      listRef.current?.removeEventListener("touchmove", onMove);
      listRef.current?.removeEventListener("touchend", onEnd);
      finishDrag(endEvent.changedTouches[0].clientY);
    };
    listRef.current?.addEventListener("touchmove", onMove, { passive: false });
    listRef.current?.addEventListener("touchend", onEnd, { once: true });
  };

  return { listRef, onMouseDown, onTouchStart };
}

export default function FavoritesView({
  playlist = [],
  currentTrack,
  isPlaying,
  playPlaylistItem,
  removeFromPlaylist,
  onReorderItems,
}) {
  const [locked, setLocked] = useState(true);
  // Liste plate : aucune catégorie/playlist d'origine n'est affichée ici.
  const items = useMemo(() => listMusicFavorites(playlist), [playlist]);

  const handleReorder = useCallback((nextItems) => {
    onReorderItems?.("all-favorites", nextItems);
  }, [onReorderItems]);

  const drag = useDragSort(items, handleReorder);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-foreground/55">
          Vos chansons favorites, classées par ordre d’ajout.
        </p>
        <button
          type="button"
          onClick={() => setLocked((value) => !value)}
          title={locked ? "Déverrouiller pour réorganiser" : "Verrouiller l’ordre"}
          aria-label={locked ? "Déverrouiller pour réorganiser" : "Verrouiller l’ordre"}
          aria-pressed={!locked}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
            locked
              ? "border-border bg-card text-muted-foreground hover:bg-muted"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        </button>
      </div>

      {items.length ? (
        <section className="rounded-2xl border border-border bg-card p-4">
          <div ref={locked ? null : drag.listRef} className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border/70 p-3">
                {!locked && items.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Réorganiser ${item.title}`}
                    className="cursor-grab touch-none text-foreground/40"
                    onMouseDown={drag.onMouseDown(index)}
                    onTouchStart={drag.onTouchStart(index)}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                )}
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0">
                  <Music className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{item.title}</div>
                  <div className="text-xs text-foreground/55">{item.artist || "Audio"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => playPlaylistItem(item)}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center"
                  aria-label={currentTrack?.id === item.track_id && isPlaying ? "Mettre en pause" : "Lire"}
                >
                  {currentTrack?.id === item.track_id && isPlaying
                    ? <Pause className="h-4 w-4" />
                    : <Play className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeFromPlaylist(item.id)}
                  className="h-9 w-9 grid place-items-center rounded-full text-foreground/50 hover:text-destructive hover:bg-muted"
                  aria-label={`Retirer ${item.title} des favoris`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-foreground/50 text-sm">
          Aucune chanson favorite pour le moment. Touchez l’étoile dans une playlist musicale pour en ajouter.
        </p>
      )}
    </div>
  );
}
