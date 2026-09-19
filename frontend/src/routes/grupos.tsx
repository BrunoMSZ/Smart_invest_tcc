import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Link2,
  Lock,
  Plus,
  UserPlus,
  Users,
  Loader2,
  LogIn,
  CheckCircle2,
  MessageSquare,
  KeyRound,
  Target,
  Send,
  CheckCheck,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { groups as defaultGroups, ranking as defaultRanking } from "@/lib/mock-data";
import { api, type GroupItem, type GroupMessageItem, type UserRankingItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos e Convites · Aporta" },
      {
        name: "description",
        content:
          "Crie ligas privadas de investimento, acompanhe os aportes do grupo e convide amigos por link.",
      },
      { property: "og:title", content: "Grupos e Convites · Aporta" },
      {
        property: "og:description",
        content: "Ligas privadas, ranking de amigos e convite por link compartilhável.",
      },
    ],
  }),
  component: GroupsPage,
});

function GroupsPage() {
  const [groupList, setGroupList] = useState<GroupItem[]>(defaultGroups as any);
  const [userRanking, setUserRanking] = useState<UserRankingItem[]>(defaultRanking as any);
  const [loading, setLoading] = useState(false);

  // Modais de Criação e Ingresso
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  // Formulário de Criação
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovoDescricao] = useState("");
  const [novaMeta, setNovaMeta] = useState("500,00");
  const [isPrivado, setIsPrivado] = useState(true);
  const [creating, setCreating] = useState(false);

  // Formulário de Ingresso por Código
  const [codigoConviteInput, setCodigoConviteInput] = useState("");
  const [joining, setJoining] = useState(false);

  // Aporte individual na liga
  const [recordingAporteId, setRecordingAporteId] = useState<string | null>(null);

  // Cópia de links e seleção de grupo para convite
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);

  // ==========================================
  // ESTADOS DO CHAT ESTILO WHATSAPP DA LIGA
  // ==========================================
  const [selectedChatGroup, setSelectedChatGroup] = useState<GroupItem | null>(null);
  const [chatMessages, setChatMessages] = useState<GroupMessageItem[]>([]);
  const [loadingChatMessages, setLoadingChatMessages] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = (smooth = true) => {
    setTimeout(() => {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }, 60);
  };

  const carregarGrupos = () => {
    setLoading(true);
    api.getGroups()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGroupList(data);
        }
      })
      .catch((err) => {
        console.warn("[Grupos] Fallback para dados locais:", err);
      })
      .finally(() => setLoading(false));

    api.getUserRanking()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUserRanking(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    carregarGrupos();

    // Se o usuário acessou via link com ?convite=XYZ, abre o modal de ingresso automaticamente
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const conviteParam = params.get("convite");
      if (conviteParam) {
        setCodigoConviteInput(conviteParam);
        setOpenJoinModal(true);
      }
      const chatParam = params.get("chat");
      if (chatParam) {
        const found = groupList.find((g) => g.id === chatParam || g.id === `g${chatParam}`);
        if (found) {
          abrirChatWhatsapp(found);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (selectedChatGroup) {
      scrollChatToBottom(true);
    }
  }, [chatMessages, selectedChatGroup]);

  // Grupo selecionado para o card de convite
  const activeGroup = groupList[selectedGroupIdx] || groupList[0];
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const generalInviteLink = activeGroup
    ? `${origin}/grupos?convite=${activeGroup.inviteCode || activeGroup.id}`
    : `${origin}/grupos?convite=liga-renda-passiva-8FQ2`;

  const copyGeneralInvite = async () => {
    try {
      await navigator.clipboard.writeText(generalInviteLink);
      setCopiedGeneral(true);
      toast.success("Link exclusivo da liga copiado para a área de transferência!");
      setTimeout(() => setCopiedGeneral(false), 2200);
    } catch {
      toast.info(`Link de convite: ${generalInviteLink}`);
    }
  };

  const copyGroupCode = async (code?: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Código de convite "${code}" copiado!`);
    } catch {
      toast.info(`Código da liga: ${code}`);
    }
  };

  const handleCriarGrupo = async () => {
    if (!novoNome.trim()) {
      toast.error("Informe o nome do grupo");
      return;
    }

    setCreating(true);
    try {
      const metaNum = parseFloat(novaMeta.replace(/\./g, "").replace(",", ".")) || 500.0;
      await api.createGroup({
        nome: novoNome.trim(),
        descricao: novaDescricao.trim() || undefined,
        meta_mensal: metaNum,
        privado: isPrivado,
      });

      toast.success("Liga criada e registrada no banco de dados com sucesso!");
      setOpenCreateModal(false);
      setNovoNome("");
      setNovoDescricao("");
      carregarGrupos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar grupo");
    } finally {
      setCreating(false);
    }
  };

  const handleEntrarGrupo = async () => {
    if (!codigoConviteInput.trim()) {
      toast.error("Informe o código de convite ou link da liga");
      return;
    }

    setJoining(true);
    try {
      const res = await api.joinGroup(codigoConviteInput.trim());
      toast.success(res.message || "Você ingressou na liga!");
      setOpenJoinModal(false);
      setCodigoConviteInput("");
      carregarGrupos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao ingressar na liga");
    } finally {
      setJoining(false);
    }
  };

  const handleRegistrarAporte = async (grupoId: string) => {
    setRecordingAporteId(grupoId);
    try {
      const res = await api.recordGroupAporte(grupoId);
      toast.success(res.message || "Aporte mensal registrado com sucesso!");
      carregarGrupos();
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar aporte");
    } finally {
      setRecordingAporteId(null);
    }
  };

  // Abrir o WhatsApp Chat da Liga
  const abrirChatWhatsapp = async (grupo: GroupItem) => {
    setSelectedChatGroup(grupo);
    setLoadingChatMessages(true);
    try {
      const msgs = await api.getGroupMessages(grupo.id);
      setChatMessages(msgs || []);
      scrollChatToBottom(false);
    } catch (err) {
      console.warn("[Grupos] Erro ao carregar mensagens:", err);
      // Fallback para mensagens realistas da liga
      setChatMessages([
        { id: 1, from: "Marina Costa", initials: "MC", mine: false, text: `Fala investidores da ${grupo.name}! 🚀`, time: "09:30" },
        { id: 2, from: "Caio Menezes", initials: "CM", mine: false, text: "Bora manter o foco no aporte deste mês!", time: "09:34" },
        { id: 3, from: "Rafael Duarte", initials: "RD", mine: true, text: "Meu aporte já está alocado e registrado! 📈", time: "09:40" },
      ]);
      scrollChatToBottom(false);
    } finally {
      setLoadingChatMessages(false);
    }
  };

  const handleSendGroupMessage = async (textToSend?: string) => {
    const texto = (textToSend !== undefined ? textToSend : chatDraft).trim();
    if (!texto || !selectedChatGroup || sendingMsg) return;

    const agora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tempMsg: GroupMessageItem = {
      id: Date.now(),
      from: "Rafael Duarte",
      initials: "RD",
      mine: true,
      text: texto,
      time: agora,
    };

    // Atualização otimista na tela
    setChatMessages((prev) => [...prev, tempMsg]);
    setChatDraft("");
    scrollChatToBottom(true);

    setSendingMsg(true);
    try {
      const res = await api.sendGroupMessage(selectedChatGroup.id, texto);
      if (res?.mensagem) {
        setChatMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? res.mensagem : m))
        );
      }
    } catch (err: any) {
      console.error("[Grupos] Falha ao enviar mensagem:", err);
      toast.error("Não foi possível enviar a mensagem.");
    } finally {
      setSendingMsg(false);
      scrollChatToBottom(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Liquid Header */}
      <div className="surface-card p-6 border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
              <Users className="h-3.5 w-3.5" />
              <span>Clubes de Investimento & Ligas Privadas B3</span>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl tracking-tight text-foreground">
              Grupos de Investimento & Ligas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe a disciplina coletiva de aportes, dispute posições no ranking e converse no grupo do WhatsApp da sua liga.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Botão Entrar com Código de Convite */}
            <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 font-bold border-border bg-surface-2 hover:bg-surface-2/80 text-foreground">
                  <LogIn className="h-4 w-4 text-primary" />
                  Entrar com Código
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" />
                    Ingressar em uma Liga
                  </DialogTitle>
                  <DialogDescription>
                    Cole o código de convite ou link recebido do criador da liga privada.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="joinCode" className="text-xs font-semibold text-muted-foreground uppercase">
                      Código ou Link de Convite
                    </Label>
                    <Input
                      id="joinCode"
                      value={codigoConviteInput}
                      onChange={(e) => setCodigoConviteInput(e.target.value)}
                      placeholder="Ex: liga-renda-passiva-8FQ2"
                      className="bg-surface-2 border-border text-foreground font-mono text-sm"
                    />
                  </div>
                  <Button
                    className="w-full font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                    onClick={handleEntrarGrupo}
                    disabled={joining}
                  >
                    {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                    {joining ? "Ingressando..." : "Confirmar e Entrar na Liga"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Botão Criar Novo Clube / Liga */}
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button className="gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Criar Clube / Liga
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Novo Grupo de Investimento</DialogTitle>
                  <DialogDescription>
                    Defina o nome, a tese e a meta mensal de aporte da liga para acompanhar em conjunto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="nome" className="text-xs font-semibold text-muted-foreground uppercase">
                      Nome do grupo
                    </Label>
                    <Input
                      id="nome"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      placeholder="Ex: Liga Dividendos B3 2026"
                      className="bg-surface-2 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="descricao" className="text-xs font-semibold text-muted-foreground uppercase">
                      Descrição / Tese da Liga (Opcional)
                    </Label>
                    <Input
                      id="descricao"
                      value={novaDescricao}
                      onChange={(e) => setNovoDescricao(e.target.value)}
                      placeholder="Ex: Foco em FIIs de tijolo e ações de valor"
                      className="bg-surface-2 border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meta" className="text-xs font-semibold text-muted-foreground uppercase">
                      Meta mensal por membro (R$)
                    </Label>
                    <Input
                      id="meta"
                      value={novaMeta}
                      onChange={(e) => setNovaMeta(e.target.value)}
                      placeholder="R$ 500,00"
                      inputMode="decimal"
                      className="bg-surface-2 border-border text-foreground"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 p-3.5">
                    <div className="min-w-0 pr-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Lock className="h-3.5 w-3.5 text-primary" /> Grupo Privado
                      </p>
                      <p className="text-xs text-muted-foreground">Entrada restrita por código de convite</p>
                    </div>
                    <Switch checked={isPrivado} onCheckedChange={setIsPrivado} />
                  </div>
                  <Button
                    className="w-full font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                    onClick={handleCriarGrupo}
                    disabled={creating}
                  >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {creating ? "Criando liga..." : "Confirmar e Criar Liga"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Convite Card com Seleção de Liga */}
      <div className="surface-card liquid-glow p-6 border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <UserPlus className="h-4 w-4" />
            </div>
            <span>Convidar Parceiros de Investimento</span>
          </div>
          {groupList.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Liga selecionada:</span>
              <select
                aria-label="Selecionar liga para convite"
                value={selectedGroupIdx}
                onChange={(e) => setSelectedGroupIdx(Number(e.target.value))}
                className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs font-semibold text-foreground"
              >
                {groupList.map((g, idx) => (
                  <option key={g.id} value={idx}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Compartilhe o link exclusivo da liga <strong className="text-foreground">{activeGroup?.name || "Renda Passiva"}</strong>. Membros que ingressarem acumulam pontuação de disciplina no ranking de amigos.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative min-w-0">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              readOnly
              value={generalInviteLink}
              className="truncate pl-10 font-mono text-xs bg-surface-2 border-border text-foreground"
            />
          </div>
          <Button
            className="shrink-0 gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-sm"
            onClick={copyGeneralInvite}
          >
            <Copy className="h-4 w-4" />
            {copiedGeneral ? "Link Copiado!" : "Copiar Link"}
          </Button>
        </div>
      </div>

      {/* Grid de Grupos */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Suas Ligas Ativas ({groupList.length})
          </h2>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin text-primary" /> Atualizando...
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {groupList.map((g) => {
            const pct = Math.min(Math.round(((g.aportes || 0) / (g.members || 1)) * 100), 100);
            const isRecordingThis = recordingAporteId === g.id;

            return (
              <div
                key={g.id}
                className="surface-card p-5 border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-bold text-foreground">{g.name}</p>
                        {g.inviteCode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-border text-muted-foreground">
                            {g.inviteCode}
                          </span>
                        )}
                      </div>
                      {g.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">{g.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span>{g.members} investidores</span>
                        </span>
                        {g.meta && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Meta: R$ {Number(g.meta).toFixed(0)}/mês</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-black text-primary">
                      #{g.you || 1}
                    </span>
                  </div>

                  {/* Barra de Progresso Coletiva */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>Aportes registrados no mês</span>
                      <span className="font-bold text-foreground">
                        {g.aportes || 0}/{g.members} ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} className="mt-2 h-2 bg-surface-2" />
                  </div>
                </div>

                {/* Botões de Ação da Liga */}
                <div className="mt-5 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRegistrarAporte(g.id)}
                      disabled={isRecordingThis}
                      className="h-8 text-xs font-bold border-border bg-surface-2 hover:border-emerald-500/40 hover:text-emerald-400"
                      title="Registrar meu aporte deste mês nesta liga (+5 pontos)"
                    >
                      {isRecordingThis ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                      )}
                      Registrar Aporte
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyGroupCode(g.inviteCode)}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2"
                      title="Copiar código desta liga"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Código
                    </Button>
                  </div>

                  {/* Botão de Chat estilo WhatsApp do Grupo */}
                  <Button
                    size="sm"
                    onClick={() => abrirChatWhatsapp(g)}
                    className="h-8 gap-1.5 text-xs font-bold bg-[#00A884] hover:bg-[#00A884]/90 text-white shadow-sm shadow-emerald-900/30"
                    title={`Abrir grupo WhatsApp da ${g.name}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Chat da Liga
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liga dos Amigos */}
      <div className="surface-card p-6 border-border/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-foreground">Classificação Geral de Amigos</p>
            <p className="text-xs text-muted-foreground">Pontuação baseada na consistência e nos aportes realizados</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            Ciclo Mensal
          </span>
        </div>
        <div className="space-y-3.5">
          {userRanking.map((r) => (
            <div
              key={r.pos}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 p-2 rounded-lg hover:bg-surface-2/40 transition-colors"
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold",
                  r.pos <= 3
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-surface-2 text-muted-foreground"
                )}
              >
                {r.pos}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                  {r.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-2 text-muted-foreground border border-border">
                      {r.badge}
                    </span>
                  )}
                </div>
                <Progress value={Math.min((r.points / 60) * 100, 100)} className="mt-1.5 h-1.5 bg-surface-2" />
              </div>
              <span className="shrink-0 text-xs font-bold text-primary">{r.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          MODAL ESTILO WHATSAPP DO CHAT DA LIGA
         ========================================== */}
      <Dialog
        open={!!selectedChatGroup}
        onOpenChange={(open) => {
          if (!open) setSelectedChatGroup(null);
        }}
      >
        <DialogContent className="max-w-2xl w-[95vw] h-[680px] max-h-[92vh] p-0 flex flex-col rounded-2xl overflow-hidden bg-[#0B141A] border-[#222E35] text-foreground shadow-2xl">
          {/* WhatsApp Header */}
          {selectedChatGroup && (
            <div className="bg-[#202C33] border-b border-[#2A3942] px-4 py-3 flex items-center justify-between text-foreground shrink-0 select-none">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00A884]/20 border border-[#00A884]/40 font-bold text-[#00A884] text-sm shadow-inner">
                    {selectedChatGroup.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#00A884] border-2 border-[#202C33]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-foreground truncate">{selectedChatGroup.name}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111B21] text-[#00A884] border border-[#00A884]/30 shrink-0">
                      Grupo Oficial
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8696A0] truncate">
                    {selectedChatGroup.members} investidores · Marina, Caio, Juliana, Você...
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRegistrarAporte(selectedChatGroup.id)}
                  className="h-8 text-xs font-bold border-[#2A3942] bg-[#111B21] text-[#00A884] hover:bg-[#111B21]/80 hover:text-emerald-300"
                  title="Registrar meu aporte deste mês na liga (+5 pontos)"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#00A884]" />
                  Aporte
                </Button>
                <button
                  onClick={() => setSelectedChatGroup(null)}
                  className="h-8 w-8 rounded-full grid place-items-center text-[#8696A0] hover:text-foreground hover:bg-[#2A3942] transition-colors"
                  title="Fechar chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B141A] selection:bg-emerald-500/30">
            {/* Aviso de Grupo Seguro */}
            <div className="flex justify-center my-1">
              <div className="bg-[#182229]/95 border border-emerald-500/20 text-[#8696A0] text-[11px] px-3.5 py-1.5 rounded-lg text-center max-w-md flex items-center gap-2 shadow-sm">
                <Lock className="h-3.5 w-3.5 text-[#00A884] shrink-0" />
                <span>As mensagens deste grupo são restritas aos investidores membros da liga.</span>
              </div>
            </div>

            {/* Separador de Data */}
            <div className="flex justify-center my-2">
              <span className="bg-[#182229] border border-[#222E35] text-[10px] font-bold text-[#8696A0] px-3 py-0.5 rounded-md uppercase tracking-wider">
                Hoje
              </span>
            </div>

            {loadingChatMessages && (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#00A884]" />
                <span>Carregando mensagens da liga...</span>
              </div>
            )}

            {chatMessages.map((m) => {
              if (m.mine) {
                return (
                  <div key={m.id} className="flex justify-end animate-in fade-in-50 duration-150">
                    <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[80%] sm:max-w-[70%] shadow-md">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-emerald-200/70">
                        <span>{m.time}</span>
                        <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex items-start gap-2 justify-start animate-in fade-in-50 duration-150">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#202C33] text-[10px] font-bold text-foreground border border-white/10 mt-1 shadow-sm">
                    {m.initials}
                  </span>
                  <div className="bg-[#202C33] text-[#E9EDEF] rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[80%] sm:max-w-[70%] shadow-md border border-[#2A3942]/60">
                    <p className="text-[11px] font-bold text-[#00A884] mb-0.5">{m.from}</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <div className="flex items-center justify-end text-[10px] text-[#8696A0] mt-1">
                      <span>{m.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={chatMessagesEndRef} />
          </div>

          {/* Quick Shortcuts Chips (estilo WhatsApp sugestões rápidas) */}
          <div className="bg-[#111B21] border-t border-[#2A3942]/60 px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              "Fechei meu aporte do mês! 🚀",
              "Qual ativo estão comprando hoje? 📈",
              "Bati minha meta mensal! 💰",
              "Ranking da liga atualizado! 🏆",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendGroupMessage(chip)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-[#202C33] hover:bg-[#2A3942] border border-[#2A3942] text-[#E9EDEF] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* WhatsApp Input Footer */}
          <div className="bg-[#202C33] border-t border-[#2A3942] p-3 flex items-center gap-2.5 shrink-0">
            <Input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendGroupMessage();
                }
              }}
              placeholder={`Mensagem para a ${selectedChatGroup?.name || "liga"}...`}
              className="bg-[#2A3942] text-foreground placeholder:text-[#8696A0] rounded-full px-4 py-2.5 text-sm flex-1 border-none focus-visible:ring-1 focus-visible:ring-[#00A884]"
            />
            <Button
              onClick={() => handleSendGroupMessage()}
              disabled={!chatDraft.trim() || sendingMsg}
              className="h-10 w-10 rounded-full bg-[#00A884] hover:bg-[#00A884]/90 text-white p-0 grid place-items-center shadow-md shrink-0 transition-transform active:scale-95 disabled:opacity-50"
              title="Enviar mensagem para o grupo"
            >
              {sendingMsg ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
