import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as LoaderCircle, S as RefreshCw, _ as Search, a as User, g as Send, i as Users, p as Sparkles, st as Bot } from "../_libs/lucide-react.mjs";
import { a as chats, l as messages } from "./router-B3F8OG1u.mjs";
import { f as Input, m as cn, n as api, p as Button } from "./router-B3F8OG1u2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-fK2FuR9B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var quickPrompts = [
	{
		label: "📊 Analisar PETR4",
		query: "Faça uma análise completa de PETR4 com base em indicadores e notícias."
	},
	{
		label: "📈 Analisar VALE3",
		query: "Qual o panorama quantitativo e os riscos atuais para VALE3?"
	},
	{
		label: "💡 O que é Sharpe?",
		query: "Como o Índice de Sharpe é calculado e como ele ajuda na escolha de ações?"
	},
	{
		label: "🏛️ Impacto da Selic",
		query: "Como a taxa Selic afeta as ações da B3 e os fundos imobiliários (FIIs)?"
	},
	{
		label: "🎯 Otimização Markowitz",
		query: "Explique como funciona a Fronteira Eficiente de Markowitz na prática."
	}
];
var welcomeMessage = {
	id: "welcome",
	role: "assistant",
	content: "Olá! Sou o **Assistente Inteligente SmartInvest**, orquestrado via **OpenRouter (Modelos Gratuitos)**.\n\nPosso analisar ações da B3 (cruzando machine learning e sentimento de notícias), responder a dúvidas sobre a Selic, teoria de Markowitz ou conceitos gerais de finanças.\n\nComo posso te ajudar hoje?",
	time: "Agora",
	modelUsed: "OpenRouter Free"
};
var initialCommunityConversations = {
	c1: messages,
	c2: [{
		id: "c2-1",
		from: "Marina Costa",
		mine: false,
		text: "Te mandei o print do FII no grupo!",
		time: "08:10"
	}, {
		id: "c2-2",
		from: "me",
		mine: true,
		text: "Boa Marina, vou analisar o yield dele agora.",
		time: "08:12"
	}],
	c3: [{
		id: "c3-1",
		from: "Caio Menezes",
		mine: false,
		text: "Alguém olhando as small caps de tecnologia hoje?",
		time: "Ontem"
	}, {
		id: "c3-2",
		from: "me",
		mine: true,
		text: "Vale acompanhar o guidance divulgado no 3T!",
		time: "Ontem"
	}],
	c4: [{
		id: "c4-1",
		from: "Bruno Alves",
		mine: false,
		text: "Valeu pela dica do Tesouro IPCA+, a taxa estava ótima.",
		time: "Ter"
	}, {
		id: "c4-2",
		from: "me",
		mine: true,
		text: "Tamo junto! Para horizonte longo faz todo sentido travar essa taxa.",
		time: "Ter"
	}]
};
function ChatPage() {
	const [tab, setTab] = (0, import_react.useState)("ia");
	const [aiMessages, setAiMessages] = (0, import_react.useState)([welcomeMessage]);
	const [aiDraft, setAiDraft] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const aiMessagesEndRef = (0, import_react.useRef)(null);
	const [activeId, setActiveId] = (0, import_react.useState)(chats[0]?.id || "c1");
	const [communitySearch, setCommunitySearch] = (0, import_react.useState)("");
	const [communityDraft, setCommunityDraft] = (0, import_react.useState)("");
	const [conversations, setConversations] = (0, import_react.useState)(initialCommunityConversations);
	const communityMessagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		async function loadChatHistory() {
			try {
				const historyData = await api.getChatHistory();
				if (historyData && historyData.length > 0) {
					const loaded = historyData.map((item) => ({
						id: String(item.id),
						role: item.role,
						content: item.content,
						time: item.created_at || "Recente",
						modelUsed: item.model_used || "OpenRouter Free"
					}));
					setAiMessages(loaded);
				}
			} catch (err) {
				console.warn("[Chat] Histórico anterior indisponível, usando mensagem inicial padrão:", err);
			}
		}
		loadChatHistory();
	}, []);
	(0, import_react.useEffect)(() => {
		if (tab === "ia") aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		aiMessages,
		isLoading,
		tab
	]);
	(0, import_react.useEffect)(() => {
		if (tab === "comunidade") communityMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		conversations,
		activeId,
		tab
	]);
	const sendAIMessage = async (customText) => {
		const textToSend = (customText || aiDraft).trim();
		if (!textToSend || isLoading) return;
		const userMsg = {
			id: `user-${Date.now()}`,
			role: "user",
			content: textToSend,
			time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setAiMessages((prev) => [...prev, userMsg]);
		setAiDraft("");
		setIsLoading(true);
		try {
			const historyPayload = aiMessages.map((m) => ({
				role: m.role,
				content: m.content
			}));
			const res = await api.sendChatMessage(textToSend, historyPayload);
			const assistantMsg = {
				id: `ai-${Date.now()}`,
				role: "assistant",
				content: res.response || "Não foi possível obter resposta no momento.",
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				modelUsed: res.model_used || "OpenRouter Free"
			};
			setAiMessages((prev) => [...prev, assistantMsg]);
		} catch (err) {
			console.error("[Chat] Falha na requisição:", err);
			const errorMsg = {
				id: `err-${Date.now()}`,
				role: "assistant",
				content: "Não foi possível obter resposta no momento.\n\nCertifique-se de que o backend FastAPI esteja em execução na porta 8000. *(Comando: `python -m uvicorn backend.api.app:app --reload`)*",
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				modelUsed: "Aviso de Conexão"
			};
			setAiMessages((prev) => [...prev, errorMsg]);
		} finally {
			setIsLoading(false);
		}
	};
	const handleResetAIChat = () => {
		setAiMessages([welcomeMessage]);
	};
	const sendCommunityMessage = () => {
		const text = communityDraft.trim();
		if (!text) return;
		const newMsg = {
			id: `comm-${Date.now()}`,
			from: "me",
			mine: true,
			text,
			time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setConversations((prev) => ({
			...prev,
			[activeId]: [...prev[activeId] || [], newMsg]
		}));
		setCommunityDraft("");
	};
	const activeChat = chats.find((c) => c.id === activeId) || chats[0];
	const activeMessages = conversations[activeId] || [];
	const filteredChats = chats.filter((c) => c.name.toLowerCase().includes(communitySearch.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-bold sm:text-3xl",
					children: ["Central de Conversas", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Consulte o Assistente IA para análises de mercado ou converse com a comunidade."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: tab,
					onValueChange: (v) => setTab(v),
					className: "w-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "ia",
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }), "Assistente IA"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "comunidade",
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), "Comunidade"]
						})]
					})
				})]
			}),
			tab === "ia" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card flex h-[75vh] flex-col overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface-2/30 p-3.5 sm:px-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-1 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "SmartInvest AI",
									className: "h-8 w-8 object-contain drop-shadow"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: "SmartInvest AI Assistant"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-primary/30 bg-primary/10 text-[10px] text-primary",
										children: "OpenRouter 100% Gratuito"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: "Orquestrador de Machine Learning Quantitativo + NLP FinBERT"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "gap-1 text-xs text-muted-foreground hover:text-foreground",
								onClick: handleResetAIChat,
								title: "Limpar mensagens e reiniciar chat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Limpar"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto border-b border-border/60 bg-surface-1/40 p-2.5 px-4 scrollbar-none",
						children: quickPrompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => sendAIMessage(p.query),
							className: "shrink-0 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-gold-soft hover:text-primary",
							children: p.label
						}, p.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6",
						children: [
							aiMessages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start"),
								children: [
									m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5 shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/logo.png",
											alt: "IA",
											className: "h-6 w-6 object-contain"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-white font-medium rounded-tr-sm shadow-md shadow-primary/20" : "surface-card border-border/80 bg-surface-2/70 text-foreground rounded-tl-sm"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap",
											children: m.content
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center justify-between gap-4 text-[10px] opacity-70",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.modelUsed || "SmartInvest AI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.time })]
										})]
									}),
									m.role === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-2 border border-white/10 text-xs font-bold text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
									})
								]
							}, m.id)),
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 shrink-0 rounded-xl bg-[#161C2B] border border-primary/30 flex items-center justify-center p-0.5 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/logo.png",
										alt: "IA",
										className: "h-6 w-6 object-contain animate-pulse"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-surface-2 p-3 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Consultando modelos de IA e calculando métricas de mercado..." })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: aiMessagesEndRef })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border bg-surface-1 p-3 sm:p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: aiDraft,
							onChange: (e) => setAiDraft(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && sendAIMessage(),
							placeholder: "Pergunte sobre uma ação (ex: PETR4, VALE3), Selic, ou dúvidas de investimento...",
							className: "bg-surface-2",
							disabled: isLoading
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "default",
							className: "gap-2 font-semibold",
							onClick: () => sendAIMessage(),
							disabled: isLoading || !aiDraft.trim(),
							children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Enviar"
							})]
						})]
					})
				]
			}),
			tab === "comunidade" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex max-h-[70vh] flex-col overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: communitySearch,
								onChange: (e) => setCommunitySearch(e.target.value),
								placeholder: "Buscar conversa ou liga...",
								className: "pl-9"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: filteredChats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveId(c.id),
							className: cn("grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-3 text-left transition-colors hover:bg-surface-2", activeId === c.id && "bg-gold-soft"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold",
									children: c.initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [c.group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm font-medium",
											children: c.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-xs text-muted-foreground",
										children: conversations[c.id]?.slice(-1)[0]?.text || c.last
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 flex-col items-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: c.time
									}), c.unread > 0 && activeId !== c.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground",
										children: c.unread
									})]
								})
							]
						}) }, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex h-[70vh] flex-col overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold",
								children: activeChat.initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: activeChat.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-success",
									children: "online agora"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-0 flex-1 space-y-3 overflow-y-auto p-4",
							children: [activeMessages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("flex", m.mine ? "justify-end" : "justify-start"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm", m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-surface-2 text-foreground"),
									children: [
										!m.mine && activeChat.group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-0.5 text-[11px] font-semibold text-primary",
											children: m.from
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed whitespace-pre-wrap",
											children: m.text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("mt-1 text-[10px]", m.mine ? "text-primary-foreground/70" : "text-muted-foreground"),
											children: m.time
										})
									]
								})
							}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: communityMessagesEndRef })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: communityDraft,
								onChange: (e) => setCommunityDraft(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && sendCommunityMessage(),
								placeholder: `Escreva uma mensagem para ${activeChat.name}...`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								className: "shrink-0",
								onClick: sendCommunityMessage,
								disabled: !communityDraft.trim(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ChatPage as component };
