import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Loader2,
  Building2,
  ShieldCheck,
  BarChart2,
  Activity,
  ArrowRight,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assets as defaultAssets } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado")({
  head: () => ({
    meta: [
      { title: "Mercado B3 · Cotações & Inteligência Quantitativa · Liquid Invest" },
      {
        name: "description",
        content:
          "Busque tickers da B3 com autocompletar e abra o dashboard de previsibilidade do ativo.",
      },
      { property: "og:title", content: "Mercado B3 · Liquid Invest" },
      {
        property: "og:description",
        content: "Busca de ativos, indicadores técnicos e previsibilidade por IA.",
      },
    ],
  }),
  component: MarketPage,
});

const filterTabs = ["Todos", "Ações B3", "FIIs", "ETFs", "Em Alta", "Em Baixa"];

function MarketPage() {
  const [q, setQ] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [assetList, setAssetList] = useState<any[]>(defaultAssets);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getStocks({ limit: 300 })
      .then((stocks) => {
        if (stocks && stocks.length > 0) {
          const list = stocks.map((a) => ({
            ticker: a.ticker,
            name: a.nome || a.ticker,
            price: a.preco || a.price || 35.0,
            change: a.change !== undefined ? a.change : 0.0,
            sector: a.setor || "Mercado B3",
            classe: a.classe || "Ações B3",
          }));
          setAssetList(list);
        }
      })
      .catch((err) => {
        console.warn("[Mercado] Erro ao carregar ativos da base:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return assetList.filter(
      (a) => a.ticker.toLowerCase().includes(term) || (a.name && a.name.toLowerCase().includes(term)),
    );
  }, [q, assetList]);

  const filteredAssets = useMemo(() => {
    if (selectedFilter === "Em Alta") {
      return assetList.filter((a) => a.change >= 0);
    }
    if (selectedFilter === "Em Baixa") {
      return assetList.filter((a) => a.change < 0);
    }
    if (selectedFilter === "FIIs") {
      return assetList.filter((a) => a.classe === "FIIs" || (a.ticker.endsWith("11") && a.sector?.toLowerCase().includes("fii")));
    }
    if (selectedFilter === "ETFs") {
      return assetList.filter((a) => a.classe === "ETFs");
    }
    if (selectedFilter === "Ações B3") {
      return assetList.filter((a) => a.classe === "Ações B3" || /^[A-Z]{4}(?:3|4|5|6)$/.test(a.ticker));
    }
    return assetList;
  }, [assetList, selectedFilter]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header Liquid Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
            <Activity className="h-3 w-3" />
            <span>Terminal Quantitativo B3</span>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
            Mercado Financeiro
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cotações em tempo real, filtros fundamentalistas e previsibilidade alimentada por Machine Learning.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-2/60 px-3 py-1.5 rounded-xl border border-white/5">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Sincronizando cotações...</span>
          </div>
        )}
      </div>

      {/* Mini Stats Banner Liquid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="surface-card p-3.5 border-border/80">
          <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Ativos Monitorados</p>
          <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">{assetList.length} Tickers</p>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Cobertura B3</span>
        </div>
        <div className="surface-card p-3.5 border-border/80">
          <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Algoritmo ML</p>
          <p className="text-lg sm:text-xl font-bold text-primary mt-0.5">XGBoost & NLP</p>
          <span className="text-[10px] text-muted-foreground">Sentimento + Técnico</span>
        </div>
        <div className="surface-card p-3.5 border-border/80">
          <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Metodologia</p>
          <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">Markowitz</p>
          <span className="text-[10px] text-sky-400">Fronteira Eficiente</span>
        </div>
        <div className="surface-card p-3.5 border-border/80">
          <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Auditoria</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">CVM / B3</p>
          <span className="text-[10px] text-muted-foreground">Padrão Institucional</span>
        </div>
      </div>

      {/* Input de Busca com Estilo Liquid */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0])
              navigate({ to: "/ativo/$ticker", params: { ticker: results[0].ticker } });
          }}
          placeholder="Buscar por ticker ou empresa (ex: PETR4, VALE3, ITUB4, HGLG11, IVVB11)..."
          className="h-14 rounded-2xl pl-12 pr-4 text-base bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/30 shadow-lg"
        />
        {results.length > 0 && (
          <ul className="surface-card absolute inset-x-0 top-16 z-20 max-h-80 overflow-y-auto p-2 shadow-2xl border-border bg-surface">
            {results.map((a) => (
              <li key={a.ticker}>
                <Link
                  to="/ativo/$ticker"
                  params={{ ticker: a.ticker }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-surface-2 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">{a.ticker}</span>
                    <span className="block truncate text-xs text-muted-foreground">{a.name}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-foreground">
                      R$ {typeof a.price === "number" ? a.price.toFixed(2) : a.price}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded",
                        a.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
                      )}
                    >
                      {a.change >= 0 ? "+" : ""}
                      {typeof a.change === "number" ? a.change.toFixed(2) : a.change}%
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5 text-primary" />
          Filtrar:
        </span>
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              selectedFilter === tab
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-surface-2/60 text-muted-foreground hover:bg-surface-2 hover:text-foreground border border-white/5",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Asset Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {q ? "Resultados da busca" : `Ativos em Destaque (${filteredAssets.length})`}
          </h2>
          <span className="text-xs text-muted-foreground">
            Clique no ativo para abrir o parecer da IA
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((a) => (
            <Link
              key={a.ticker}
              to="/ativo/$ticker"
              params={{ ticker: a.ticker }}
              className="surface-card group p-4 transition-all duration-200 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {a.ticker}
                    </p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-2 border border-white/5 text-muted-foreground">
                      B3
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">{a.name || a.sector}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold",
                    a.change >= 0
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/20",
                  )}
                >
                  {a.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {a.change >= 0 ? "+" : ""}
                  {typeof a.change === "number" ? a.change.toFixed(2) : a.change}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-muted-foreground">Preço Atual</span>
                <p className="text-lg font-bold text-foreground">
                  R$ {typeof a.price === "number" ? a.price.toFixed(2) : a.price}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-primary/90 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Score Quant & IA
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

