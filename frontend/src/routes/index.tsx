import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  ImageIcon,
  Flame,
  TrendingUp,
  TrendingDown,
  Trophy,
  Loader2,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Layers,
  Zap,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UploadProofDialog } from "@/components/upload-proof-dialog";
import { currentUser as defaultUser, ranking as defaultRanking, assets as defaultAssets } from "@/lib/mock-data";
import { api, type PostItem, type UserProfile, type UserRankingItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InstitutionalPartnersBanner } from "@/components/institutional-partners";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed · SmartInvest AI" },
      {
        name: "description",
        content:
          "Acompanhe os aportes, análises e ligas dos investidores que você segue no feed.",
      },
      { property: "og:title", content: "Feed · SmartInvest AI" },
      {
        property: "og:description",
        content: "Rede social gamificada para investidores: aportes, ligas e análises apoiadas em IA.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  //verificando se está logado:
  const isAutenticado = typeof window !== 'undefined' && localStorage.getItem("auth_token") !== null;

  if(!isAutenticado){
    return <Navigate to="/login" replace />;
  }

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser as any);
  const [rankingList, setRankingList] = useState<UserRankingItem[]>(defaultRanking as any);
  const [marketAssets, setMarketAssets] = useState<any[]>(defaultAssets);

  const carregarDados = async () => {
    // 1. Carregar Posts do Banco de Dados
    try {
      const postsData = await api.getPosts();
      if (Array.isArray(postsData) && postsData.length > 0) {
        setPosts(postsData);
        const countMap: Record<string, number> = {};
        postsData.forEach((p) => {
          countMap[p.id] = p.likes;
        });
        setLikesCountMap(countMap);
      }
    } catch (err) {
      console.log("Usando posts fallback:", err);
    } finally {
      setLoadingPosts(false);
    }

    // 2. Carregar Perfil do Usuário
    try {
      const profileData = await api.getProfile();
      if (profileData?.dados) {
        setUserProfile(profileData.dados);
      }
    } catch (err) {
      console.log("Erro ao carregar perfil:", err);
    }

    // 3. Carregar Ranking de Usuários
    try {
      const rankingData = await api.getUserRanking();
      if (Array.isArray(rankingData) && rankingData.length > 0) {
        setRankingList(rankingData);
      }
    } catch (err) {
      console.log("Erro ao carregar ranking:", err);
    }

    // 4. Carregar Home Dashboard
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
          }))
        );
      }
    } catch (err) {
      console.log("Erro ao carregar home dashboard:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handlePublishPost = async () => {
    const text = newPostText.trim();
    if (!text || publishing) return;

    setPublishing(true);
    try {
      const res = await api.createPost({
        conteudo: text,
        tag: "Análise",
        comprovante: false,
      });

      toast.success("Publicado no feed com sucesso!");
      setNewPostText("");

      // Recarregar posts
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
    } catch (err: any) {
      toast.error(err.message || "Erro ao publicar");
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedMap[postId] || false;
    const currentCount = likesCountMap[postId] || 0;

    // Atualização otimista
    setLikedMap((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [postId]: isCurrentlyLiked ? Math.max(currentCount - 1, 0) : currentCount + 1,
    }));

    try {
      await api.toggleLikePost(postId);
    } catch (err) {
      // Reverter se falhar
      setLikedMap((prev) => ({ ...prev, [postId]: isCurrentlyLiked }));
      setLikesCountMap((prev) => ({ ...prev, [postId]: currentCount }));
    }
  };

  const handleDeletePost = async (postId: string) => {
    // Pede confirmação antes de apagar
    if (!window.confirm("Tem certeza que deseja excluir esta publicação?")) return;

    try {
      // Remove do banco de dados
      await api.deletePost(postId);
      toast.success("Publicação excluída com sucesso!");
      
      // Atualiza a tela removendo o post instantaneamente
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir publicação.");
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-6">
        {/* LIQUID HERO BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#161C2A] via-[#10141E] to-[#0D1017] p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
            <img 
              src="/logo.png" 
              alt="Liquid Invest Logo" 
              className="h-64 w-64 object-contain drop-shadow-[0_0_40px_rgba(252,91,63,0.35)] opacity-95 animate-pulse" 
              style={{ animationDuration: '4s' }} 
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fintech Quantitativa & Social da B3</span>
            </div>

            <h1 className="text-2xl font-black sm:text-4xl tracking-tight leading-tight text-foreground">
              Economize tempo. Obtenha{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#FF755C] to-[#FFA085]">
                maior rentabilidade
              </span>
              . Multiplique seu patrimônio.
            </h1>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Junte-se à comunidade de investidores inteligentes. Aporte todo mês com comprovante verificado, acumule pontos nas ligas e receba teses preditivas por inteligência artificial.
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
                <Button variant="outline" className="border-border bg-surface-2/60 hover:bg-surface-2 text-foreground font-semibold">
                  Explorar Ações B3
                </Button>
              </Link>
            </div>
          </div>

          {/* LIQUID 3 FEATURES GRID */}
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

        {/* LIQUID 3-STEP FLOW BANNER */}
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

        {/* EMPRESAS FAMOSAS DE INVESTIMENTO BANNER */}
        <InstitutionalPartnersBanner />

        {/* FEED HEADER */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl text-foreground">Feed da Comunidade</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Aportes auditados, teses e discussões em tempo real com outros investidores.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs font-semibold">
            {posts.length} publicações ativas
          </Badge>
        </div>

        {/* Caixa de Criação de Post */}
        <div className="surface-card p-4 sm:p-5 border-border/80">
          <div className="flex gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 border border-white/10 text-xs font-bold text-primary">
              {userProfile.initials || "US"}
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <Textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePublishPost();
                  }
                }}
                placeholder="Compartilhe seu aporte, análise ou dúvida com a comunidade..."
                className="min-h-20 resize-none border-0 bg-transparent px-0 text-sm sm:text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <UploadProofDialog
                  onSuccess={() => {
                    carregarDados();
                  }}
                  trigger={
                    <button className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span>Anexar comprovante de aporte (+1 ponto)</span>
                    </button>
                  }
                />
                <Button
                  size="sm"
                  className="font-bold gap-1.5 bg-primary hover:bg-[#E04B30] text-white px-4 shadow-md shadow-primary/20"
                  onClick={handlePublishPost}
                  disabled={publishing || !newPostText.trim()}
                >
                  {publishing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Publicar no Feed</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Posts */}
        {loadingPosts ? (
          <div className="surface-card flex items-center justify-center p-12 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Carregando publicações...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="surface-card p-10 text-center text-muted-foreground">
            Nenhuma publicação encontrada. Seja o primeiro a postar!
          </div>
        ) : (
          posts.map((post) => {
            const isLiked = likedMap[post.id] || false;
            const currentLikes = likesCountMap[post.id] !== undefined ? likesCountMap[post.id] : post.likes;

            return (
              <article key={post.id} className="surface-card p-4 sm:p-5">
                <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold">
                    {post.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{post.author}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {post.handle} · {post.time}
                    </p>
                  </div>
                  
                  {/* LIXEIRA ADICIONADA AQUI DENTRO DESSA DIV: */}
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
                      {post.tag}
                    </Badge>
                    
                    {post.handle === userProfile.handle && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Excluir publicação"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </header>

                <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.proof && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface-2/60">
                    {post.proof_url ? (
                      <div className="relative max-h-80 w-full overflow-hidden bg-black/20">
                        <img 
                          src={post.proof_url} 
                          alt="Comprovante de Aporte" 
                          className="h-full w-full object-contain mx-auto max-h-72"
                        />
                      </div>
                    ) : null}
                    <div className="flex items-center gap-3 p-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Trophy className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">Comprovante de aporte verificado</p>
                        <p className="truncate text-xs text-muted-foreground">
                          +1 ponto computado na base de dados
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <footer className="mt-4 flex items-center gap-1 text-muted-foreground">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2",
                      isLiked && "text-primary font-semibold",
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current text-primary")} />
                    {currentLikes}
                  </button>
                  <CommentModal post={post} />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copiado para a área de transferência!");
                    }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                </footer>
              </article>
            );
          })
        )}
      </div>

      {/* Sidebar Lateral */}
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
            Faltam {Math.max((userProfile.nextLevelAt || 40) - (userProfile.points || 34), 0)} pontos para o nível{" "}
            {(userProfile.level || 6) + 1}
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
function CommentModal({ post }: { post: any }) {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(false);

  // Função separada para carregar os comentários (assim podemos chamar ela de novo depois de salvar)
  const carregarComentarios = () => {
    api.getComments(post.id)
      .then((res) => setComentarios(res || []))
      .catch(() => console.log("Nenhum comentário encontrado"));
  };

  useEffect(() => {
    carregarComentarios();
  }, [post.id]);

  const handleEnviar = async () => {
    if (!novoComentario.trim()) return;
    setLoading(true);
    
    try {
      // 1. Envia 'conteudo' para a sua rota
      await api.addComment(post.id, novoComentario);
      
      // 2. Limpa o input
      setNovoComentario("");
      toast.success("Comentário salvo!");
      
      // 3. Pede para a API os comentários atualizados (para aparecer o que você acabou de escrever)
      carregarComentarios();
      
    } catch (err) {
      toast.error("Erro ao salvar comentário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 transition-colors hover:text-primary">
          <MessageSquare className="h-4 w-4" />
          <span>{comentarios.length || post.comments || 0}</span>
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-surface border-border">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto p-1 pr-2">
          {comentarios.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold text-foreground uppercase">
                  {/* Usa as iniciais reais que vêm do seu backend */}
                  {c.autor_initials || (c.autor_nome ? c.autor_nome.charAt(0) : "IA")}
                </span>
                <div className="flex-1 rounded-xl bg-surface-2/50 p-3 text-sm">
                  <div className="flex items-baseline gap-2">
                    {/* Usa o nome real do seu backend */}
                    <span className="font-semibold text-foreground">{c.autor_nome || "Investidor Anônimo"}</span>
                  </div>
                  {/* Usa o conteúdo real do seu backend */}
                  <p className="mt-1 text-foreground/90">{c.conteudo}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
          <Input
            placeholder="Escreva um comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
            className="flex-1 bg-surface-2/50"
            disabled={loading}
          />
          <Button size="icon" onClick={handleEnviar} disabled={!novoComentario.trim() || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}