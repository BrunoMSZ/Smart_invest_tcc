import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { assets as defaultAssets, portfolios, priceSeries, ranking as defaultRanking } from "@/lib/mock-data";
import { api, type UserProfile, type UserRankingItem } from "@/lib/api";
import { currentUser as defaultUser } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · SmartInvest AI" },
      {
        name: "description",
        content: "Gráficos de desempenho, ranking e alocação de carteira.",
      },
      { property: "og:title", content: "Dashboard · SmartInvest AI" },
    ],
  }),
  component: DashboardPage,
});

const PIE_COLORS = ["#FC5B3F", "#34D399", "#38BDF8", "#A78BFA", "#FBBF24"];

function DashboardPage() {
  const isAutenticado = typeof window !== "undefined" && localStorage.getItem("auth_token") !== null;
  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser as any);
  const [rankingList, setRankingList] = useState<UserRankingItem[]>(defaultRanking as any);
  const [marketAssets, setMarketAssets] = useState<any[]>(defaultAssets);

  useEffect(() => {
    (async () => {
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
        if (homeData?.acoes_em_alta?.length) {
          setMarketAssets(
            homeData.acoes_em_alta.map((a: any) => ({
              ticker: a.ticker,
              name: a.nome || a.ticker,
              change: typeof a.alta === "number" ? a.alta : 1.5,
              score: a.score || 50,
            })),
          );
        }
      } catch {}
    })();
  }, []);

  const rankingChart = useMemo(
    () =>
      rankingList.slice(0, 8).map((r) => ({
        name: r.name.split(" ")[0] || r.name,
        pontos: r.points,
      })),
    [rankingList],
  );

  const marketChart = useMemo(
    () =>
      marketAssets.slice(0, 8).map((a) => ({
        ticker: a.ticker,
        variacao: typeof a.change === "number" ? Number(a.change.toFixed(2)) : Number(a.change) || 0,
      })),
    [marketAssets],
  );

  const progressoChart = useMemo(() => {
    const pts = userProfile.points || 34;
    const streak = userProfile.streak || 8;
    const base = Math.max(pts - streak * 3, 5);
    return Array.from({ length: Math.min(streak, 8) }, (_, i) => ({
      mes: `M${i + 1}`,
      pontos: Math.round(base + ((pts - base) * (i + 1)) / Math.min(streak, 8)),
    }));
  }, [userProfile]);

  const perfilKey = (userProfile.perfil_investidor || "moderado").toLowerCase() as keyof typeof portfolios;
  const alocacao = portfolios[perfilKey] || portfolios.moderado;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl text-foreground">Dashboard</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Painel analítico com gráficos de ranking, mercado, progresso e alocação.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Progresso de pontos */}
        <div className="surface-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3">Evolução de pontos</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressoChart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ptsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FC5B3F" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#FC5B3F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#161C2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="pontos" stroke="#FC5B3F" fill="url(#ptsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alocação sugerida */}
        <div className="surface-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3">
            Alocação sugerida · {userProfile.perfil_investidor || "moderado"}
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alocacao}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {alocacao.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#161C2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  formatter={(value: number) => [`${value}%`, "Peso"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {alocacao.map((item, i) => (
              <li key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-semibold text-foreground">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ranking */}
        <div className="surface-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3">Ranking da liga (pontos)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingChart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#161C2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                />
                <Bar dataKey="pontos" fill="#FC5B3F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mercado */}
        <div className="surface-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3">Variação dos ativos em destaque (%)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketChart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="ticker" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#161C2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                />
                <Bar dataKey="variacao" radius={[6, 6, 0, 0]}>
                  {marketChart.map((entry, i) => (
                    <Cell key={i} fill={entry.variacao >= 0 ? "#34D399" : "#F87171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Série de preço exemplo */}
        <div className="surface-card p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3">Referência de preço · série recente</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceSeries} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="d" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: "#161C2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                />
                <Area type="monotone" dataKey="p" stroke="#38BDF8" fill="url(#priceFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
