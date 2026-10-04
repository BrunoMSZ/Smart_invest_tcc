import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  ImageIcon,
  PenLine,
  Loader2,
  Send,
  Trash2,
  Repeat2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UploadProofDialog } from "@/components/upload-proof-dialog";
import { WhatsAppReactions } from "@/components/whatsapp-reactions";
import { SharePostDialog, SharedPostEmbed } from "@/components/share-post-dialog";
import { currentUser as defaultUser } from "@/lib/mock-data";
import { api, type PostItem, type UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { PostDetailDialog } from "@/components/post-detail-dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed · SmartInvest AI" },
      {
        name: "description",
        content:
          "Acompanhe os aportes e discussões dos investidores que você segue no feed.",
      },
      { property: "og:title", content: "Feed · SmartInvest AI" },
      {
        property: "og:description",
        content: "Rede social gamificada para investidores: aportes, ligas e discussões.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const navigate = useNavigate();
  const isAutenticado = typeof window !== "undefined" && localStorage.getItem("auth_token") !== null;

  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [postTag, setPostTag] = useState<"Texto" | "Aporte" | "Dúvida" | "Liga">("Texto");
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
        const feedPosts = postsData.filter((p) => (p.tag || "").toLowerCase() !== "análise");
        setPosts(feedPosts);
        setFollowMap((prev) => {
          const next = { ...prev };
          feedPosts.forEach((p) => {
            if (p.user_id != null && next[p.user_id] === undefined) next[p.user_id] = Boolean(p.is_following);
          });
          return next;
        });
        const pendingPost = sessionStorage.getItem("smartinvest_open_post");
        if (pendingPost) {
          sessionStorage.removeItem("smartinvest_open_post");
          const found = feedPosts.find((p) => String(p.id) === pendingPost);
          if (found) setSelectedPost(found);
        }
        const countMap: Record<string, number> = {};
        feedPosts.forEach((p) => {
          countMap[p.id] = p.likes;
        });
        setLikesCountMap(countMap);
      }
    } catch (err) {
      console.log("Usando posts fallback:", err);
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
    const openPending = () => {
      const pendingPost = sessionStorage.getItem("smartinvest_open_post");
      if (!pendingPost) return;
      sessionStorage.removeItem("smartinvest_open_post");
      setPosts((current) => {
        const found = current.find((p) => String(p.id) === pendingPost);
        if (found) setSelectedPost(found);
        return current;
      });
    };
    window.addEventListener("smartinvest:open-post", openPending);
    return () => window.removeEventListener("smartinvest:open-post", openPending);
  }, []);

  const handlePublishPost = async () => {
    const text = newPostText.trim();
    if (!text || publishing) return;

    setPublishing(true);
    try {
      await api.createPost({
        conteudo: text,
        tag: postTag,
        comprovante: false,
      });

      toast.success("Publicado no feed!");
      setNewPostText("");
      setPostTag("Texto");

      const updatedPosts = await api.getPosts();
      const feedPosts = Array.isArray(updatedPosts)
        ? updatedPosts.filter((p) => (p.tag || "").toLowerCase() !== "análise")
        : [];
      setPosts(feedPosts);
    } catch (err: any) {
      toast.error(err.message || "Erro ao publicar");
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
      toast.success("Publicação excluída com sucesso!");
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir publicação.");
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
        reactionKey={selectedPost ? `post_${selectedPost.id}` : undefined}
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
        title="Excluir publicação?"
        description="Essa ação não pode ser desfeita. O post some do feed para todo mundo."
        confirming={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeletePost()}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl text-foreground">Feed</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Aportes, comprovantes e discussões da comunidade.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs font-semibold">
          {posts.length} publicações
        </Badge>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#161C2B] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary/15 text-primary">
            <PenLine className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-semibold text-foreground">Nova publicação</p>
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
              placeholder={`O que você está pensando, ${userProfile.name?.split(" ")[0] || "investidor"}? Escreva aqui...`}
              className="min-h-28 resize-none rounded-sm border border-white/15 bg-[#0B0E14] px-3 py-2.5 text-sm sm:text-base shadow-inner placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/40"
              maxLength={2000}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(["Texto", "Aporte", "Dúvida", "Liga"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPostTag(t === "Texto" || postTag !== t ? t : "Texto")}
                    className={cn(
                      "rounded-sm px-2.5 py-1 text-[11px] font-semibold border transition-colors",
                      postTag === t
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:bg-surface-2",
                    )}
                  >
                    {t}
                  </button>
                ))}
                <UploadProofDialog
                  onSuccess={() => {
                    void carregarDados();
                  }}
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      Foto / comprovante
                    </button>
                  }
                />
              </div>
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
                  <span>Publicar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <article
              key={post.id}
              id={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              className="surface-card cursor-pointer overflow-hidden p-4 transition-colors hover:border-white/15 sm:p-5"
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
                      title="Excluir publicação"
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

              {post.proof && post.proof_url ? (
                <div className="-mx-4 mt-3 w-[calc(100%+2rem)] sm:-mx-5 sm:w-[calc(100%+2.5rem)]">
                  <img
                    src={post.proof_url}
                    alt=""
                    className="block h-auto w-full"
                  />
                </div>
              ) : null}

              <footer
                className="mt-4 flex flex-wrap items-center gap-2 text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <WhatsAppReactions
                  storageKey={`post_${post.id}`}
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
                  defaultTag={postTag}
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
