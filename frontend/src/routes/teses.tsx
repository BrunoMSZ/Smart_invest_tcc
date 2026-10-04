import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Loader2,
  Send,
  Trash2,
  Sparkles,
  ArrowRight,
  PenLine,
  Repeat2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WhatsAppReactions } from "@/components/whatsapp-reactions";
import { SharePostDialog, SharedPostEmbed } from "@/components/share-post-dialog";
import { currentUser as defaultUser } from "@/lib/mock-data";
import { api, type PostItem, type UserProfile } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { PostDetailDialog } from "@/components/post-detail-dialog";

export const Route = createFileRoute("/teses")({
  head: () => ({
    meta: [
      { title: "Teses · SmartInvest AI" },
      {
        name: "description",
        content: "Publique e acompanhe teses de investimento da comunidade.",
      },
      { property: "og:title", content: "Teses · SmartInvest AI" },
      {
        property: "og:description",
        content: "Análises e teses de investimento sobre ações da B3.",
      },
    ],
  }),
  component: TesesPage,
});

const FEATURED_TESES = [
  {
    ticker: "PETR4",
    title: "Petrobras e o ciclo de commodities",
    blurb: "Tese sobre geração de caixa, dividendos e sensibilidade ao Brent.",
  },
  {
    ticker: "VALE3",
    title: "Vale e a demanda por minério",
    blurb: "Cenário de China, custos e precificação do minério de ferro.",
  },
  {
    ticker: "ITUB4",
    title: "Itaú e o ciclo de crédito",
    blurb: "Margem financeira, inadimplência e Selic no resultado do banco.",
  },
];

