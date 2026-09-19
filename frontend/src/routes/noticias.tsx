import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Newspaper, Loader2, Sparkles } from "lucide-react";
import { news as mockNews, type Sentiment } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias do mercado · Aporta" },
      {
        name: "description",
        content:
          "Últimas notícias do mercado financeiro e do Brasil com classificação de sentimento por IA.",
      },
      { property: "og:title", content: "Notícias do mercado · Aporta" },
      {
        property: "og:description",
        content: "Manchetes com tags de sentimento: positivo, neutro e negativo.",
      },
    ],
  }),
  component: NewsPage,
});

const filters: Array<"Todas" | Sentiment> = ["Todas", "Positivo", "Neutro", "Negativo"];

const sentimentClass: Record<Sentiment, string> = {
  Positivo: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Neutro: "bg-surface-2 text-muted-foreground border-border",
  Negativo: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

function NewsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [newsList, setNewsList] = useState<any[]>(mockNews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Erro API");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any, i: number) => ({
            id: item.id || String(i),
            title: item.titulo || item.title,
            source: item.fonte || item.source || "Mercado B3",
            time: item.data || item.time || "Hoje",
            sentiment: (item.sentiment || "Neutro") as Sentiment,
            summary: item.summary || item.titulo,
          }));
          setNewsList(formatted);
        }
      })
      .catch(() => {
        // Mantém mockNews
      })
      .finally(() => setLoading(false));
  }, []);

  const list = filter === "Todas" ? newsList : newsList.filter((n) => n.sentiment === filter);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header Liquid Style */}
      <div className="surface-card p-6 border-border/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FinBERT NLP · Sentimento em Tempo Real</span>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl tracking-tight text-foreground">
              Notícias & Radar de Mercado
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manchetes financeiras monitoradas e classificadas com inteligência artificial para antecipar movimentos de mercado.
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-2/60 px-3 py-1.5 rounded-xl border border-white/5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Sincronizando feeds...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all",
              filter === f
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "border border-border bg-surface-2/60 text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3.5">
        {list.map((n) => (
          <article
            key={n.id}
            className="surface-card p-5 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg border-border/80"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="font-semibold text-primary/90">{n.source}</span>
                  <span>•</span>
                  <span>{n.time}</span>
                </div>
                <h2 className="text-base font-bold leading-snug text-foreground">{n.title}</h2>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold border",
                  sentimentClass[n.sentiment as Sentiment] || sentimentClass.Neutro,
                )}
              >
                {n.sentiment}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <div className="surface-card flex flex-col items-center gap-2 p-12 text-center border-border/80">
          <Newspaper className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-medium text-muted-foreground">Nenhuma notícia encontrada com o filtro selecionado.</p>
        </div>
      )}
    </div>
  );
}
