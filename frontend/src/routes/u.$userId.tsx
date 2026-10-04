import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostDetailDialog } from "@/components/post-detail-dialog";
import { api, type PostItem, type UserProfile } from "@/lib/api";
import { writeCachedProfile } from "@/lib/profile-cache";
import { compressImageFile, recompressDataUrl, AVATAR_SOFT_LIMIT } from "@/lib/avatar-compress";
import {
  isPresenceId,
  presenceDot,
  presenceLabel,
  presenceOptions,
  type PresenceId,
  writePresence,
} from "@/lib/presence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/$userId")({
  head: () => ({
    meta: [{ title: "Perfil · Liquid Invest" }],
  }),
  component: PerfilPage,
});

type Perfil = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  avatar_url: string | null;
  capa_url?: string | null;
  bio: string | null;
  perfil_investidor: string | null;
  level?: number;
  levelName?: string;
  points?: number;
  badge?: string;
  presenca?: string | null;
  seguidores: number;
  seguindo: number;
  is_following: boolean;
  is_me: boolean;
};

function normalizeHandle(raw: string): string {
  let h = raw.trim().replace(/\s+/g, "");
  if (!h.startsWith("@")) h = `@${h}`;
  return "@" + h.slice(1).toLowerCase().replace(/[^a-z0-9._]/g, "");
}

