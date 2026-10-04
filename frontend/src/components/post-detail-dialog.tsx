import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Heart, Loader2, MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type PostItem } from "@/lib/api";
import { SharedPostEmbed, SharePostDialog } from "@/components/share-post-dialog";
import { WhatsAppReactions } from "@/components/whatsapp-reactions";

type CommentItem = {
  id: number;
  user_id?: number | null;
  autor_nome: string;
  autor_initials: string;
  autor_avatar?: string | null;
  conteudo: string;
  parent_id?: number | null;
  time?: string;
  likes?: number;
  liked?: boolean;
};

type PostDetailDialogProps = {
  post: PostItem | null;
  viewer?: { id?: number | null; avatar_url?: string | null; initials?: string | null };
  onClose: () => void;
  onCommented?: () => void;
  likes?: number;
  liked?: boolean;
  reactionKey?: string;
  onLike?: (emoji: string | null) => void;
};

function Avatar({
  src,
  initials,
  className,
}: {
  src?: string | null;
  initials?: string | null;
  className?: string;
}) {
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-[10px] font-bold ${className || ""}`}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials || "U"}
    </span>
  );
}

export function PostDetailDialog({
  post,
  viewer,
  onClose,
  onCommented,
  likes,
  liked = false,
  reactionKey,
  onLike,
}: PostDetailDialogProps) {
  const [comentarios, setComentarios] = useState<CommentItem[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!post) return;
    setNovoComentario("");
    setReplyTo(null);
    setOpenReplies({});
    setEditingId(null);
    setConfirmDeleteId(null);
    setCommentsOpen(false);
    setLoading(true);
    api
      .getComments(post.id)
      .then((res) => setComentarios(res || []))
      .catch(() => setComentarios([]))
      .finally(() => setLoading(false));
  }, [post?.id]);

  const handleEnviar = async () => {
    if (!post || !novoComentario.trim() || sending) return;
    setSending(true);
    try {
      const threadId = replyTo ? replyTo.parent_id || replyTo.id : null;
      await api.addComment(post.id, novoComentario.trim(), replyTo?.id);
      setNovoComentario("");
      setReplyTo(null);
      if (threadId) setOpenReplies((prev) => ({ ...prev, [threadId]: true }));
      const res = await api.getComments(post.id);
      setComentarios(res || []);
      setCommentsOpen(true);
      onCommented?.();
    } catch {
      toast.error("Erro ao salvar comentário.");
    } finally {
      setSending(false);
    }
  };

  const openProfile = (userId?: number | null) => {
    if (!userId) return;
    onClose();
    void navigate({ to: "/u/$userId", params: { userId: String(userId) } });
  };

  const salvarEdicao = async (c: CommentItem) => {
    if (!post || !editDraft.trim()) return;
    try {
      const res = await api.updateComment(post.id, c.id, editDraft.trim());
      setComentarios((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, conteudo: res.conteudo } : item)),
      );
      setEditingId(null);
    } catch {
      toast.error("Não foi possível editar o comentário.");
    }
  };

  const excluirComentario = async (c: CommentItem) => {
    if (!post) return;
    try {
      await api.deleteComment(post.id, c.id);
      setComentarios((prev) => prev.filter((item) => item.id !== c.id && item.parent_id !== c.id));
      setConfirmDeleteId(null);
      onCommented?.();
    } catch {
      toast.error("Não foi possível excluir o comentário.");
    }
  };

  const roots = comentarios.filter((c) => !c.parent_id);
  const repliesOf = (id: number) => comentarios.filter((c) => c.parent_id === id);

  const curtirComentario = async (c: CommentItem) => {
    if (!post) return;
    const liked = Boolean(c.liked);
    const likesNow = c.likes || 0;
    setComentarios((prev) =>
      prev.map((item) =>
        item.id === c.id
          ? { ...item, liked: !liked, likes: Math.max(likesNow + (liked ? -1 : 1), 0) }
          : item,
      ),
    );
    try {
      const res = await api.toggleCommentLike(post.id, c.id);
      setComentarios((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, liked: res.liked, likes: res.likes } : item,
        ),
      );
    } catch {
      setComentarios((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, liked, likes: likesNow } : item)),
      );
      toast.error("Não foi possível curtir o comentário.");
    }
  };

  const renderComment = (c: CommentItem, nested = false, plain = false) => {
    const replies = repliesOf(c.id);
    const aberto = Boolean(openReplies[c.id]);
    const meu = Boolean(viewer?.id && c.user_id && viewer.id === c.user_id);
    const editando = editingId === c.id;
    if (plain) {
      return (
        <li key={c.id} className={nested ? "mt-3" : undefined}>
          <div className="flex items-start gap-3">
            <button type="button" onClick={() => openProfile(c.user_id)} className="shrink-0">
              <Avatar src={c.autor_avatar} initials={c.autor_initials} className="h-8 w-8 text-[10px]" />
            </button>
            <div className="min-w-0 flex-1">
              {editando ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-sm border border-white/10 bg-background px-2 py-1.5 text-sm outline-none"
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => void salvarEdicao(c)} className="text-xs font-semibold text-primary">
                      Salvar
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-xs font-semibold text-muted-foreground">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-snug">
                  <button type="button" onClick={() => openProfile(c.user_id)} className="mr-1.5 font-semibold">
                    {(c.autor_nome || "Investidor").split(" ")[0]}
                  </button>
                  <span className="whitespace-pre-wrap">{c.conteudo}</span>
                </p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                <span className="font-normal">{c.time || "agora"}</span>
                <button type="button" onClick={() => setReplyTo(c)} className="hover:text-foreground">
                  Responder
                </button>
                {meu && !editando ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditDraft(c.conteudo);
                        setConfirmDeleteId(null);
                      }}
                      className="hover:text-foreground"
                    >
                      Editar
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(c.id)} className="hover:text-red-400">
                      Excluir
                    </button>
                  </>
                ) : null}
              </div>
              {confirmDeleteId === c.id ? (
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-muted-foreground">Excluir este comentário?</span>
                  <button type="button" onClick={() => void excluirComentario(c)} className="font-semibold text-red-400">
                    Sim
                  </button>
                  <button type="button" onClick={() => setConfirmDeleteId(null)} className="font-semibold text-muted-foreground">
                    Não
                  </button>
                </div>
              ) : null}
              {replies.length > 0 && !aberto ? (
                <button
                  type="button"
                  onClick={() => setOpenReplies((prev) => ({ ...prev, [c.id]: true }))}
                  className="mt-2 text-xs font-semibold text-muted-foreground"
                >
                  Ver respostas ({replies.length})
                </button>
              ) : null}
              {replies.length > 0 && aberto ? (
                <>
                  <ul className="mt-1">{replies.map((reply) => renderComment(reply, true, true))}</ul>
                  <button
                    type="button"
                    onClick={() => setOpenReplies((prev) => ({ ...prev, [c.id]: false }))}
                    className="mt-2 text-xs font-semibold text-muted-foreground"
                  >
                    Ocultar respostas
                  </button>
                </>
              ) : null}
            </div>
            <button
              type="button"
              title={c.liked ? "Remover curtida" : "Curtir comentário"}
              aria-label="Curtir comentário"
              onClick={() => void curtirComentario(c)}
              className="mt-1 flex shrink-0 flex-col items-center gap-0.5"
            >
              <Heart className={`h-3 w-3 ${c.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              {(c.likes || 0) > 0 ? (
                <span className={`text-[10px] tabular-nums ${c.liked ? "text-red-500" : "text-muted-foreground"}`}>
                  {c.likes}
                </span>
              ) : null}
            </button>
          </div>
        </li>
      );
    }
    return (
      <li key={c.id} className={nested ? "mt-2 ml-5" : undefined}>
        <div className="flex items-start gap-2.5">
          <button type="button" onClick={() => openProfile(c.user_id)} className="mt-1 shrink-0">
            <Avatar src={c.autor_avatar} initials={c.autor_initials} className="h-8 w-8 text-[10px]" />
          </button>
        <div
          className={
            nested
              ? "min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-[#121826] px-3 py-2.5"
              : "min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-surface-2 px-3 py-2.5 shadow-sm"
          }
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <button
                  type="button"
                  onClick={() => openProfile(c.user_id)}
                  className="text-sm font-semibold hover:underline"
                >
                  {c.autor_nome || "Investidor"}
                </button>
                <span className="text-[11px] text-muted-foreground">{c.time || "agora"}</span>
              </div>
              {editando ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-sm border border-white/10 bg-background px-2 py-1.5 text-sm outline-none"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => void salvarEdicao(c)} className="text-[11px] font-semibold text-primary">
                      Salvar
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-[11px] font-semibold text-muted-foreground">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {c.conteudo}
                </p>
              )}
            </div>
            <button
              type="button"
              title={c.liked ? "Remover curtida" : "Curtir comentário"}
              aria-label="Curtir comentário"
              onClick={() => void curtirComentario(c)}
              className="flex shrink-0 flex-col items-center gap-0.5 rounded-full px-1 py-0.5 hover:bg-white/5"
            >
              <Heart
                className={`h-3.5 w-3.5 ${c.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
              />
              <span className={`text-[10px] tabular-nums leading-none ${c.liked ? "text-red-500" : "text-muted-foreground"}`}>
                {c.likes || 0}
              </span>
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setReplyTo(c)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
            >
              responder
            </button>
            {meu && !editando ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(c.id);
                    setEditDraft(c.conteudo);
                    setConfirmDeleteId(null);
                  }}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  editar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(c.id)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-red-400"
                >
                  excluir
                </button>
              </>
            ) : null}
          </div>
          {confirmDeleteId === c.id ? (
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="text-muted-foreground">Excluir este comentário?</span>
              <button type="button" onClick={() => void excluirComentario(c)} className="font-semibold text-red-400">
                Sim
              </button>
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="font-semibold text-muted-foreground">
                Não
              </button>
            </div>
          ) : null}
        </div>
        </div>
        {replies.length > 0 && !aberto ? (
          <button
            type="button"
            onClick={() => setOpenReplies((prev) => ({ ...prev, [c.id]: true }))}
            className="ml-5 mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            ver mais {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
          </button>
        ) : null}
        {replies.length > 0 && aberto ? (
          <>
            <ul className="mt-1 border-l border-white/10 pl-2">
              {replies.map((reply) => renderComment(reply, true))}
            </ul>
            <button
              type="button"
              onClick={() => setOpenReplies((prev) => ({ ...prev, [c.id]: false }))}
              className="ml-5 mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              ocultar respostas
            </button>
          </>
        ) : null}
      </li>
    );
  };

  const hasImage = Boolean(post?.proof && post.proof_url);
  const showCaption = Boolean(
    post && !(post.shared_post && post.content.startsWith("Compartilhou a publicação de")),
  );

  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-black p-0 text-foreground max-md:inset-0 max-md:left-0 max-md:top-0 max-md:h-[100dvh] max-md:max-h-[100dvh] max-md:w-screen max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none [&>button]:hidden md:left-[50%] md:top-[50%] md:grid md:h-[min(88vh,760px)] md:max-h-[88vh] md:w-[min(96vw,1040px)] md:max-w-none md:translate-x-[-50%] md:translate-y-[-50%] md:grid-cols-[minmax(0,1fr)_360px] md:rounded-sm md:border md:border-border md:[&>button]:block">
        <DialogHeader className="sr-only">
          <DialogTitle>Publicação</DialogTitle>
        </DialogHeader>

        {post && (
          <>
            <div className="flex h-full min-h-0 flex-col bg-black md:hidden">
              <header className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-black px-1 pt-[env(safe-area-inset-top)]">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Voltar"
                  className="grid h-10 w-10 place-items-center"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={() => openProfile(post.user_id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <Avatar src={post.author_avatar} initials={post.initials} className="h-8 w-8 text-[10px]" />
                  <span className="truncate text-sm font-semibold">{post.author}</span>
                </button>
              </header>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
                {hasImage ? (
                  <div className="flex min-h-[46vh] flex-1 items-center justify-center bg-black">
                    <img src={post.proof_url || ""} alt="" className="block max-h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex min-h-[46vh] flex-1 items-center justify-center px-6">
                    <div className="w-full">
                      <p className="whitespace-pre-wrap text-center text-[15px] leading-snug">
                        {showCaption ? post.content : "Publicação compartilhada"}
                      </p>
                      {post.shared_post ? (
                        <div className="mt-3 text-left">
                          <SharedPostEmbed post={post.shared_post} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 px-2 py-1.5">
                  <button
                    type="button"
                    aria-label={liked ? "Remover curtida" : "Curtir"}
                    onClick={() => onLike?.(liked ? null : "❤️")}
                    className="grid h-10 w-10 place-items-center"
                  >
                    <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button
                    type="button"
                    aria-label="Comentar"
                    onClick={() => {
                      setCommentsOpen(true);
                      commentRef.current?.focus();
                    }}
                    className="grid h-10 w-10 place-items-center"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <SharePostDialog post={post} iconOnly />
                </div>

                <div className="space-y-2 px-4 pb-4">
                  {(likes || post.likes) > 0 ? (
                    <p className="text-sm font-semibold">
                      {likes || post.likes} {(likes || post.likes) === 1 ? "curtida" : "curtidas"}
                    </p>
                  ) : null}
                  {hasImage && showCaption ? (
                    <p className="whitespace-pre-wrap text-sm leading-snug">
                      <button type="button" onClick={() => openProfile(post.user_id)} className="mr-1.5 font-semibold">
                        {post.author}
                      </button>
                      {post.content}
                    </p>
                  ) : null}
                  {hasImage && post.shared_post ? <SharedPostEmbed post={post.shared_post} /> : null}
                  <p className="text-[11px] text-muted-foreground">{post.time}</p>
                </div>

                {loading ? null : comentarios.length > 0 && !commentsOpen ? (
                  <button
                    type="button"
                    onClick={() => setCommentsOpen(true)}
                    className="px-4 pb-4 text-left text-sm text-muted-foreground"
                  >
                    Ver {comentarios.length === 1 ? "o comentário" : `todos os ${comentarios.length} comentários`}
                  </button>
                ) : commentsOpen ? (
                  <div className="border-t border-white/10 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setCommentsOpen(false)}
                      className="mb-3 text-xs font-semibold text-muted-foreground"
                    >
                      Ocultar comentários
                    </button>
                    {roots.length === 0 ? (
                      <p className="py-2 text-sm text-muted-foreground">Nenhum comentário ainda.</p>
                    ) : (
                      <ul className="space-y-3">{roots.map((c) => renderComment(c, false, true))}</ul>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 border-t border-white/10 bg-black px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                {replyTo ? (
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Respondendo a <strong className="text-foreground">{replyTo.autor_nome}</strong>
                    </span>
                    <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancelar resposta">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Avatar src={viewer?.avatar_url} initials={viewer?.initials} className="h-8 w-8" />
                  <input
                    ref={commentRef}
                    placeholder={replyTo ? `Responder a ${replyTo.autor_nome}...` : "Adicionar comentário..."}
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void handleEnviar()}
                    disabled={sending}
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {novoComentario.trim() || sending ? (
                    <button
                      type="button"
                      onClick={() => void handleEnviar()}
                      disabled={sending}
                      className="shrink-0 text-sm font-semibold text-primary"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publicar"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="hidden h-full min-h-0 items-center justify-center bg-black md:flex">
              {hasImage ? (
                <img
                  src={post.proof_url || ""}
                  alt="Publicação"
                  className="block h-auto max-h-full w-full object-contain"
                />
              ) : (
                <div className="max-w-lg px-8 py-10 text-center">
                  <button type="button" onClick={() => openProfile(post.user_id)} className="mx-auto mb-4 block">
                    <Avatar src={post.author_avatar} initials={post.initials} className="h-16 w-16 text-sm" />
                  </button>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/90">
                    {showCaption ? post.content : "Publicação compartilhada"}
                  </p>
                  {post.shared_post ? (
                    <div className="mt-4 text-left">
                      <SharedPostEmbed post={post.shared_post} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <aside className="hidden min-h-0 flex-col border-t border-white/10 bg-surface md:flex md:border-l md:border-t-0">
              <div className="border-b border-border px-4 py-4 pr-12">
                <button type="button" onClick={() => openProfile(post.user_id)} className="flex w-full items-start gap-3 text-left">
                  <Avatar src={post.author_avatar} initials={post.initials} className="h-12 w-12 text-xs" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">{post.author}</p>
                    <p className="truncate text-xs text-muted-foreground">{post.handle}</p>
                    <p className="text-xs text-muted-foreground">{post.time}{post.tag ? ` · ${post.tag}` : ""}</p>
                  </div>
                </button>
                {showCaption ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/95">
                    {post.content}
                  </p>
                ) : null}
                {post.shared_post ? <SharedPostEmbed post={post.shared_post} /> : null}
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Carregando...
                  </div>
                ) : comentarios.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum comentário ainda.
                  </p>
                ) : (
                  <ul className="space-y-3">{roots.map((c) => renderComment(c))}</ul>
                )}
              </div>

              <div className="border-t border-border px-4 py-3">
                <WhatsAppReactions
                  storageKey={reactionKey || `post_${post.id}`}
                  seed={(likes || post.likes) > 0 ? { "❤️": likes || post.likes } : undefined}
                  onChange={(emoji) => onLike?.(emoji)}
                />
                {replyTo ? (
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Respondendo a <strong className="text-foreground">{replyTo.autor_nome}</strong>
                    </span>
                    <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancelar resposta">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
                <div className="mt-3 flex items-center gap-2">
                  <Avatar src={viewer?.avatar_url} initials={viewer?.initials} className="h-9 w-9" />
                  <div className="flex min-w-0 flex-1 items-center rounded-full border border-white/15 bg-[#0B0E14] pl-4 pr-1">
                    <Input
                      placeholder={replyTo ? `Responder a ${replyTo.autor_nome}...` : "Adicionar comentário..."}
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void handleEnviar()}
                      className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      disabled={sending}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-primary"
                      onClick={() => void handleEnviar()}
                      disabled={!novoComentario.trim() || sending}
                      aria-label="Publicar comentário"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
