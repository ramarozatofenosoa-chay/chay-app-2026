
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Copy, Trash2, StickyNote } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { HIGHLIGHT_COLORS } from "@/lib/bibleConstants";

export default function VerseActionsSheet({
  open,
  onOpenChange,
  verses,
  annotations,
  onHighlight,
  onNote,
  onRemove,
}) {
  const { toast } = useToast();
  const [note, setNote] = useState("");

  const count = verses.length;

  const colors = verses.map(
    (v) => annotations[v.number]?.highlight_color
  );

  const commonColor =
    count > 0 && colors.every((c) => c === colors[0])
      ? colors[0]
      : null;

  useEffect(() => {
    setNote(
      count === 1
        ? annotations[verses[0]?.number]?.note || ""
        : ""
    );
  }, [open, count]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        verses.map((v) => `${v.number}. ${v.text}`).join("\n")
      );

      toast({ title: `${count} verset(s) copié(s)` });
    } catch {
      toast({ title: "Copie impossible" });
    }
  };

  const title =
    count > 1
      ? `${count} versets sélectionnés`
      : `Verset ${verses[0]?.number}`;

  const desc = verses
    .map((v) => `${v.number} ${v.text}`)
    .join("  ");

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="
          flex
          flex-col
          h-[85vh]
          max-h-[85vh]
          h-[85dvh]
          max-h-[85dvh]
          overflow-hidden
          pb-0
        "
      >
        {/* En-tête : toujours au-dessus du contenu */}
        <DrawerHeader className="shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-primary" />
            {title}
          </DrawerTitle>

          <DrawerDescription
            className="
              max-h-32
              overflow-y-auto
              leading-relaxed
              text-foreground/70
            "
          >
            {desc}
          </DrawerDescription>
        </DrawerHeader>

        {/* Zone centrale : seul le contenu défile */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            pb-4
          "
        >
          <div className="space-y-5">
            {/* Surlignage */}
            <div>
              <div className="mb-2 text-sm font-bold">
                Surligner
              </div>

              <div className="flex gap-3">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onHighlight(c.id)}
                    className={`h-10 w-10 rounded-full ${c.swatch} transition ${
                      commonColor === c.id
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-110"
                    }`}
                    aria-label={c.id}
                  />
                ))}
              </div>

              {commonColor && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-foreground/60
                    hover:text-destructive
                  "
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Retirer le surlignage
                </button>
              )}
            </div>

            {/* Note personnelle */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <StickyNote className="h-4 w-4" />
                {count > 1
                  ? "Note pour tous les versets"
                  : "Note personnelle"}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Votre note…"
                className="
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-card
                  p-3
                  text-sm
                  outline-none
                  focus:border-primary
                  resize-none
                "
              />
            </div>
          </div>
        </div>

        {/* Pied fixe : boutons toujours séparés du contenu */}
        <div
          className="
            relative
            z-10
            shrink-0
            border-t
            border-border
            bg-background
            px-4
            pt-3
            pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]
          "
        >
          <button
            type="button"
            onClick={() => onNote(note)}
            className="
              w-full
              rounded-full
              bg-primary
              px-4
              py-2
              text-sm
              font-bold
              text-primary-foreground
            "
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={copy}
            className="
              mt-3
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border
              py-2.5
              text-sm
              font-bold
              transition
              hover:bg-muted
            "
          >
            <Copy className="h-4 w-4" />
            Copier{" "}
            {count > 1
              ? `les ${count} versets`
              : "le verset"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
