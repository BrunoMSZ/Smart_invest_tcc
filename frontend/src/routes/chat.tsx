import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  Bot,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chats, messages as initialMessages } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { WhatsAppReactions } from "@/components/whatsapp-reactions";
import {
  ChatComposer,
  ChatAttachmentView,
  type ChatAttachment,
} from "@/components/chat-composer";
import {
  readCachedProfile,
  mergeAvatarFromCache,
  writeCachedProfile,
  cacheAvatarAlone,
  getMemoryAvatar,
  PROFILE_UPDATED_EVENT,
} from "@/lib/profile-cache";
import { recompressDataUrl, AVATAR_SOFT_LIMIT } from "@/lib/avatar-compress";
import type { UserProfile } from "@/lib/api";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat & Assistente IA · Aporta" },
      {
        name: "description",
        content:
          "Consulte ações, tire dúvidas sobre investimentos e converse com o Assistente de IA e a comunidade.",
      },
      { property: "og:title", content: "Chat & Assistente IA · Aporta" },
    ],
  }),
  component: ChatPage,
});

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  modelUsed?: string;
  attachments?: ChatAttachment[];
}

interface CommunityMessage {
  id: string;
  from: string;
  mine: boolean;
  text: string;
  time: string;
  attachments?: ChatAttachment[];
}

const quickPrompts = [
  { label: "📊 Analisar PETR4", query: "Faça uma análise completa de PETR4 com base em indicadores e notícias." },
  { label: "📈 Analisar VALE3", query: "Qual o panorama quantitativo e os riscos atuais para VALE3?" },
  { label: "💡 O que é Sharpe?", query: "Como o Índice de Sharpe é calculado e como ele ajuda na escolha de ações?" },
  { label: "🏛️ Impacto da Selic", query: "Como a taxa Selic afeta as ações da B3 e os fundos imobiliários (FIIs)?" },
  { label: "🎯 Otimização Markowitz", query: "Explique como funciona a Fronteira Eficiente de Markowitz na prática." },
];

const welcomeMessage: AIMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou o **Assistente Inteligente SmartInvest**.\n\n" +
    "Posso analisar ações da B3 e dúvidas de finanças. Use o 😊 para emojis e o clipe 📎 para imagens ou arquivos.\n\n" +
    "Como posso te ajudar hoje?",
  time: "Agora",
  modelUsed: "SmartInvest AI",
};

const initialCommunityConversations: Record<string, CommunityMessage[]> = {
  c1: initialMessages,
  c2: [
    { id: "c2-1", from: "Marina Costa", mine: false, text: "Te mandei o print do FII no grupo!", time: "08:10" },
    { id: "c2-2", from: "me", mine: true, text: "Boa Marina, vou analisar o yield dele agora.", time: "08:12" },
  ],
  c3: [
    { id: "c3-1", from: "Caio Menezes", mine: false, text: "Alguém olhando as small caps de tecnologia hoje?", time: "Ontem" },
    { id: "c3-2", from: "me", mine: true, text: "Vale acompanhar o guidance divulgado no 3T!", time: "Ontem" },
  ],
  c4: [
    { id: "c4-1", from: "Bruno Alves", mine: false, text: "Valeu pela dica do Tesouro IPCA+, a taxa estava ótima.", time: "Ter" },
    { id: "c4-2", from: "me", mine: true, text: "Tamo junto! Para horizonte longo faz todo sentido travar essa taxa.", time: "Ter" },
  ],
};