function TesesPage() {
  const navigate = useNavigate();
  const isAutenticado = typeof window !== "undefined" && localStorage.getItem("auth_token") !== null;

  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUser as any);
  const [followMap, setFollowMap] = useState<Record<number, boolean>>({});

  const carregarDados = async () => {
    try {
      const postsData = await api.getPosts();
      if (Array.isArray(postsData)) {
        const teses = postsData.filter((p) => (p.tag || "").toLowerCase() === "análise");
        setPosts(teses);
        setFollowMap((prev) => {
          const next = { ...prev };
          teses.forEach((p) => {
            if (p.user_id != null && next[p.user_id] === undefined) next[p.user_id] = Boolean(p.is_following);
          });
          return next;
        });
        const countMap: Record<string, number> = {};
        teses.forEach((p) => {
          countMap[p.id] = p.likes;
        });
        setLikesCountMap(countMap);
      }
    } catch (err) {
      console.log("Erro ao carregar teses:", err);
    } finally {
      setLoadingPosts(false);
    }

    try {
      const profileData = await api.getProfile();
      if (profileData?.dados) {
        setUserProfile(profileData.dados);
      }
    } catch (err) {
      console.log("Erro ao carregar perfil:", err);
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
      await api.createPost({
        conteudo: text,
        tag: "Análise",
        comprovante: false,
      });

      toast.success("Tese publicada com sucesso!");
      setNewPostText("");

      const updatedPosts = await api.getPosts();
      const teses = Array.isArray(updatedPosts)
        ? updatedPosts.filter((p) => (p.tag || "").toLowerCase() === "análise")
        : [];
      setPosts(teses);
    } catch (err: any) {
      toast.error(err.message || "Erro ao publicar tese");
    } finally {
      setPublishing(false);
    }
  };

  const alternarSeguir = async (userId: number) => {
    const antes = Boolean(followMap[userId]);
    setFollowMap((prev) => ({ ...prev, [userId]: !antes }));
    try {
      const res = await api.toggleFollow(userId);
      setFollowMap((prev) => ({ ...prev, [userId]: res.following }));
    } catch {
      setFollowMap((prev) => ({ ...prev, [userId]: antes }));
      toast.error("Não foi possível atualizar o seguir.");
    }
  };

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedMap[postId] || false;
    const currentCount = likesCountMap[postId] || 0;

    setLikedMap((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [postId]: isCurrentlyLiked ? Math.max(currentCount - 1, 0) : currentCount + 1,
    }));

    try {
      await api.toggleLikePost(postId);
    } catch (err) {
      setLikedMap((prev) => ({ ...prev, [postId]: isCurrentlyLiked }));
      setLikesCountMap((prev) => ({ ...prev, [postId]: currentCount }));
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await api.deletePost(deleteTarget);
      toast.success("Tese excluída com sucesso!");
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir tese.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PostDetailDialog
        post={selectedPost}
        viewer={{ id: userProfile.id, avatar_url: userProfile.avatar_url, initials: userProfile.initials }}
        likes={selectedPost ? likesCountMap[selectedPost.id] ?? selectedPost.likes : 0}
        liked={selectedPost ? Boolean(likedMap[selectedPost.id]) : false}
        reactionKey={selectedPost ? `tese_${selectedPost.id}` : undefined}
        onClose={() => setSelectedPost(null)}
        onLike={(emoji) => {
          if (!selectedPost) return;
          const isLiked = likedMap[selectedPost.id] || false;
          if (emoji === "❤️" && !isLiked) void handleLike(selectedPost.id);
          if (emoji === null && isLiked) void handleLike(selectedPost.id);
        }}
        onCommented={() => {
          if (!selectedPost) return;
          setPosts((prev) =>
            prev.map((p) => (p.id === selectedPost.id ? { ...p, comments: (p.comments || 0) + 1 } : p)),
          );
          setSelectedPost((prev) => (prev ? { ...prev, comments: (prev.comments || 0) + 1 } : prev));
        }}
      />
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Excluir tese?"
        description="Essa ação não pode ser desfeita. A tese some para todo mundo."
        confirming={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeletePost()}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl text-foreground">Teses</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Análises e teses de investimento da comunidade.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs font-semibold">
          {posts.length} teses
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {FEATURED_TESES.map((tese) => (
          <Link
            key={tese.ticker}
            to="/ativo/$ticker"
            params={{ ticker: tese.ticker }}
            className="surface-card group p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {tese.ticker}
              </Badge>
              <Sparkles className="h-3.5 w-3.5 text-primary opacity-70" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {tese.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tese.blurb}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Ver ativo <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-sm border border-white/10 bg-[#161C2B] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary/15 text-primary">
            <PenLine className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-semibold text-foreground">Escreva sua tese</p>
        </div>
        <div className="flex gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-sm bg-surface border border-white/10 text-xs font-bold text-primary">
            {userProfile.avatar_url ? (
              <img src={userProfile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              userProfile.initials || "US"
            )}
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <Textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void handlePublishPost();
                }
              }}
              placeholder="Escreva aqui. Ex.: Por que PETR4 ainda tem upside no cenário de dividendos..."
              className="min-h-28 resize-none rounded-sm border border-white/15 bg-[#0B0E14] px-3 py-2.5 text-sm sm:text-base shadow-inner placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/40"
              maxLength={2000}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                Tag: Análise
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {newPostText.length}/2000
                </span>
                <Button
                  size="sm"
                  className="font-bold gap-1.5 bg-primary hover:bg-[#E04B30] text-white px-4 shadow-md shadow-primary/20"
                  onClick={() => void handlePublishPost()}
                  disabled={publishing || !newPostText.trim()}
                >
                  {publishing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>Publicar Tese</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loadingPosts ? (
        <div className="surface-card flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Carregando teses...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="surface-card p-10 text-center text-muted-foreground">
          Nenhuma tese publicada ainda. Seja o primeiro a compartilhar uma análise!
        </div>
      ) : (
        posts.map((post) => {
          const isLiked = likedMap[post.id] || false;
          const currentLikes = likesCountMap[post.id] !== undefined ? likesCountMap[post.id] : post.likes;

          return (
            <article
              key={post.id}
              id={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              className="surface-card cursor-pointer p-4 transition-colors hover:border-white/15 sm:p-5"
            >
              <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.user_id) {
                      void navigate({ to: "/u/$userId", params: { userId: String(post.user_id) } });
                    }
                  }}
                  className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-xs font-bold"
                >
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    post.initials
                  )}
                </button>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (post.user_id) {
                          void navigate({ to: "/u/$userId", params: { userId: String(post.user_id) } });
                        }
                      }}
                      className="min-w-0 truncate text-left text-sm font-semibold hover:underline"
                    >
                      {post.author}
                    </button>
                    {post.user_id != null && post.user_id !== userProfile.id ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void alternarSeguir(post.user_id as number);
                        }}
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          followMap[post.user_id]
                            ? "border border-border text-muted-foreground"
                            : "bg-primary text-white",
                        )}
                      >
                        {followMap[post.user_id] ? "Seguindo" : "Seguir"}
                      </button>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {post.handle} · {post.time}
                    {post.shared_post ? (
                      <span className="inline-flex items-center gap-1 ml-1.5 text-primary">
                        <Repeat2 className="h-3 w-3" /> compartilhou
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
                    {post.tag}
                  </Badge>

                  {(post.user_id != null && userProfile.id != null
                    ? post.user_id === userProfile.id
                    : (post.handle || "").toLowerCase() === (userProfile.handle || "").toLowerCase()) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(post.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                      title="Excluir tese"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  )}
                </div>
              </header>

              {!(post.shared_post && post.content.startsWith("Compartilhou a publicação de")) && (
                <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {post.content}
                </p>
              )}

              {post.shared_post ? <SharedPostEmbed post={post.shared_post} /> : null}

              <footer
                className="mt-4 flex flex-wrap items-center gap-2 text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <WhatsAppReactions
                  storageKey={`tese_${post.id}`}
                  seed={currentLikes > 0 ? { "❤️": currentLikes } : undefined}
                  onChange={(emoji) => {
                    if (emoji === "❤️" && !isLiked) handleLike(post.id);
                    if (emoji === null && isLiked) handleLike(post.id);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-surface-2 hover:text-primary"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments || 0}</span>
                </button>
                <SharePostDialog
                  post={post}
                  defaultTag="Análise"
                  onShared={() => void carregarDados()}
                />
              </footer>
            </article>
          );
        })
      )}
    </div>
  );
}
