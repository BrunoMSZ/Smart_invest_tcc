import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Flame,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { currentUser as defaultUser, ranking as defaultRanking, assets as defaultAssets } from "@/lib/mock-data";
import { api, type UserProfile, type UserRankingItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { InstitutionalPartnersBanner } from "@/components/institutional-partners";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Início · SmartInvest AI" },
      {
        name: "description",
        content: "Visão geral da plataforma: progresso, ranking e destaques do mercado.",
      },
      { property: "og:title", content: "Início · SmartInvest AI" },
    ],
  }),
  component: InicioPage,
});

function InicioPage() {
  const isAutenticado = typeof window !== "undefined" && localStorage.getItem("auth_token") !== null;

  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser as any);
  const [rankingList, setRankingList] = useState<UserRankingItem[]>(defaultRanking as any);
  const [marketAssets, setMarketAssets] = useState<any[]>(defaultAssets);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const profileData = await api.getProfile();
        if (profileData?.dados) setUserProfile(profileData.dados);
      } catch {}

      try {
        const rankingData = await api.getUserRanking();
        if (Array.isArray(rankingData) && rankingData.length > 0) setRankingList(rankingData);
      } catch {}

      try {
        const homeData = await api.getHomeDashboard();
        if (homeData?.acoes_em_alta && homeData.acoes_em_alta.length > 0) {
          setMarketAssets(
            homeData.acoes_em_alta.map((a: any) => ({
              ticker: a.ticker,
              name: a.nome || a.ticker,
              price: a.preco || 35.0,
              change: a.alta || 1.5,
              sector: a.setor || "B3",
            })),
          );
        }
      } catch {}
    };
    carregarDados();
  }, []);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl text-foreground">Início</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Visão geral da plataforma e do seu progresso.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#161C2A] via-[#10141E] to-[#0D1017] p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
            <img
              src="/logo1.png"
              alt="Smart Invest"
              className="h-72 w-72 object-contain drop-shadow-[0_0_40px_rgba(220,38,38,0.35)] opacity-95"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fintech Quantitativa & Social da B3</span>
            </div>

            <h2 className="text-2xl font-black sm:text-4xl tracking-tight leading-tight text-foreground">
              Economize tempo. Obtenha{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#FF755C] to-[#FFA085]">
                maior rentabilidade
              </span>
              . Multiplique seu patrimônio.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Junte-se à comunidade de investidores inteligentes. Aporte todo mês com comprovante
              verificado, acumule pontos nas ligas e receba teses preditivas por inteligência
              artificial.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/smart-invest">
                <Button className="bg-primary hover:bg-[#E04B30] text-white font-bold gap-2 px-5 shadow-lg shadow-primary/30">
                  <Sparkles className="h-4 w-4" />
                  <span>Simular Carteira Markowitz</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/mercado">
                <Button
                  variant="outline"
                  className="border-border bg-surface-2/60 hover:bg-surface-2 text-foreground font-semibold"
                >
                  Explorar Ações B3
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/5 pt-6">
            <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Layers className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-foreground">Multi-Ativos B3</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Ações, FIIs, Renda Fixa e ETFs consolidados em um só ambiente.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-foreground">Machine Learning</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Classificação preditiva de momentum, RSI, volatilidade e notícias.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 text-sky-400">
                  <Zap className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-foreground">Aportes Verificados</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Gamificação com pontuação real comprovada e subida de nível.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="text-center sm:text-left mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Passos simples para acelerar seus investimentos
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5">
              <span className="in-circle-badge shrink-0">1</span>
              <div>
                <p className="text-sm font-bold text-foreground">Faça o Aporte Mensal</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Envie o print ou nota de corretagem no feed para comprovação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5">
              <span className="in-circle-badge shrink-0">2</span>
              <div>
                <p className="text-sm font-bold text-foreground">Ganhe Pontos na Liga</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Suba no ranking de consistência e desbloqueie badges exclusivas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5">
              <span className="in-circle-badge shrink-0">3</span>
              <div>
                <p className="text-sm font-bold text-foreground">Otimize com IA</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receba pesos ótimos de carteira calculados por Markowitz e K-Means.
                </p>
              </div>
            </div>
          </div>
        </div>

        <InstitutionalPartnersBanner />
      </div>

      <aside className="hidden space-y-5 xl:block">
        <div className="surface-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Seu progresso</p>
            <span className="flex items-center gap-1 text-xs text-primary font-semibold">
              <Flame className="h-3.5 w-3.5" />
              {userProfile.streak || 8} meses
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-gradient-gold">
            {userProfile.points || 34} pts
          </p>
          <p className="text-xs text-muted-foreground">
            Nível {userProfile.level || 6} · {userProfile.levelName || "Investidor Consistente"}
          </p>
          <Progress
            value={((userProfile.points || 34) / (userProfile.nextLevelAt || 40)) * 100}
            className="mt-3 h-1.5"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Faltam {Math.max((userProfile.nextLevelAt || 40) - (userProfile.points || 34), 0)} pontos
            para o nível {(userProfile.level || 6) + 1}
          </p>
        </div>

        <div className="surface-card p-4">
          <p className="text-sm font-semibold">Liga de Investidores</p>
          <ul className="mt-3 space-y-2.5">
            {rankingList.slice(0, 4).map((r) => (
              <li key={r.pos} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className="w-4 text-xs font-bold text-muted-foreground">{r.pos}</span>
                <span className="truncate text-sm">{r.name}</span>
                <span className="text-xs font-semibold text-primary">{r.points} pts</span>
              </li>
            ))}
          </ul>
          <Link
            to="/ranking"
            className="mt-4 block text-center text-xs font-medium text-primary hover:underline"
          >
            Ver ranking completo
          </Link>
        </div>

        <div className="surface-card p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Em destaque no mercado
          </p>
          <ul className="mt-3 space-y-2.5">
            {marketAssets.slice(0, 4).map((a) => (
              <li key={a.ticker}>
                <Link
                  to="/ativo/$ticker"
                  params={{ ticker: a.ticker }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-2"
                >
                  <span className="truncate text-sm font-medium">{a.ticker}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      a.change >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {a.change >= 0 ? "+" : ""}
                    {typeof a.change === "number" ? a.change.toFixed(2) : a.change}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
