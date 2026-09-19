import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  MessageCircle,
  Trophy,
  Users,
  LineChart,
  Newspaper,
  PieChart,
  Bell,
  User as UserIcon,
  LogOut,
  Wallet,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Building2,
  ChevronRight,
  RefreshCw,
  Activity,
  Play,
  Pause
} from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { currentUser as defaultUser } from "@/lib/mock-data";
import { UploadProofDialog } from "@/components/upload-proof-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api, type UserProfile, type MarketTickerItem, removeStoredToken } from "@/lib/api";
import { toast } from "sonner";
import logoImg from "@/assets/logo_smartInvest.png";

const defaultMarketTickerItems: MarketTickerItem[] = [
  { symbol: "IBOVESPA", value: "131.450 pts", change: "+0.68%", up: true },
  { symbol: "S&P 500", value: "5.680 pts", change: "+0.42%", up: true },
  { symbol: "NASDAQ", value: "17.920 pts", change: "+0.75%", up: true },
  { symbol: "DÓLAR (USD)", value: "R$ 5,42", change: "-0.31%", up: false },
  { symbol: "EURO (EUR)", value: "R$ 6,05", change: "-0.15%", up: false },
  { symbol: "BITCOIN", value: "US$ 64.200", change: "+2.15%", up: true },
  { symbol: "PETR4", value: "R$ 38,50", change: "+1.85%", up: true },
  { symbol: "VALE3", value: "R$ 62,10", change: "-0.40%", up: false },
  { symbol: "ITUB4", value: "R$ 34,20", change: "+1.10%", up: true },
  { symbol: "TAXA SELIC", value: "10.50% a.a.", change: "Estável", up: true },
];

const social = [
  { to: "/", label: "Feed & Teses", icon: Home },
  { to: "/chat", label: "Assistente IA", icon: MessageCircle },
  { to: "/ranking", label: "Ranking & Ligas", icon: Trophy },
  { to: "/grupos", label: "Grupos Privados", icon: Users },
];

const market = [
  { to: "/mercado", label: "Mercado B3", icon: LineChart },
  { to: "/smart-invest", label: "Smart Invest (IA)", icon: PieChart },
  { to: "/carteira", label: "Minha Carteira", icon: Wallet },
  { to: "/noticias", label: "Sentimento News", icon: Newspaper },
];

function NavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-primary/15 text-primary font-semibold shadow-sm shadow-primary/10 border-l-2 border-primary"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground")} />
      <span className="truncate">{label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  const mobileNav = [social[0]!, social[1]!, market[0]!, market[1]!, social[2]!];

  const [user, setUser] = useState<UserProfile>(defaultUser as any);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editNome, setEditNome] = useState(defaultUser.name);
  const [editRenda, setEditRenda] = useState("6500");
  const [editIdade, setEditIdade] = useState("32");
  const [savingProfile, setSavingProfile] = useState(false);

  const carregarPerfil = () => {
    api.getProfile()
      .then((res) => {
        if (res?.dados) {
          setUser(res.dados);
          setEditNome(res.dados.name);
          setEditRenda(String(res.dados.renda_mensal || 6500));
          setEditIdade(String(res.dados.idade || 32));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const handleSalvarPerfil = async () => {
    setSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: editNome,
        renda_mensal: parseFloat(editRenda) || 5000,
        idade: parseInt(editIdade) || 30,
      });
      if (res?.dados) {
        setUser(res.dados);
      }
      toast.success("Perfil atualizado no banco de dados!");
      setProfileOpen(false);
    } catch (err: any) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  // Estado do Ticker Carrossel Dinâmico (B3 & Global Markets)
  const [tickerItems, setTickerItems] = useState<MarketTickerItem[]>(defaultMarketTickerItems);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isRefreshingTicker, setIsRefreshingTicker] = useState(false);

  const carregarTicker = async () => {
    try {
      const dados = await api.getMarketTicker();
      if (dados && dados.length > 0) {
        setTickerItems(dados);
      }
    } catch (e) {
      console.warn("[AppShell] Erro ao carregar cotações online:", e);
    }
  };

  useEffect(() => {
    carregarTicker();
    const interval = setInterval(carregarTicker, 90000); // 90 segundos
    return () => clearInterval(interval);
  }, []);

  const handleRefreshTickerClick = async () => {
    setIsRefreshingTicker(true);
    await carregarTicker();
    setTimeout(() => setIsRefreshingTicker(false), 600);
  };

  const handleLogout = () => {
    removeStoredToken();
    toast.info("Você saiu da conta.");
    setProfileOpen(false);
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 1. TOP LIVE MARKET TICKER CAROUSEL (B3 & Global Markets ao vivo) */}
      <div className="border-b border-border/80 bg-[#07090E] text-xs py-1 px-3 z-40 select-none overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge Fixo Esquerdo */}
          <div className="flex items-center gap-2 shrink-0 border-r border-border/60 pr-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-xs tracking-wider uppercase text-foreground/80 hidden sm:inline">
              B3 & Global Markets
            </span>
            <span className="font-semibold text-xs tracking-wider uppercase text-foreground/80 sm:hidden">
              Mercados
            </span>
            <button
              onClick={handleRefreshTickerClick}
              className="p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-surface-2"
              title="Atualizar cotações em tempo real"
            >
              <RefreshCw className={cn("h-3 w-3", isRefreshingTicker && "animate-spin text-primary")} />
            </button>
            <button
              onClick={() => setIsTickerPaused((prev) => !prev)}
              className="p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-surface-2"
              title={isTickerPaused ? "Retomar rotação automática" : "Pausar rotação automática"}
            >
              {isTickerPaused ? <Play className="h-3 w-3 text-emerald-400" /> : <Pause className="h-3 w-3" />}
            </button>
          </div>

          {/* Área Deslizante do Carrossel Contínuo Devagar */}
          <div
            onMouseEnter={() => setIsTickerPaused(true)}
            onMouseLeave={() => setIsTickerPaused(false)}
            className="flex-1 overflow-hidden whitespace-nowrap cursor-pointer"
            title="Passe o mouse para pausar ou clique em uma ação para ver a análise"
          >
            <div
              className="animate-ticker-glide inline-flex items-center gap-5"
              style={{ animationPlayState: isTickerPaused ? "paused" : "running" }}
            >
              {[...tickerItems, ...tickerItems].map((item, idx) => {
                const isStock = /^[A-Z]{4}(?:3|4|5|6|11)$/.test(item.symbol);
                const content = (
                  <div
                    className="inline-flex items-center gap-2 shrink-0 px-2 py-0.5 rounded transition-colors hover:bg-surface-2/80"
                  >
                    <span className="font-bold text-foreground/90">{item.symbol}</span>
                    <span className="text-muted-foreground font-medium">{item.value}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                        item.up
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                      )}
                    >
                      {item.up ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {item.change}
                    </span>
                  </div>
                );

                if (isStock) {
                  return (
                    <Link
                      key={`${item.symbol}-${idx}`}
                      to="/ativo/$ticker"
                      params={{ ticker: item.symbol }}
                      className="no-underline inline-block"
                      title={`Ver análise completa de ${item.symbol}`}
                    >
                      {content}
                    </Link>
                  );
                }
                return <span key={`${item.symbol}-${idx}`} className="inline-block">{content}</span>;
              })}
            </div>
          </div>

          {/* Referência Institucional */}
          <div className="hidden 2xl:flex items-center gap-2 shrink-0 border-l border-border/60 pl-3 text-muted-foreground text-[11px]">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span className="truncate">Cotações B3 & Globais em Tempo Real</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        {/* 2. SIDEBAR - LIQUID INVESTMENT STYLE */}
        <aside className="sticky top-0 hidden h-[calc(100vh-33px)] w-68 shrink-0 flex-col gap-5 border-r border-border bg-[#0B0E14]/95 px-4 py-5 backdrop-blur-xl lg:flex">
          {/* Logo Liquid Brand */}
          <Link to="/" className="flex items-center gap-3 px-2 py-1 transition-all hover:opacity-95 group">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#161C2B] border border-primary/25 p-1 shadow-lg shadow-primary/20 group-hover:border-primary/50 transition-colors">
              <img src="/logo.png" alt="Liquid Invest Logo" className="h-9 w-9 object-contain drop-shadow" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0B0E14] bg-emerald-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-foreground">
                  LIQUID
                </span>
                <span className="text-primary font-extrabold text-lg">INVEST</span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Quant & Fintech Hub
              </p>
            </div>
          </Link>

          {/* Quick Institutional Pill */}
          <div className="rounded-xl border border-white/5 bg-surface/80 p-2.5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Auditoria de Aportes
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Ativo
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/80 leading-snug">
              Modelos inspirados em Markowitz, Black-Litterman e B3.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Comunidade & Ligas
            </p>
            {social.map((i) => (
              <NavLink key={i.to} {...i} active={isActive(i.to)} />
            ))}

            <p className="px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Mercado & Modelos Quant
            </p>
            {market.map((i) => (
              <NavLink key={i.to} {...i} active={isActive(i.to)} />
            ))}
          </nav>

          {/* Bottom Controls / Profile */}
          <div className="mt-auto space-y-3 pt-2">
            <UploadProofDialog onSuccess={carregarPerfil} />

            {/* User Profile Mini Card */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <button className="surface-card group flex w-full items-center gap-3 p-2.5 text-left transition-all hover:border-primary/50 hover:bg-surface-2">
                  <div className="relative">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-surface-2 to-surface border border-white/10 text-xs font-bold text-foreground group-hover:border-primary/40">
                      {user.initials || "RD"}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user.name || "Rafael Duarte"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Nível {user.level || 6} · <span className="text-primary font-semibold">{user.points || 34} pts</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-border bg-surface text-foreground shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Perfil do Investidor
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Dados do investidor sincronizados com o motor de risco e o banco SQLite.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-base font-bold text-primary border border-primary/20">
                      {user.initials || "RD"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email || "rafael@aporta.com"}</p>
                      <p className="text-xs text-primary font-semibold mt-0.5">
                        Perfil: {user.perfil_investidor?.toUpperCase() || "MODERADO"} · Nível {user.level || 6} ({user.badge || "Ouro"})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nome_edit">Nome Completo</Label>
                    <Input
                      id="nome_edit"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      className="bg-surface-2/50 border-border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="idade_edit">Idade</Label>
                      <Input
                        id="idade_edit"
                        value={editIdade}
                        onChange={(e) => setEditIdade(e.target.value)}
                        type="number"
                        className="bg-surface-2/50 border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="renda_edit">Renda Mensal (R$)</Label>
                      <Input
                        id="renda_edit"
                        value={editRenda}
                        onChange={(e) => setEditRenda(e.target.value)}
                        type="number"
                        className="bg-surface-2/50 border-border"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="destructive"
                      className="gap-1.5 font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setProfileOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 font-semibold bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25"
                      onClick={handleSalvarPerfil}
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header Bar */}
          <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {/* Mobile logo */}
              <Link to="/" className="flex items-center gap-2.5 lg:hidden">
                <img src="/logo.png" alt="Liquid Invest Logo" className="h-8 w-8 object-contain drop-shadow" />
                <span className="font-extrabold tracking-tight text-base text-foreground">Liquid Invest</span>
              </Link>

              {/* Desktop breadcrumb/status */}
              <div className="hidden lg:flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  <span>Sessão B3 Regular</span>
                </span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">
                  Ambiente Quantitativo com Aprendizado Contínuo
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link to="/smart-invest" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Simulador Markowitz</span>
                </Button>
              </Link>

              <button
                onClick={() => toast.info("Você não possui notificações pendentes no momento.")}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground hover:bg-surface-2 hover:border-primary/40"
                title="Notificações"
              >
                <Bell className="h-4 w-4" />
              </button>

              <button
                onClick={() => setProfileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-surface border border-white/10 text-xs font-bold transition-all hover:scale-105 hover:border-primary/50"
                title="Meu Perfil"
              >
                {user.initials || "RD"}
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sair da conta"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-8 max-w-[1400px] mx-auto">{children}</main>
        </div>
      </div>

      {/* 4. MOBILE BOTTOM BAR */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {mobileNav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
              isActive(to) ? "text-primary font-bold" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
