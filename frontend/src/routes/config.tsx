import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AtSign, Loader2, Settings, User } from "lucide-react";
import { UploadProofDialog } from "@/components/upload-proof-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type UserProfile } from "@/lib/api";
import { writeCachedProfile } from "@/lib/profile-cache";
import { currentUser as defaultUser } from "@/lib/mock-data";

export const Route = createFileRoute("/config")({
  head: () => ({
    meta: [
      { title: "Configurações · Liquid Invest" },
      {
        name: "description",
        content: "Altere seu nome e @ de usuário.",
      },
    ],
  }),
  component: ConfigPage,
});

function normalizeHandle(raw: string): string {
  let h = raw.trim().replace(/\s+/g, "");
  if (!h.startsWith("@")) h = `@${h}`;
  h = "@" + h.slice(1).toLowerCase().replace(/[^a-z0-9._]/g, "");
  return h;
}

function ConfigPage() {
  const isAutenticado =
    typeof window !== "undefined" && localStorage.getItem("auth_token") !== null;
  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultUser as UserProfile);
  const [nome, setNome] = useState("");
  const [handle, setHandle] = useState("");
  const [idade, setIdade] = useState("");
  const [renda, setRenda] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getProfile();
        if (res?.dados) {
          setProfile(res.dados);
          setNome(res.dados.name || "");
          setHandle(res.dados.handle || "");
          setIdade(res.dados.idade != null ? String(res.dados.idade) : "");
          setRenda(res.dados.renda_mensal != null ? String(res.dados.renda_mensal) : "");
        }
      } catch {
        toast.error("Não foi possível carregar suas configurações.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
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

    setSaving(true);
    try {
      const res = await api.updateProfile({
        name: nomeLimpo,
        handle: handleLimpo,
        idade: parseInt(idade, 10) || profile.idade || 30,
        renda_mensal: parseFloat(renda) || profile.renda_mensal || 0,
      });
      const dados = res?.dados || {
        ...profile,
        name: nomeLimpo,
        handle: handleLimpo,
      };
      setProfile(dados);
      setNome(dados.name);
      setHandle(dados.handle || handleLimpo);
      writeCachedProfile(dados);
      toast.success("Configurações salvas!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center gap-2 p-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl text-foreground">
          <Settings className="h-6 w-6 text-primary" />
          Configurações
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Informações dos seu usuário.
        </p>
      </div>

      <div className="surface-card space-y-5 p-5">
        <div className="flex items-center gap-3 rounded-sm border border-border bg-surface-2/50 p-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-sm bg-primary/15 text-sm font-bold text-primary border border-primary/20">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              profile.initials || "US"
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{nome || profile.name}</p>
            <p className="truncate text-xs text-primary">{normalizeHandle(handle || profile.handle || "@")}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cfg_nome" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Nome
          </Label>
          <Input
            id="cfg_nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            className="bg-surface-2/50 border-border"
            maxLength={80}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cfg_handle" className="flex items-center gap-1.5">
            <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
            Usuário
          </Label>
          <Input
            id="cfg_handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onBlur={() => setHandle(normalizeHandle(handle))}
            placeholder="@seuusuario"
            className="bg-surface-2/50 border-border font-medium"
            maxLength={40}
          />
          <p className="text-[11px] text-muted-foreground">
            Só letras, números, ponto e underline. Será mostrado no feed e no chat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cfg_idade">Idade</Label>
            <Input
              id="cfg_idade"
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              className="bg-surface-2/50 border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cfg_renda">Renda mensal (R$)</Label>
            <Input
              id="cfg_renda"
              type="number"
              value={renda}
              onChange={(e) => setRenda(e.target.value)}
              className="bg-surface-2/50 border-border"
            />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Idade e renda não aparecem no perfil. Só você e a IA usam esses dados.
        </p>

        <Button
          className="w-full font-semibold"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>

      <div className="surface-card space-y-3 p-5">
        <div>
          <p className="text-sm font-semibold">Comprovante de aporte</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Envie o comprovante do mês e ganhe +1 ponto na liga.
          </p>
        </div>
        <UploadProofDialog />
      </div>
    </div>
  );
}