function PerfilPage() {
  const { userId } = Route.useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [seguindo, setSeguindo] = useState(false);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [capa, setCapa] = useState<string | null>(null);
  const [salvandoCapa, setSalvandoCapa] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [viewer, setViewer] = useState<UserProfile | null>(null);

  const carregar = async () => {
    const res = await api.getPublicProfile(Number(userId));
    setPerfil(res.dados);
    setNome(res.dados.name || "");
    setHandle(res.dados.handle || "");
    setBio(res.dados.bio || "");
    setAvatar(res.dados.avatar_url || null);
    setCapa(res.dados.capa_url || null);
    if (res.dados.is_me && isPresenceId(res.dados.presenca)) writePresence(res.dados.presenca);
  };

  useEffect(() => {
    setLoading(true);
    setEditando(false);
    carregar()
      .catch(() => {
        setPerfil(null);
        toast.error("Não foi possível abrir este perfil.");
      })
      .finally(() => setLoading(false));
    api
      .getPosts()
      .then((lista) => setPosts((lista || []).filter((post) => post.user_id === Number(userId))))
      .catch(() => setPosts([]));
    api
      .getProfile()
      .then((res) => setViewer(res.dados))
      .catch(() => setViewer(null));
  }, [userId]);

  const alternarSeguir = async () => {
    if (!perfil || perfil.is_me || seguindo) return;
    setSeguindo(true);
    const antes = perfil.is_following;
    setPerfil({
      ...perfil,
      is_following: !antes,
      seguidores: Math.max(perfil.seguidores + (antes ? -1 : 1), 0),
    });
    try {
      const res = await api.toggleFollow(perfil.id);
      setPerfil((atual) =>
        atual ? { ...atual, is_following: res.following, seguidores: res.seguidores } : atual,
      );
    } catch {
      setPerfil((atual) =>
        atual ? { ...atual, is_following: antes, seguidores: perfil.seguidores } : atual,
      );
      toast.error("Não foi possível atualizar o seguir.");
    } finally {
      setSeguindo(false);
    }
  };

  const mudarStatus = async (id: PresenceId) => {
    if (!perfil?.is_me) return;
    setPerfil({ ...perfil, presenca: id });
    writePresence(id);
    try {
      await api.updateProfile({ presenca: id });
    } catch {
      toast.error("Não foi possível salvar o status.");
    }
  };

  const escolherCapa = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !perfil?.is_me) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    setSalvandoCapa(true);
    try {
      const dataUrl = await compressImageFile(file, { maxSide: 1400, maxChars: 420_000 });
      setCapa(dataUrl);
      await api.updateProfile({ capa_url: dataUrl });
      setPerfil((atual) => (atual ? { ...atual, capa_url: dataUrl } : atual));
      toast.success("Capa atualizada.");
    } catch {
      toast.error("Não foi possível salvar a capa.");
    } finally {
      setSalvandoCapa(false);
    }
  };

  const escolherFoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    try {
      const dataUrl = await compressImageFile(file);
      setAvatar(dataUrl);
    } catch {
      toast.error("Não foi possível carregar a imagem.");
    }
  };

  const salvar = async () => {
    if (!perfil) return;
    const nomeLimpo = nome.trim();
    const handleLimpo = normalizeHandle(handle);
    if (!nomeLimpo) {
      toast.error("Informe um nome.");
      return;
    }
    if (handleLimpo.length < 3) {
      toast.error("O @ precisa ter pelo menos 2 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      let avatarToSave = avatar;
      if (avatarToSave && avatarToSave.length > AVATAR_SOFT_LIMIT) {
        avatarToSave = await recompressDataUrl(avatarToSave);
        setAvatar(avatarToSave);
      }
      const res = await api.updateProfile({
        name: nomeLimpo,
        handle: handleLimpo,
        bio,
        avatar_url: avatarToSave,
        presenca: isPresenceId(perfil.presenca) ? perfil.presenca : undefined,
      });
      const dados = res.dados;
      writeCachedProfile({ ...dados, avatar_url: dados.avatar_url || avatarToSave });
      await carregar();
      setEditando(false);
      toast.success("Perfil atualizado.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Não foi possível salvar o perfil.";
      toast.error(message);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Carregando perfil...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Perfil não encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary">
          Voltar ao feed
        </Link>
      </div>
    );
  }

  const statusVisivel = perfil.presenca && perfil.presenca !== "invisivel" ? perfil.presenca : perfil.is_me ? perfil.presenca : null;
  const foto = editando ? avatar : perfil.avatar_url;

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Feed
      </Link>

      <section className="surface-card overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-primary/35 via-primary/10 to-transparent sm:h-48">
          {capa ? <img src={capa} alt="" className="h-full w-full object-cover" /> : null}
          {perfil.is_me ? (
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              disabled={salvandoCapa}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/75"
            >
              {salvandoCapa ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              Alterar capa
            </button>
          ) : null}
        </div>
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => void escolherCapa(e)} />
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-12 flex items-end justify-between gap-3">
            <div className="relative h-24 w-24 shrink-0">
              <button
                type="button"
                disabled={!editando}
                onClick={() => editando && fileRef.current?.click()}
                className={cn(
                  "grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-background bg-surface-2 text-lg font-bold",
                  editando && "cursor-pointer ring-2 ring-primary/40",
                )}
                title={editando ? "Alterar foto" : perfil.name}
              >
                {foto ? <img src={foto} alt="" className="h-full w-full object-cover" /> : perfil.initials}
              </button>
              {statusVisivel ? (
                <span className={cn("pointer-events-none absolute bottom-1 right-1 z-10 h-4 w-4 rounded-full border-[3px] border-[#0B0E14]", presenceDot(statusVisivel))} />
              ) : null}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void escolherFoto(e)} />
            {perfil.is_me ? (
              editando ? (
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Alterar foto
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setEditando(true)}>
                  Editar perfil
                </Button>
              )
            ) : (
              <Button type="button" size="sm" onClick={() => void alternarSeguir()} disabled={seguindo}>
                {perfil.is_following ? "Seguindo" : "Seguir"}
              </Button>
            )}
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-semibold leading-tight">{editando ? nome || perfil.name : perfil.name}</h1>
            <p className="text-sm text-muted-foreground">{editando ? normalizeHandle(handle || perfil.handle) : perfil.handle}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium uppercase tracking-wide text-primary">
                {perfil.perfil_investidor || "moderado"}
              </span>
              <span className="text-muted-foreground">
                {" "}
                · Nível {perfil.level ?? 1}
                {perfil.badge ? ` (${perfil.badge})` : ""}
                {perfil.levelName ? ` · ${perfil.levelName}` : ""}
              </span>
            </p>
            {perfil.is_me ? (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {presenceOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => void mudarStatus(option.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-xs transition-colors",
                      perfil.presenca === option.id
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-surface-2",
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", option.dot)} />
                    {option.label}
                  </button>
                ))}
              </div>
            ) : statusVisivel ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", presenceDot(statusVisivel))} />
                {presenceLabel(statusVisivel)}
              </p>
            ) : null}
          </div>

          {editando ? (
            <div className="mt-5 space-y-4 border-t border-border pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="perfil-nome">Nome completo</Label>
                <Input id="perfil-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="perfil-handle">@</Label>
                <Input id="perfil-handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="perfil-bio">Bio</Label>
                <Textarea
                  id="perfil-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre seu estilo de investimento..."
                  className="min-h-24 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditando(false);
                    setNome(perfil.name);
                    setHandle(perfil.handle);
                    setBio(perfil.bio || "");
                    setAvatar(perfil.avatar_url);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={() => void salvar()} disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {perfil.bio || (perfil.is_me ? "Escreva uma bio para as pessoas conhecerem seu jeito de investir." : "Este investidor ainda não escreveu uma bio.")}
              </p>
              <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-sm border border-border text-center">
                <div className="px-2 py-3">
                  <p className="text-lg font-semibold">{perfil.seguidores}</p>
                  <p className="text-xs text-muted-foreground">seguidores</p>
                </div>
                <div className="px-2 py-3">
                  <p className="text-lg font-semibold">{perfil.seguindo}</p>
                  <p className="text-xs text-muted-foreground">seguindo</p>
                </div>
                <div className="px-2 py-3">
                  <p className="text-lg font-semibold">{perfil.points ?? 0}</p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Publicações</h2>
        {posts.length === 0 ? (
          <p className="surface-card px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma publicação ainda.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => {
              const fotoPost = post.proof_url || post.shared_post?.proof_url || null;
              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-square overflow-hidden bg-surface-2"
                  title={post.content}
                >
                  {fotoPost ? (
                    <img src={fotoPost} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center p-2 text-center text-[11px] leading-snug text-foreground/80">
                      <span className="line-clamp-5 whitespace-pre-wrap">{post.content}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <PostDetailDialog
        post={selectedPost}
        viewer={{ id: viewer?.id, avatar_url: viewer?.avatar_url, initials: viewer?.initials }}
        onClose={() => setSelectedPost(null)}
        onCommented={() => {
          api
            .getPosts()
            .then((lista) => setPosts((lista || []).filter((post) => post.user_id === Number(userId))))
            .catch(() => undefined);
        }}
      />
    </div>
  );
}
