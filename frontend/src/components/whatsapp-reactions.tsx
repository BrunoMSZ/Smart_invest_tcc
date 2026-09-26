import { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Reações amplas no estilo WhatsApp */
export const WHATSAPP_REACTIONS = [
  "👍", "❤️", "😂", "😮", "😢", "🙏",
  "🔥", "👏", "🎉", "😍", "🤔", "👎",
  "💯", "🤣", "😭", "😡", "🫡", "🤝",
] as const;
export type WhatsAppEmoji = (typeof WHATSAPP_REACTIONS)[number];

export type ReactionCounts = Partial<Record<WhatsAppEmoji, number>>;

type WhatsAppReactionsProps = {
  storageKey: string;
  /** Contagem inicial opcional (ex.: likes do post viram ❤️) */
  seed?: ReactionCounts;
  align?: "left" | "right";
  className?: string;
  onChange?: (emoji: WhatsAppEmoji | null, counts: ReactionCounts) => void;
};

function loadStored(key: string): { mine: WhatsAppEmoji | null; counts: ReactionCounts } {
  if (typeof window === "undefined") return { mine: null, counts: {} };
  try {
    const raw = localStorage.getItem(`wa_react_${key}`);
    if (!raw) return { mine: null, counts: {} };
    const parsed = JSON.parse(raw);
    return {
      mine: parsed.mine ?? null,
      counts: parsed.counts ?? {},
    };
  } catch {
    return { mine: null, counts: {} };
  }
}

function saveStored(key: string, mine: WhatsAppEmoji | null, counts: ReactionCounts) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`wa_react_${key}`, JSON.stringify({ mine, counts }));
}

export function WhatsAppReactions({
  storageKey,
  seed,
  align = "left",
  className,
  onChange,
}: WhatsAppReactionsProps) {
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<WhatsAppEmoji | null>(null);
  const [counts, setCounts] = useState<ReactionCounts>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  useEffect(() => {
    const stored = loadStored(storageKey);
    let nextCounts = { ...stored.counts };
    if (!seeded.current && seed) {
      for (const [emoji, n] of Object.entries(seed)) {
        if (n && n > 0) {
          nextCounts[emoji as WhatsAppEmoji] = Math.max(nextCounts[emoji as WhatsAppEmoji] || 0, n);
        }
      }
      seeded.current = true;
    }
    setMine(stored.mine);
    setCounts(nextCounts);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const react = (emoji: WhatsAppEmoji) => {
    setCounts((prev) => {
      const next: ReactionCounts = { ...prev };
      if (mine === emoji) {
        next[emoji] = Math.max((next[emoji] || 1) - 1, 0);
        if (!next[emoji]) delete next[emoji];
        setMine(null);
        saveStored(storageKey, null, next);
        onChange?.(null, next);
        return next;
      }
      if (mine) {
        next[mine] = Math.max((next[mine] || 1) - 1, 0);
        if (!next[mine]) delete next[mine];
      }
      next[emoji] = (next[emoji] || 0) + 1;
      setMine(emoji);
      saveStored(storageKey, emoji, next);
      onChange?.(emoji, next);
      return next;
    });
    setOpen(false);
  };

  const active = WHATSAPP_REACTIONS.filter((e) => (counts[e] || 0) > 0);

  return (
    <div ref={rootRef} className={cn("relative inline-flex items-center gap-1.5", className)}>
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {active.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => react(emoji)}
              title={mine === emoji ? "Remover reação" : "Reagir"}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors",
                mine === emoji
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border bg-surface-2/80 text-muted-foreground hover:bg-surface-2",
              )}
            >
              <span className="text-sm leading-none">{emoji}</span>
              <span className="tabular-nums text-[10px] font-semibold">{counts[emoji]}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
          open && "border-primary/50 text-primary",
        )}
        title="Reagir"
        aria-label="Reagir"
      >
        <SmilePlus className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute bottom-full z-50 mb-2 flex w-[276px] flex-wrap gap-1 rounded-2xl border border-border bg-[#1F2C34] p-2 shadow-xl",
            align === "right" ? "right-0" : "left-0",
          )}
          role="listbox"
          aria-label="Reações"
        >
          {WHATSAPP_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => react(emoji)}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] leading-none hover:bg-white/10",
                mine === emoji && "bg-white/15",
              )}
              aria-label={`Reagir com ${emoji}`}
            >
              <span className="block leading-none">{emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
