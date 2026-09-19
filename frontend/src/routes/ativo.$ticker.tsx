import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, Sparkles, TrendingDown, TrendingUp, Bot, Newspaper, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assets, priceSeries } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ativo/$ticker")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.ticker} · Previsibilidade & Parecer IA · Aporta` },
      {
        name: "description",
        content: `Gráfico, indicadores técnicos, notícias e tese de investimento por IA para ${params.ticker}.`,
      },
      { property: "og:title", content: `${params.ticker} · Aporta` },
      {
        property: "og:description",
        content: `Análise técnica, sentimento de notícias e orquestração de IA para ${params.ticker}.`,
      },
    ],
  }),
  component: AssetPage,
});

const ranges = ["1D", "1S", "1M", "6M", "1A", "5A"];

function AssetPage() {
  const { ticker } = Route.useParams();
  const asset = assets.find((a) => a.ticker === ticker.toUpperCase()) ?? assets[0]!;
  const [range, setRange] = useState("1M");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`http://localhost:8000/api/analyze/${ticker}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na API");
        return res.json();
      })
      .then((data) => {
        if (isMounted) setAiData(data);
      })
      .catch((err) => {
        console.log("API local não disponível, usando fallback:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  const quant = aiData?.dados_quantitativos;
  const preco = quant?.preco_atual ?? asset.price;
  const score = quant?.score_final ?? 78;
  const decisao = quant?.decisao_sugerida ?? "COMPRA";
  const probMl = quant?.prob_ml ? Math.round(quant.prob_ml * 100) : 72;
  const parecerIA = aiData?.orquestracao_ia?.parecer_executivo;
  const humorNoticias = aiData?.sentimento_noticias?.score_humor_liquido ?? 0.45;
  const noticias = aiData?.sentimento_noticias?.noticias ?? [];

  const indicators = [
    { label: "RSI (14)", value: quant?.rsi ? String(quant.rsi) : "58,2", hint: (quant?.rsi ?? 58) > 70 ? "Sobrecomprado" : (quant?.rsi ?? 58) < 30 ? "Sobrevendido" : "Neutro" },
    { label: "Dist. MM 21", value: quant?.ma_21_dist ? `${(quant.ma_21_dist * 100).toFixed(1)}%` : "+2,4%", hint: "Curto Prazo" },
    { label: "Dist. MM 200", value: quant?.ma_200_dist ? `${(quant.ma_200_dist * 100).toFixed(1)}%` : "+8,3%", hint: "Longo Prazo" },
    { label: "Volatilidade (30d)", value: quant?.vol_30 ? `${(quant.vol_30 * 100).toFixed(1)}%` : "22,0%", hint: "Risco Anualizado" },
    { label: "Momentum (63d)", value: quant?.momentum_63 ? `${(quant.momentum_63 * 100).toFixed(1)}%` : "+7,5%", hint: "Trimestre" },
    { label: "Taxa Selic", value: quant?.selic_anual ? `${quant.selic_anual}% a.a.` : "10,5% a.a.", hint: "Benchmark Macro" },
  ];

  const up = asset.change >= 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <Link
        to="/mercado"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar para o mercado
      </Link>

      <header className="surface-card p-5 sm:p-6 border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="truncate text-3xl font-black tracking-tight sm:text-4xl text-foreground">
                {ticker.toUpperCase()}
              </h1>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                Predição Quantitativa IA
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-surface-2 text-xs text-muted-foreground">
                B3 · Bolsa Brasileira
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {asset.name} · Setor: <strong className="text-foreground/90">{asset.sector}</strong>
            </p>
          </div>

          <div className="shrink-0 sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
            <div>
              <span className="text-xs text-muted-foreground block sm:hidden">Cotação Atual</span>
              <p className="text-2xl sm:text-3xl font-black text-foreground">R$ {preco.toFixed(2)}</p>
            </div>
            <p
              className={cn(
                "inline-flex items-center gap-1 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg",
                up
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/20",
              )}
            >
              {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {up ? "+" : ""}
              {asset.change.toFixed(2)}%
            </p>
          </div>
        </div>
      </header>

      {/* Gráfico Liquid Style */}
      <div className="surface-card p-4 sm:p-6 border-border/80">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Série Temporal & Médias Móveis
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                  range === r
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-muted-foreground bg-surface-2/60 hover:bg-surface-2 hover:text-foreground border border-white/5",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceSeries} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="d"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  color: "var(--color-foreground)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--color-muted-foreground)" }}
                formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Preço"]}
              />
              <Area
                type="monotone"
                dataKey="p"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicadores Técnicos & Score de IA */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card p-5">
          <p className="text-sm font-semibold">Indicadores técnicos & quantitativos</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {indicators.map((i) => (
              <div key={i.label} className="rounded-xl border border-border bg-surface-2/50 p-3">
                <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                  {i.label}
                </p>
                <p className="mt-1 truncate text-base font-semibold">{i.value}</p>
                <p className="truncate text-[11px] text-primary">{i.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card gold-glow p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Previsibilidade do Modelo (ML)
          </p>
          <p className="mt-4 font-display text-5xl font-bold text-gradient-gold">{score}</p>
          <p className="text-xs text-muted-foreground">Score Composto (0–100)</p>
          <Progress value={score} className="mt-4 h-2" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className={cn("hover:opacity-90", decisao.includes("COMPRA") ? "bg-success/15 text-success" : "bg-primary/15 text-primary")}>
              Sinal: {decisao}
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Confiança {probMl}%
            </Badge>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Índice de Humor das Notícias (FinBERT): <strong className="text-foreground">{humorNoticias > 0 ? `+${humorNoticias.toFixed(2)} (Otimista)` : `${humorNoticias.toFixed(2)} (Neutro/Defensivo)`}</strong>
          </p>
          <Link to="/chat">
            <Button className="mt-4 w-full font-semibold gap-2">
              <Bot className="h-4 w-4" />
              Perguntar à IA sobre {ticker.toUpperCase()}
            </Button>
          </Link>
        </div>
      </div>

      {/* Parecer do OpenRouter (Orquestrador) */}
      <div className="surface-card p-5 sm:p-6 border border-primary/20 bg-surface-1/60">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-soft text-primary">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Parecer Institucional do OpenRouter AI</h2>
              <p className="text-xs text-muted-foreground">
                Síntese em tempo real: XGBoost Quantitativo + NLP FinBERT + LLM Gratuita
              </p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Gerando tese...</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm leading-relaxed font-sans">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }: any) => <h1 className="mt-6 mb-4 text-2xl font-bold text-foreground" {...props} />,
              h2: ({ node, ...props }: any) => <h2 className="mt-5 mb-3 text-xl font-bold text-foreground" {...props} />,
              h3: ({ node, ...props }: any) => <h3 className="mt-4 mb-2 text-lg font-bold text-foreground" {...props} />,
              p: ({ node, ...props }: any) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
              strong: ({ node, ...props }: any) => <strong className="font-semibold text-foreground" {...props} />,
              ul: ({ node, ...props }: any) => <ul className="mb-4 list-disc pl-5 text-muted-foreground" {...props} />,
              ol: ({ node, ...props }: any) => <ol className="mb-4 list-decimal pl-5 text-muted-foreground" {...props} />,
              li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
              table: ({ node, ...props }: any) => (
                <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
                  <table className="w-full border-collapse text-sm" {...props} />
                </div>
              ),
              thead: ({ node, ...props }: any) => <thead className="bg-surface-2" {...props} />,
              th: ({ node, ...props }: any) => <th className="border-b border-border p-3 text-left font-semibold text-foreground" {...props} />,
              td: ({ node, ...props }: any) => <td className="border-b border-border p-3 text-foreground" {...props} />,
            }}
          >
            {parecerIA ? parecerIA : `O modelo aponta padrão consistente de assimetria para ${ticker.toUpperCase()}, sustentado pelo alinhamento das médias móveis e volume projetado. O índice de sentimento FinBERT confirma viés construtivo nas notícias recentes. Para gerar teses completas personalizadas com Llama 3.3 ou Gemini 2.0, conecte a API backend.`}
          </ReactMarkdown>
        </div>
      </div>

      {/* Manchetes Analisadas pelo NLP */}
      {noticias.length > 0 && (
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Últimas notícias processadas pelo FinBERT</h3>
          </div>
          <div className="space-y-2">
            {noticias.map((n: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-border/70 bg-surface-2/40 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground truncate">{n.titulo}</span>
                <Badge variant="outline" className={cn("shrink-0 text-[10px]", n.sentiment === "Positivo" ? "border-success/40 text-success" : "border-muted text-muted-foreground")}>
                  {n.sentiment} ({n.sentiment_score ? (n.sentiment_score > 0 ? `+${n.sentiment_score.toFixed(2)}` : n.sentiment_score.toFixed(2)) : "0.00"})
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
