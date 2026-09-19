import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Flame, Medal, Lock, Trophy, Crown, Sparkles, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadProofDialog } from "@/components/upload-proof-dialog";
import { badges as defaultBadges, currentUser as defaultUser, ranking as defaultUserRanking } from "@/lib/mock-data";
import { api, type StockRankingItem, type UserRankingItem, type UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking e Conquistas · Aporta" },
      {
        name: "description",
        content:
          "Acompanhe sua pontuação mensal, níveis, badges e o ranking de ações recomendadas por Machine Learning.",
      },
      { property: "og:title", content: "Ranking e Conquistas · Aporta" },
      {
        property: "og:description",
        content: "Ranking de ações por IA e gamificação de aportes mensais.",
      },
    ],
  }),
  component: RankingPage,
});

const months = ["Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
const done = [true, true, false, true, true, true, true, true, true, true, true, true];

function RankingPage() {
  const [stockRanking, setStockRanking] = useState<StockRankingItem[]>([]);
  const [userRanking, setUserRanking] = useState<UserRankingItem[]>(defaultUserRanking as any);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser as any);
  const [loadingStocks, setLoadingStocks] = useState(true);

  const carregarDados = () => {
    setLoadingStocks(true);

    // 1. Ranking Quantitativo de Ações
    api.getStockRanking(10)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStockRanking(data);
        }
      })
      .catch((err) => {
        console.log("Fallback stock ranking:", err);
      })
      .finally(() => setLoadingStocks(false));

    // 2. Ranking de Usuários
    api.getUserRanking()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUserRanking(data);
        }
      })
      .catch((err) => {
        console.log("Fallback user ranking:", err);
      });

    // 3. Perfil do Usuário
    api.getProfile()
      .then((res) => {
        if (res?.dados) {
          setUserProfile(res.dados);
        }
      })
      .catch((err) => {
        console.log("Fallback user profile:", err);
      });
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Liquid Header */}
      <div className="surface-card p-6 border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
              <Trophy className="h-3.5 w-3.5" />
              <span>Liga de Consistência & Disciplina B3</span>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl tracking-tight text-foreground">
              Ranking & Recomendações
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe a atratividade quantitativa dos ativos e dispute posições com outros investidores comprovando aportes reais.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/40 text-xs text-primary font-bold w-fit">
            Temporada 2026
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="surface-card liquid-glow p-6 border-border/80">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase font-bold tracking-widest text-primary">
                Sua pontuação de aportes
              </p>
              <p className="mt-2 font-display text-5xl font-black text-foreground">
                {userProfile.points || 34}{" "}
                <span className="text-lg font-bold text-primary">pts</span>
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                Nível {userProfile.level || 6} · <strong className="text-foreground">{userProfile.levelName || "Investidor Consistente"}</strong>
              </p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/30 shadow-lg shadow-primary/20">
              <Crown className="h-7 w-7" />
            </span>
          </div>
          <Progress
            value={((userProfile.points || 34) / (userProfile.nextLevelAt || 40)) * 100}
            className="mt-5 h-2.5 bg-surface-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Faltam <strong>{Math.max((userProfile.nextLevelAt || 40) - (userProfile.points || 34), 0)} pontos</strong> para o nível{" "}
            {(userProfile.level || 6) + 1}
          </p>
          <div className="mt-5">
            <UploadProofDialog onSuccess={carregarDados} />
          </div>
        </div>

        <div className="surface-card p-6 border-border/80">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Flame className="h-4 w-4 text-primary" />
            Sequência de Aportes Mensais
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {userProfile.streak || 8} meses consecutivos registrados e auditados
          </p>
          <div className="mt-5 grid grid-cols-6 gap-2">
            {months.map((m, i) => (
              <div key={m} className="text-center">
                <div
                  className={cn(
                    "grid h-10 place-items-center rounded-xl border text-xs font-bold transition-all",
                    done[i]
                      ? "border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/15"
                      : "border-border bg-surface-2/40 text-muted-foreground/60",
                  )}
                >
                  {done[i] ? "+1" : "—"}
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="acoes">
        <TabsList className="bg-surface-2/60 border border-border p-1">
          <TabsTrigger value="acoes" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Top Ações por IA
          </TabsTrigger>
          <TabsTrigger value="ranking" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
            Liga de Usuários
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
            Conquistas
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TOP AÇÕES POR IA */}
        <TabsContent value="acoes" className="mt-4">
          <div className="surface-card divide-y divide-border overflow-hidden">
            <div className="p-4 bg-surface-2/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Score Multi-Fatorial de Atratividade</p>
                <p className="text-xs text-muted-foreground">
                  Ponderação: 60% Probabilidade XGBoost + 30% Tendência + 10% Humor FinBERT
                </p>
              </div>
              {loadingStocks ? (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Calculando...</span>
                </div>
              ) : (
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  Atualização Diária
                </Badge>
              )}
            </div>

            {stockRanking.map((stock, idx) => (
              <div
                key={stock.ticker}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 p-4 hover:bg-surface-2/50 transition-colors"
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold",
                    idx === 0
                      ? "bg-primary text-primary-foreground font-black"
                      : idx <= 2
                      ? "bg-gold-soft text-primary font-bold"
                      : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-base font-bold text-foreground">{stock.ticker}</p>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {stock.setor}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {stock.nome} · R$ {typeof stock.preco === "number" ? stock.preco.toFixed(2) : stock.preco}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gradient-gold">
                    {stock.score_final} pts
                  </p>
                  <p className="text-[11px] text-success font-medium flex items-center justify-end gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    {stock.decisao}
                  </p>
                </div>
                <Link to={`/ativo/${stock.ticker}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span>Analisar</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: LIGA DE USUÁRIOS */}
        <TabsContent value="ranking" className="mt-4">
          <div className="surface-card divide-y divide-border overflow-hidden">
            {userRanking.map((r) => (
              <div
                key={r.pos}
                className={cn(
                  "grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5",
                  r.name === userProfile.name && "bg-gold-soft",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                    r.pos <= 3
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {r.pos}
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.badge} · {r.streak} meses seguidos
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">{r.points} pts</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: CONQUISTAS */}
        <TabsContent value="badges" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {defaultBadges.map((b) => (
              <div
                key={b.name}
                className={cn(
                  "surface-card flex items-center gap-3 p-4",
                  !b.earned && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                    b.earned ? "bg-gold-soft text-primary" : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {b.earned ? <Medal className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            Conquistas desbloqueiam molduras de perfil exclusivas nas ligas.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
