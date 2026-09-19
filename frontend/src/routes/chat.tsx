import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Sparkles,
  Bot,
  User,
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

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat & Assistente IA · Aporta" },
      {
        name: "description",
        content:
          "Consulte ações, tire dúvidas sobre investimentos e converse com o Assistente de IA OpenRouter e a comunidade.",
      },
      { property: "og:title", content: "Chat & Assistente IA · Aporta" },
      {
        property: "og:description",
        content: "Assistente de IA para análise de ações e perguntas gerais do mercado financeiro.",
      },
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
}

interface CommunityMessage {
  id: string;
  from: string;
  mine: boolean;
  text: string;
  time: string;
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
    "Olá! Sou o **Assistente Inteligente SmartInvest**, orquestrado via **OpenRouter (Modelos Gratuitos)**.\n\n" +
    "Posso analisar ações da B3 (cruzando machine learning e sentimento de notícias), responder a dúvidas sobre a Selic, teoria de Markowitz ou conceitos gerais de finanças.\n\n" +
    "Como posso te ajudar hoje?",
  time: "Agora",
  modelUsed: "OpenRouter Free",
};

// Mensagens padrão para cada conversa da comunidade
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

  // ==========================================
  // ESTADOS DO ASSISTENTE DE IA
  // ==========================================
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([welcomeMessage]);
  const [aiDraft, setAiDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // ESTADOS DO CHAT DA COMUNIDADE
  // ==========================================
  const [activeId, setActiveId] = useState(chats[0]?.id || "c1");
  const [communitySearch, setCommunitySearch] = useState("");
  const [communityDraft, setCommunityDraft] = useState("");
  const [conversations, setConversations] = useState<Record<string, CommunityMessage[]>>(initialCommunityConversations);
  const communityMessagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar histórico de mensagens da IA do banco de dados na inicialização
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const historyData = await api.getChatHistory();
        if (historyData && historyData.length > 0) {
          const loaded: AIMessage[] = historyData.map((item) => ({
            id: String(item.id),
            role: item.role as "user" | "assistant",
            content: item.content,
            time: item.created_at || "Recente",
            modelUsed: item.model_used || "OpenRouter Free",
          }));
          setAiMessages(loaded);
        }
      } catch (err) {
        console.warn("[Chat] Histórico anterior indisponível, usando mensagem inicial padrão:", err);
      }
    }

    loadChatHistory();
  }, []);

  // Rolagem automática da IA ao receber novas mensagens
  useEffect(() => {
    if (tab === "ia") {
      aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, isLoading, tab]);

  // Rolagem automática da Comunidade ao enviar mensagem ou trocar conversa
  useEffect(() => {
    if (tab === "comunidade") {
      communityMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeId, tab]);

  // Enviar mensagem para o Assistente IA
  const sendAIMessage = async (customText?: string) => {
    const textToSend = (customText || aiDraft).trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Atualiza a tela imediatamente com a mensagem do usuário
    setAiMessages((prev) => [...prev, userMsg]);
    setAiDraft("");
    setIsLoading(true);

    try {
      // Prepara o histórico recente para enviar à IA
      const historyPayload = aiMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendChatMessage(textToSend, historyPayload);

      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.response || "Não foi possível obter resposta no momento.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.model_used || "OpenRouter Free",
      };

      setAiMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[Chat] Falha na requisição:", err);
      const errorMsg: AIMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          `Não foi possível obter resposta no momento.\n\n` +
          `Certifique-se de que o backend FastAPI esteja em execução na porta 8000. ` +
          `*(Comando: \`python -m uvicorn backend.api.app:app --reload\`)*`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: "Aviso de Conexão",
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reiniciar conversa da IA
  const handleResetAIChat = () => {
    setAiMessages([welcomeMessage]);
  };

  // Enviar mensagem no chat da comunidade
  const sendCommunityMessage = () => {
    const text = communityDraft.trim();
    if (!text) return;

    const newMsg: CommunityMessage = {
      id: `comm-${Date.now()}`,
      from: "me",
      mine: true,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));

    setCommunityDraft("");
  };

  // Conversa ativa selecionada
  const activeChat = chats.find((c) => c.id === activeId) || chats[0];
  const activeMessages = conversations[activeId] || [];

  // Filtro de conversas da lista lateral
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(communitySearch.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      {/* Header e seletor de aba */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            Central de Conversas
            <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Consulte o Assistente IA para análises de mercado ou converse com a comunidade.
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

      {/* ========================================================= */}
      {/* ABA 1: ASSISTENTE IA (OPENROUTER FREE ORCHESTRATOR)      */}
      {/* ========================================================= */}
      {tab === "ia" && (
        <div className="surface-card flex h-[75vh] flex-col overflow-hidden">
          {/* Header da IA */}
          <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface-2/30 p-3.5 sm:px-5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-1 shadow-sm">
              <img src="/logo.png" alt="SmartInvest AI" className="h-8 w-8 object-contain drop-shadow" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">SmartInvest AI Assistant</p>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] text-primary">
                  OpenRouter 100% Gratuito
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Orquestrador de Machine Learning Quantitativo + NLP FinBERT
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleResetAIChat}
              title="Limpar mensagens e reiniciar chat"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          </header>

          {/* Sugestões rápidas (Quick Prompts) */}
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

          {/* Lista de Mensagens */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {aiMessages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5 shadow-sm">
                    <img src="/logo.png" alt="IA" className="h-6 w-6 object-contain" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-white font-medium rounded-tr-sm shadow-md shadow-primary/20"
                      : "surface-card border-border/80 bg-surface-2/70 text-foreground rounded-tl-sm",
                  )}
                >
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-[10px] opacity-70">
                    <span>{m.modelUsed || "SmartInvest AI"}</span>
                    <span>{m.time}</span>
                  </div>
                </div>
                {m.role === "user" && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-2 border border-white/10 text-xs font-bold text-primary">
                    <User className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5 shadow-sm">
                  <img src="/logo.png" alt="IA" className="h-6 w-6 object-contain animate-pulse" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Consultando modelos de IA e calculando métricas de mercado...</span>
                </div>
              </div>
            )}

            <div ref={aiMessagesEndRef} />
          </div>

          {/* Campo de Entrada de Mensagem */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border bg-surface-1 p-3 sm:p-4">
            <Input
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAIMessage()}
              placeholder="Pergunte sobre uma ação (ex: PETR4, VALE3), Selic, ou dúvidas de investimento..."
              className="bg-surface-2"
              disabled={isLoading}
            />
            <Button
              size="default"
              className="gap-2 font-semibold"
              onClick={() => sendAIMessage()}
              disabled={isLoading || !aiDraft.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 2: COMUNIDADE & GRUPOS (CHAT SOCIAL)                  */}
      {/* ========================================================= */}
      {tab === "comunidade" && (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Lista Lateral de Contatos / Grupos */}
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
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                      {c.unread > 0 && activeId !== c.id && (
                        <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Janela de Mensagens da Conversa Ativa */}
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
                <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.mine
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-surface-2 text-foreground",
                    )}
                  >
                    {!m.mine && activeChat.group && (
                      <p className="mb-0.5 text-[11px] font-semibold text-primary">{m.from}</p>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        m.mine ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={communityMessagesEndRef} />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border p-3">
              <Input
                value={communityDraft}
                onChange={(e) => setCommunityDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendCommunityMessage()}
                placeholder={`Escreva uma mensagem para ${activeChat.name}...`}
              />
              <Button size="icon" className="shrink-0" onClick={sendCommunityMessage} disabled={!communityDraft.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