function ChatPage() {
  const [tab, setTab] = useState<"ia" | "comunidade">("ia");
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([welcomeMessage]);
  const [aiDraft, setAiDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("Investidor");
  const [userInitials, setUserInitials] = useState("US");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

  const [activeId, setActiveId] = useState(chats[0]?.id || "c1");
  const [communitySearch, setCommunitySearch] = useState("");
  const [communityDraft, setCommunityDraft] = useState("");
  const [conversations, setConversations] = useState<Record<string, CommunityMessage[]>>(initialCommunityConversations);
  const communityMessagesEndRef = useRef<HTMLDivElement>(null);

  const applyProfile = (p: UserProfile) => {
    const profile = mergeAvatarFromCache(p);
    if (profile.name) {
      setUserName(profile.name);
      setUserInitials(
        profile.initials ||
          profile.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((x) => x[0]?.toUpperCase() || "")
            .join("") ||
          "US",
      );
    }
    const nextAvatar = profile.avatar_url || getMemoryAvatar() || null;
    if (nextAvatar) {
      setUserAvatarUrl(nextAvatar);
      cacheAvatarAlone(nextAvatar);
    }
  };

  useEffect(() => {
    // 1) Cache local / memória (foto aparece mesmo antes da API)
    const cached = readCachedProfile();
    if (cached) applyProfile(cached);
    const alone =
      getMemoryAvatar() ||
      (typeof window !== "undefined" ? localStorage.getItem("smartinvest_avatar_cache") : null);
    if (alone) setUserAvatarUrl(alone);

    async function loadProfile() {
      try {
        const profileData = await api.getProfile();
        if (!profileData?.dados) return;
        let dados = profileData.dados;
        if (dados.avatar_url && dados.avatar_url.length > AVATAR_SOFT_LIMIT) {
          const smaller = await recompressDataUrl(dados.avatar_url);
          if (smaller && smaller.length < dados.avatar_url.length) {
            dados = { ...dados, avatar_url: smaller };
            writeCachedProfile(dados);
            try {
              await api.updateProfile({ avatar_url: smaller });
            } catch {
              /* local ok */
            }
          }
        }
        applyProfile(dados);
      } catch {
        /* ignore */
      }
    }

    async function loadChatHistory() {
      try {
        const historyData = await api.getChatHistory();
        if (historyData && historyData.length > 0) {
          setAiMessages(
            historyData.map((item) => ({
              id: String(item.id),
              role: item.role as "user" | "assistant",
              content: item.content,
              time: item.created_at || "Recente",
              modelUsed: item.role === "assistant" ? item.model_used || "SmartInvest AI" : undefined,
            })),
          );
        }
      } catch (err) {
        console.warn("[Chat] Histórico indisponível:", err);
      }
    }

    void loadProfile();
    void loadChatHistory();

    // 2) Atualiza quando o perfil/foto mudar em qualquer lugar do app
    const onProfileUpdated = (e: Event) => {
      const detail = (e as CustomEvent<UserProfile>).detail;
      if (detail) applyProfile(detail);
      else {
        const av = getMemoryAvatar();
        if (av) setUserAvatarUrl(av);
      }
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "smartinvest_profile_cache" || e.key === "smartinvest_avatar_cache") {
        const c = readCachedProfile();
        if (c) applyProfile(c);
        const av = getMemoryAvatar() || localStorage.getItem("smartinvest_avatar_cache");
        if (av) setUserAvatarUrl(av);
      }
    };
    window.addEventListener("storage", onStorage);
    const onFocus = () => void loadProfile();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (tab === "ia") aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isLoading, tab]);

  useEffect(() => {
    if (tab === "comunidade") communityMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeId, tab]);

  const sendAIMessage = async (payload: { text: string; attachments: ChatAttachment[] } | string) => {
    const textToSend = typeof payload === "string" ? payload.trim() : payload.text.trim();
    const attachments = typeof payload === "string" ? [] : payload.attachments;
    if ((!textToSend && attachments.length === 0) || isLoading) return;

    const attachmentNote =
      attachments.length > 0
        ? `\n\n[${attachments.map((a) => (a.type === "image" ? `Imagem: ${a.name}` : `Arquivo: ${a.name}`)).join(", ")}]`
        : "";
    const apiText = (textToSend || "Segue o anexo.") + attachmentNote;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend || (attachments.length ? "📎 Anexo" : ""),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachments,
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiDraft("");
    setIsLoading(true);

    try {
      const historyPayload = aiMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.sendChatMessage(apiText, historyPayload);
      setAiMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: res.response || "Não foi possível obter resposta no momento.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: res.model_used || "SmartInvest AI",
        },
      ]);
    } catch (err) {
      console.error("[Chat] Falha:", err);
      setAiMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Não foi possível obter resposta. Verifique se o backend está na porta 8000.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: "Aviso",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendCommunityMessage = (payload: { text: string; attachments: ChatAttachment[] }) => {
    const text = payload.text.trim();
    if (!text && payload.attachments.length === 0) return;

    const newMsg: CommunityMessage = {
      id: `comm-${Date.now()}`,
      from: "me",
      mine: true,
      text: text || (payload.attachments.length ? "📎 Anexo" : ""),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachments: payload.attachments,
    };

    setConversations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setCommunityDraft("");
  };

  const activeChat = chats.find((c) => c.id === activeId) || chats[0];
  const activeMessages = conversations[activeId] || [];
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(communitySearch.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            Central de Conversas
            <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Emojis e anexos no estilo WhatsApp — Assistente IA ou Comunidade.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "ia" | "comunidade")} className="w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ia" className="gap-1.5">
              <Bot className="h-4 w-4" />
              Assistente IA
            </TabsTrigger>
            <TabsTrigger value="comunidade" className="gap-1.5">
              <Users className="h-4 w-4" />
              Comunidade
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "ia" && (
        <div className="surface-card flex h-[75vh] flex-col overflow-hidden">
          <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface-2/30 p-3.5 sm:px-5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-1 shadow-sm">
              <img src="/logo.png" alt="SmartInvest AI" className="h-8 w-8 object-contain drop-shadow" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">SmartInvest AI Assistant</p>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] text-primary">
                  Online
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Machine Learning Quantitativo + NLP FinBERT
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setAiMessages([welcomeMessage])}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-border/60 bg-surface-1/40 p-2.5 px-4 scrollbar-none">
            {quickPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => sendAIMessage(p.query)}
                className="shrink-0 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-gold-soft hover:text-primary"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {aiMessages.map((m) => (
              <div
                key={m.id}
                className={cn("flex items-end gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5 shadow-sm">
                    <img src="/logo.png" alt="IA" className="h-6 w-6 object-contain" />
                  </div>
                )}
                <div
                  className={cn(
                    "relative max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-white font-medium rounded-tr-sm shadow-md shadow-primary/20"
                      : "surface-card border-border/80 bg-surface-2/70 text-foreground rounded-tl-sm",
                  )}
                >
                  {m.content ? (
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                  ) : null}
                  <ChatAttachmentView attachments={m.attachments} inverted={m.role === "user"} />
                  <div className="mt-2 flex items-center justify-between gap-4 text-[10px] opacity-70">
                    <span>{m.role === "user" ? userName : "SmartInvest AI"}</span>
                    <span>{m.time}</span>
                  </div>
                  {m.role !== "user" && (
                    <div className="mt-2 flex justify-start">
                      <WhatsAppReactions
                        storageKey={`chat_ia_${m.id}`}
                        align="left"
                      />
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2 border border-white/10 text-xs font-bold text-primary">
                    {userAvatarUrl ? (
                      <img src={userAvatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5">
                  <img src="/logo.png" alt="IA" className="h-6 w-6 object-contain animate-pulse" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Consultando modelos de IA...</span>
                </div>
              </div>
            )}
            <div ref={aiMessagesEndRef} />
          </div>

          <ChatComposer
            value={aiDraft}
            onChange={setAiDraft}
            onSend={sendAIMessage}
            disabled={isLoading}
            sending={isLoading}
            placeholder="Mensagem, emoji ou anexe um arquivo..."
          />
        </div>
      )}

      {tab === "comunidade" && (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="surface-card flex max-h-[70vh] flex-col overflow-hidden">
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={communitySearch}
                  onChange={(e) => setCommunitySearch(e.target.value)}
                  placeholder="Buscar conversa ou liga..."
                  className="pl-9"
                />
              </div>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {filteredChats.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-3 text-left transition-colors hover:bg-surface-2",
                      activeId === c.id && "bg-gold-soft",
                    )}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold">
                      {c.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        {c.group && <Users className="h-3 w-3 shrink-0 text-muted-foreground" />}
                        <span className="truncate text-sm font-medium">{c.name}</span>
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {conversations[c.id]?.slice(-1)[0]?.text || c.last}
                      </span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card flex h-[70vh] flex-col overflow-hidden">
            <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold">
                {activeChat.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{activeChat.name}</p>
                <p className="truncate text-xs text-success">online agora</p>
              </div>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {activeMessages.map((m) => (
                <div key={m.id} className={cn("flex items-end gap-2", m.mine ? "justify-end" : "justify-start")}>
                  {!m.mine && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-bold">
                      {activeChat.initials}
                    </span>
                  )}
                  <div
                    className={cn(
                      "relative max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.mine
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-surface-2 text-foreground",
                    )}
                  >
                    {!m.mine && activeChat.group && (
                      <p className="mb-0.5 text-[11px] font-semibold text-primary">{m.from}</p>
                    )}
                    {m.text ? <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p> : null}
                    <ChatAttachmentView attachments={m.attachments} inverted={m.mine} />
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        m.mine ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {m.time}
                    </p>
                    <div className={cn("mt-1.5", m.mine ? "flex justify-end" : "flex justify-start")}>
                      {!m.mine && (
                        <WhatsAppReactions
                          storageKey={`chat_comm_${activeId}_${m.id}`}
                          align="left"
                        />
                      )}
                    </div>
                  </div>
                  {m.mine && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 border border-white/10 text-[10px] font-bold text-primary">
                      {userAvatarUrl ? (
                        <img src={userAvatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </span>
                  )}
                </div>
              ))}
              <div ref={communityMessagesEndRef} />
            </div>

            <ChatComposer
              value={communityDraft}
              onChange={setCommunityDraft}
              onSend={sendCommunityMessage}
              placeholder={`Mensagem para ${activeChat.name}...`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
