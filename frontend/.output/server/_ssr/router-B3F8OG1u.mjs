import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as ImageUp, D as Newspaper, E as Pause, F as LoaderCircle, J as CircleCheck, M as LogOut, S as RefreshCw, T as Play, V as House, Z as ChevronRight, a as User, at as Building2, c as Trophy, ct as Bell, ft as Activity, i as Users, k as MessageCircle, l as TrendingUp, m as ShieldCheck, n as X, nt as ChartLine, p as Sparkles, r as Wallet, s as Upload, tt as ChartPie, u as TrendingDown } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { c as SelectItem, d as Label, f as Input, i as removeStoredToken, l as SelectTrigger, m as cn, n as api, o as Select, p as Button, r as getStoredToken, s as SelectContent, u as SelectValue } from "./router-B3F8OG1u2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-DGl8EHd4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-B3F8OG1u.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-DeIZLATM.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var currentUser = {
	name: "Rafael Duarte",
	handle: "@rafaduarte",
	initials: "RD",
	points: 34,
	level: 6,
	levelName: "Investidor Consistente",
	streak: 8,
	nextLevelAt: 40
};
var ranking = [
	{
		pos: 1,
		name: "Marina Costa",
		initials: "MC",
		points: 58,
		streak: 22,
		badge: "Diamante"
	},
	{
		pos: 2,
		name: "Caio Menezes",
		initials: "CM",
		points: 51,
		streak: 19,
		badge: "Diamante"
	},
	{
		pos: 3,
		name: "Juliana Reis",
		initials: "JR",
		points: 47,
		streak: 17,
		badge: "Platina"
	},
	{
		pos: 4,
		name: "Rafael Duarte",
		initials: "RD",
		points: 34,
		streak: 8,
		badge: "Ouro"
	},
	{
		pos: 5,
		name: "Bruno Alves",
		initials: "BA",
		points: 29,
		streak: 6,
		badge: "Ouro"
	},
	{
		pos: 6,
		name: "Tatiane Lima",
		initials: "TL",
		points: 21,
		streak: 4,
		badge: "Prata"
	}
];
var badges = [
	{
		name: "Primeiro Aporte",
		desc: "Enviou o 1º comprovante",
		earned: true
	},
	{
		name: "6 Meses Seguidos",
		desc: "Semestre sem falhar",
		earned: true
	},
	{
		name: "Diversificado",
		desc: "4 classes de ativos",
		earned: true
	},
	{
		name: "Mentor",
		desc: "10 respostas úteis no fórum",
		earned: false
	},
	{
		name: "Um Ano de Disciplina",
		desc: "12 aportes consecutivos",
		earned: false
	},
	{
		name: "Fundador de Liga",
		desc: "Criou um grupo com 10+",
		earned: false
	}
];
var groups = [
	{
		id: "g1",
		name: "Liga Renda Passiva",
		members: 18,
		aportes: 14,
		you: 4
	},
	{
		id: "g2",
		name: "Small Caps BR",
		members: 9,
		aportes: 7,
		you: 2
	},
	{
		id: "g3",
		name: "FIIs de Tijolo",
		members: 24,
		aportes: 21,
		you: 11
	}
];
var chats = [
	{
		id: "c1",
		name: "Liga Renda Passiva",
		initials: "LP",
		group: true,
		last: "Caio: fechei o aporte agora 🚀",
		time: "09:41",
		unread: 3
	},
	{
		id: "c2",
		name: "Marina Costa",
		initials: "MC",
		group: false,
		last: "Te mandei o print do FII",
		time: "08:12",
		unread: 1
	},
	{
		id: "c3",
		name: "Small Caps BR",
		initials: "SC",
		group: true,
		last: "Você: vale acompanhar o guidance",
		time: "Ontem",
		unread: 0
	},
	{
		id: "c4",
		name: "Bruno Alves",
		initials: "BA",
		group: false,
		last: "Valeu pela dica do Tesouro",
		time: "Ter",
		unread: 0
	}
];
var messages = [
	{
		id: "m1",
		from: "Marina Costa",
		mine: false,
		text: "Fechou o aporte de agosto?",
		time: "09:20"
	},
	{
		id: "m2",
		from: "me",
		mine: true,
		text: "Fechei agora de manhã. 40% FIIs dessa vez.",
		time: "09:22"
	},
	{
		id: "m3",
		from: "Marina Costa",
		mine: false,
		text: "Boa! Sobe o comprovante pra valer ponto na liga 😄",
		time: "09:24"
	},
	{
		id: "m4",
		from: "me",
		mine: true,
		text: "Já subindo. Esse mês fecho o nível 7.",
		time: "09:26"
	},
	{
		id: "m5",
		from: "Caio Menezes",
		mine: false,
		text: "fechei o aporte agora 🚀",
		time: "09:41"
	}
];
var assets = [
	{
		ticker: "PETR4",
		name: "Petrobras PN",
		price: 38.42,
		change: 1.84,
		sector: "Petróleo e Gás"
	},
	{
		ticker: "VALE3",
		name: "Vale ON",
		price: 61.15,
		change: -.72,
		sector: "Mineração"
	},
	{
		ticker: "ITUB4",
		name: "Itaú Unibanco PN",
		price: 33.9,
		change: .46,
		sector: "Bancos"
	},
	{
		ticker: "BBAS3",
		name: "Banco do Brasil ON",
		price: 27.31,
		change: 2.11,
		sector: "Bancos"
	},
	{
		ticker: "WEGE3",
		name: "WEG ON",
		price: 52.08,
		change: -1.2,
		sector: "Bens Industriais"
	},
	{
		ticker: "HGLG11",
		name: "CSHG Logística FII",
		price: 163.4,
		change: .28,
		sector: "FII Logístico"
	},
	{
		ticker: "ITSA4",
		name: "Itaúsa PN",
		price: 10.74,
		change: .93,
		sector: "Holding"
	},
	{
		ticker: "BOVA11",
		name: "iShares Ibovespa ETF",
		price: 128.66,
		change: .61,
		sector: "ETF"
	}
];
var priceSeries = [
	{
		d: "01/07",
		p: 34.1
	},
	{
		d: "05/07",
		p: 34.9
	},
	{
		d: "09/07",
		p: 33.8
	},
	{
		d: "13/07",
		p: 35.6
	},
	{
		d: "17/07",
		p: 36.2
	},
	{
		d: "21/07",
		p: 35.4
	},
	{
		d: "25/07",
		p: 36.9
	},
	{
		d: "29/07",
		p: 37.5
	},
	{
		d: "02/08",
		p: 37.1
	},
	{
		d: "06/08",
		p: 38.42
	}
];
var news = [
	{
		id: "n1",
		title: "Copom mantém Selic e sinaliza cortes graduais no próximo trimestre",
		source: "Valor Econômico",
		time: "há 25 min",
		sentiment: "Positivo",
		summary: "Comitê destaca desaceleração da inflação de serviços; mercado antecipa alívio na curva de juros longa."
	},
	{
		id: "n2",
		title: "Petrobras aprova dividendos extraordinários após balanço do 2º tri",
		source: "InfoMoney",
		time: "há 1 h",
		sentiment: "Positivo",
		summary: "Distribuição supera projeções de analistas e reforça tese de dividendos para o setor."
	},
	{
		id: "n3",
		title: "Minério de ferro recua em Dalian com dados fracos da construção chinesa",
		source: "Reuters Brasil",
		time: "há 2 h",
		sentiment: "Negativo",
		summary: "Pressão sobre mineradoras brasileiras; VALE3 opera em queda no pregão desta manhã."
	},
	{
		id: "n4",
		title: "IBGE: varejo cresce 0,4% em junho, em linha com o consenso",
		source: "Agência Brasil",
		time: "há 4 h",
		sentiment: "Neutro",
		summary: "Resultado sem surpresas mantém projeções de PIB inalteradas para o ano."
	},
	{
		id: "n5",
		title: "Captação de FIIs tem melhor mês do ano com forte demanda por logística",
		source: "Suno Notícias",
		time: "há 6 h",
		sentiment: "Positivo",
		summary: "Fundos de galpões lideram entrada de recursos; vacância segue em mínimas históricas."
	}
];
var portfolios = {
	conservador: [
		{
			name: "Renda Fixa",
			value: 70
		},
		{
			name: "FIIs",
			value: 15
		},
		{
			name: "Ações",
			value: 10
		},
		{
			name: "ETFs",
			value: 5
		}
	],
	moderado: [
		{
			name: "Renda Fixa",
			value: 45
		},
		{
			name: "Ações",
			value: 25
		},
		{
			name: "FIIs",
			value: 18
		},
		{
			name: "ETFs",
			value: 12
		}
	],
	arrojado: [
		{
			name: "Ações",
			value: 45
		},
		{
			name: "ETFs",
			value: 25
		},
		{
			name: "FIIs",
			value: 18
		},
		{
			name: "Renda Fixa",
			value: 12
		}
	]
};
function UploadProofDialog({ trigger, onSuccess }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)(null);
	const [fileBase64, setFileBase64] = (0, import_react.useState)(null);
	const [valor, setValor] = (0, import_react.useState)("");
	const [classe, setClasse] = (0, import_react.useState)("acoes");
	const [mensagem, setMensagem] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleFileChange = (e) => {
		const uploadedFile = e.target.files?.[0];
		if (!uploadedFile) return;
		setFileName(uploadedFile.name);
		const reader = new FileReader();
		reader.onloadend = () => {
			setFileBase64(reader.result);
		};
		reader.readAsDataURL(uploadedFile);
	};
	const handleEnviar = async () => {
		setLoading(true);
		try {
			const textoPadrao = `Aporte mensal realizado com sucesso no valor de R$ ${valor || "1.500,00"} em ${{
				acoes: "Ações",
				fiis: "Fundos Imobiliários",
				rf: "Renda Fixa",
				etf: "ETFs"
			}[classe]}. Mantendo a consistência rumo à independência financeira! 🚀`;
			const textoFinal = mensagem.trim() !== "" ? mensagem : textoPadrao;
			const res = await api.createPost({
				conteudo: textoFinal,
				tag: "Aporte",
				comprovante: true,
				...fileBase64 ? { comprovante_url: fileBase64 } : {}
			});
			toast.success("Comprovante validado e salvo com sucesso!", { description: "+1 ponto e aporte registrado no banco de dados." });
			setOpen(false);
			setFileName(null);
			setFileBase64(null);
			setMensagem("");
			setValor("");
			if (onSuccess) onSuccess(res?.pontos_totais);
		} catch (err) {
			toast.error(err.message || "Erro ao registrar comprovante.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full gap-2 font-semibold gold-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Enviar comprovante"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Comprovante de aporte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Registre o aporte do mês no banco de dados e ganhe +1 ponto na sua liga." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-surface-2/50 px-4 py-8 text-center transition-colors hover:border-primary/50",
						children: [fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7 text-success" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: fileName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Clique para trocar"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUp, { className: "h-7 w-7 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Arraste ou selecione a imagem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "PNG, JPG ou PDF até 10 MB"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*,application/pdf",
							className: "hidden",
							onChange: handleFileChange
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mensagem",
							children: "O que você quer compartilhar?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "mensagem",
							value: mensagem,
							onChange: (e) => setMensagem(e.target.value),
							placeholder: "Ex: Mais um mês comprando cotas de FIIs! Foco no longo prazo...",
							className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "valor",
								children: "Valor aportado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "valor",
								value: valor,
								onChange: (e) => setValor(e.target.value),
								placeholder: "R$ 1.500,00",
								inputMode: "decimal"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Classe do ativo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classe,
								onValueChange: setClasse,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "acoes",
										children: "Ações"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fiis",
										children: "FIIs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "rf",
										children: "Renda Fixa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "etf",
										children: "ETFs"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "flex-1 gap-2",
							onClick: () => setOpen(false),
							disabled: loading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Cancelar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1 font-semibold",
							onClick: handleEnviar,
							disabled: loading,
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }), "Salvando..."] }) : "Confirmar aporte"
						})]
					})
				]
			})]
		})]
	});
}
var defaultMarketTickerItems = [
	{
		symbol: "IBOVESPA",
		value: "131.450 pts",
		change: "+0.68%",
		up: true
	},
	{
		symbol: "S&P 500",
		value: "5.680 pts",
		change: "+0.42%",
		up: true
	},
	{
		symbol: "NASDAQ",
		value: "17.920 pts",
		change: "+0.75%",
		up: true
	},
	{
		symbol: "DÓLAR (USD)",
		value: "R$ 5,42",
		change: "-0.31%",
		up: false
	},
	{
		symbol: "EURO (EUR)",
		value: "R$ 6,05",
		change: "-0.15%",
		up: false
	},
	{
		symbol: "BITCOIN",
		value: "US$ 64.200",
		change: "+2.15%",
		up: true
	},
	{
		symbol: "PETR4",
		value: "R$ 38,50",
		change: "+1.85%",
		up: true
	},
	{
		symbol: "VALE3",
		value: "R$ 62,10",
		change: "-0.40%",
		up: false
	},
	{
		symbol: "ITUB4",
		value: "R$ 34,20",
		change: "+1.10%",
		up: true
	},
	{
		symbol: "TAXA SELIC",
		value: "10.50% a.a.",
		change: "Estável",
		up: true
	}
];
var social = [
	{
		to: "/",
		label: "Feed & Teses",
		icon: House
	},
	{
		to: "/chat",
		label: "Assistente IA",
		icon: MessageCircle
	},
	{
		to: "/ranking",
		label: "Ranking & Ligas",
		icon: Trophy
	},
	{
		to: "/grupos",
		label: "Grupos Privados",
		icon: Users
	}
];
var market = [
	{
		to: "/mercado",
		label: "Mercado B3",
		icon: ChartLine
	},
	{
		to: "/smart-invest",
		label: "Smart Invest (IA)",
		icon: ChartPie
	},
	{
		to: "/carteira",
		label: "Minha Carteira",
		icon: Wallet
	},
	{
		to: "/noticias",
		label: "Sentimento News",
		icon: Newspaper
	}
];
function NavLink({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all", active ? "bg-primary/15 text-primary font-semibold shadow-sm shadow-primary/10 border-l-2 border-primary" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			}),
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" })
		]
	});
}
function AppShell({ children }) {
	const path = useRouterState({ select: (r) => r.location.pathname });
	const navigate = useNavigate();
	const isActive = (to) => to === "/" ? path === "/" : path.startsWith(to);
	const mobileNav = [
		social[0],
		social[1],
		market[0],
		market[1],
		social[2]
	];
	const [user, setUser] = (0, import_react.useState)(currentUser);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [editNome, setEditNome] = (0, import_react.useState)(currentUser.name);
	const [editRenda, setEditRenda] = (0, import_react.useState)("6500");
	const [editIdade, setEditIdade] = (0, import_react.useState)("32");
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const carregarPerfil = () => {
		api.getProfile().then((res) => {
			if (res?.dados) {
				setUser(res.dados);
				setEditNome(res.dados.name);
				setEditRenda(String(res.dados.renda_mensal || 6500));
				setEditIdade(String(res.dados.idade || 32));
			}
		}).catch(() => {});
	};
	(0, import_react.useEffect)(() => {
		carregarPerfil();
	}, []);
	const handleSalvarPerfil = async () => {
		setSavingProfile(true);
		try {
			const res = await api.updateProfile({
				name: editNome,
				renda_mensal: parseFloat(editRenda) || 5e3,
				idade: parseInt(editIdade) || 30
			});
			if (res?.dados) setUser(res.dados);
			toast.success("Perfil atualizado no banco de dados!");
			setProfileOpen(false);
		} catch (err) {
			toast.error("Erro ao atualizar perfil");
		} finally {
			setSavingProfile(false);
		}
	};
	const [tickerItems, setTickerItems] = (0, import_react.useState)(defaultMarketTickerItems);
	const [isTickerPaused, setIsTickerPaused] = (0, import_react.useState)(false);
	const [isRefreshingTicker, setIsRefreshingTicker] = (0, import_react.useState)(false);
	const carregarTicker = async () => {
		try {
			const dados = await api.getMarketTicker();
			if (dados && dados.length > 0) setTickerItems(dados);
		} catch (e) {
			console.warn("[AppShell] Erro ao carregar cotações online:", e);
		}
	};
	(0, import_react.useEffect)(() => {
		carregarTicker();
		const interval = setInterval(carregarTicker, 9e4);
		return () => clearInterval(interval);
	}, []);
	const handleRefreshTickerClick = async () => {
		setIsRefreshingTicker(true);
		await carregarTicker();
		setTimeout(() => setIsRefreshingTicker(false), 600);
	};
	const handleLogout = () => {
		removeStoredToken();
		toast.info("Você saiu da conta.");
		setProfileOpen(false);
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border/80 bg-[#07090E] text-xs py-1 px-3 z-40 select-none overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0 border-r border-border/60 pr-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-xs tracking-wider uppercase text-foreground/80 hidden sm:inline",
									children: "B3 & Global Markets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-xs tracking-wider uppercase text-foreground/80 sm:hidden",
									children: "Mercados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleRefreshTickerClick,
									className: "p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-surface-2",
									title: "Atualizar cotações em tempo real",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-3 w-3", isRefreshingTicker && "animate-spin text-primary") })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setIsTickerPaused((prev) => !prev),
									className: "p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-surface-2",
									title: isTickerPaused ? "Retomar rotação automática" : "Pausar rotação automática",
									children: isTickerPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3 w-3" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							onMouseEnter: () => setIsTickerPaused(true),
							onMouseLeave: () => setIsTickerPaused(false),
							className: "flex-1 overflow-hidden whitespace-nowrap cursor-pointer",
							title: "Passe o mouse para pausar ou clique em uma ação para ver a análise",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "animate-ticker-glide inline-flex items-center gap-5",
								style: { animationPlayState: isTickerPaused ? "paused" : "running" },
								children: [...tickerItems, ...tickerItems].map((item, idx) => {
									const isStock = /^[A-Z]{4}(?:3|4|5|6|11)$/.test(item.symbol);
									const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 shrink-0 px-2 py-0.5 rounded transition-colors hover:bg-surface-2/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-foreground/90",
												children: item.symbol
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground font-medium",
												children: item.value
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold", item.up ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"),
												children: [item.up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-2.5 w-2.5" }), item.change]
											})
										]
									});
									if (isStock) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/ativo/$ticker",
										params: { ticker: item.symbol },
										className: "no-underline inline-block",
										title: `Ver análise completa de ${item.symbol}`,
										children: content
									}, `${item.symbol}-${idx}`);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block",
										children: content
									}, `${item.symbol}-${idx}`);
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden 2xl:flex items-center gap-2 shrink-0 border-l border-border/60 pl-3 text-muted-foreground text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Cotações B3 & Globais em Tempo Real"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-[1440px] flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 hidden h-[calc(100vh-33px)] w-68 shrink-0 flex-col gap-5 border-r border-border bg-[#0B0E14]/95 px-4 py-5 backdrop-blur-xl lg:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-3 px-2 py-1 transition-all hover:opacity-95 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#161C2B] border border-primary/25 p-1 shadow-lg shadow-primary/20 group-hover:border-primary/50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "Liquid Invest Logo",
									className: "h-9 w-9 object-contain drop-shadow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0B0E14] bg-emerald-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-extrabold tracking-tight text-lg text-foreground",
										children: "LIQUID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-extrabold text-lg",
										children: "INVEST"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold tracking-wider text-muted-foreground uppercase",
									children: "Quant & Fintech Hub"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/5 bg-surface/80 p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "Auditoria de Aportes"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded",
									children: "Ativo"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground/80 leading-snug",
								children: "Modelos inspirados em Markowitz, Black-Litterman e B3."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-col gap-1 overflow-y-auto pr-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70",
									children: "Comunidade & Ligas"
								}),
								social.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
									...i,
									active: isActive(i.to)
								}, i.to)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70",
									children: "Mercado & Modelos Quant"
								}),
								market.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
									...i,
									active: isActive(i.to)
								}, i.to))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto space-y-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadProofDialog, { onSuccess: carregarPerfil }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
								open: profileOpen,
								onOpenChange: setProfileOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "surface-card group flex w-full items-center gap-3 p-2.5 text-left transition-all hover:border-primary/50 hover:bg-surface-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-surface-2 to-surface border border-white/10 text-xs font-bold text-foreground group-hover:border-primary/40",
													children: user.initials || "RD"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-primary" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors",
													children: user.name || "Rafael Duarte"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "truncate text-xs text-muted-foreground",
													children: [
														"Nível ",
														user.level || 6,
														" · ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-primary font-semibold",
															children: [user.points || 34, " pts"]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
									className: "max-w-md border-border bg-surface text-foreground shadow-2xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
										className: "text-xl font-bold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-primary" }), "Perfil do Investidor"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
										className: "text-muted-foreground",
										children: "Dados do investidor sincronizados com o motor de risco e o banco SQLite."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 pt-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-base font-bold text-primary border border-primary/20",
													children: user.initials || "RD"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "truncate font-semibold",
															children: user.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-muted-foreground",
															children: user.email || "rafael@aporta.com"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-primary font-semibold mt-0.5",
															children: [
																"Perfil: ",
																user.perfil_investidor?.toUpperCase() || "MODERADO",
																" · Nível ",
																user.level || 6,
																" (",
																user.badge || "Ouro",
																")"
															]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "nome_edit",
													children: "Nome Completo"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "nome_edit",
													value: editNome,
													onChange: (e) => setEditNome(e.target.value),
													className: "bg-surface-2/50 border-border"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "idade_edit",
														children: "Idade"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "idade_edit",
														value: editIdade,
														onChange: (e) => setEditIdade(e.target.value),
														type: "number",
														className: "bg-surface-2/50 border-border"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "renda_edit",
														children: "Renda Mensal (R$)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "renda_edit",
														value: editRenda,
														onChange: (e) => setEditRenda(e.target.value),
														type: "number",
														className: "bg-surface-2/50 border-border"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 pt-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "destructive",
														className: "gap-1.5 font-medium",
														onClick: handleLogout,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Sair"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														className: "flex-1",
														onClick: () => setProfileOpen(false),
														children: "Cancelar"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														className: "flex-1 font-semibold bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25",
														onClick: handleSalvarPerfil,
														disabled: savingProfile,
														children: savingProfile ? "Salvando..." : "Salvar Alterações"
													})
												]
											})
										]
									})]
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pb-24 lg:pb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2.5 lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "Liquid Invest Logo",
									className: "h-8 w-8 object-contain drop-shadow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-extrabold tracking-tight text-base text-foreground",
									children: "Liquid Invest"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden lg:flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sessão B3 Regular" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/60",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Ambiente Quantitativo com Aprendizado Contínuo"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2 sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/smart-invest",
									className: "hidden sm:inline-flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Simulador Markowitz" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toast.info("Você não possui notificações pendentes no momento."),
									className: "grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground hover:bg-surface-2 hover:border-primary/40",
									title: "Notificações",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setProfileOpen(true),
									className: "grid h-9 w-9 place-items-center rounded-xl bg-surface border border-white/10 text-xs font-bold transition-all hover:scale-105 hover:border-primary/50",
									title: "Meu Perfil",
									children: user.initials || "RD"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: handleLogout,
									title: "Sair da conta",
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 sm:px-8 max-w-[1400px] mx-auto",
						children
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden",
				children: mobileNav.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: cn("flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors", isActive(to) ? "text-primary font-bold" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: label
					})]
				}, to))
			})
		]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "O conteúdo que você procura não existe ou foi movido."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Voltar ao feed"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Algo deu errado do nosso lado. Tente novamente ou volte ao início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir para o início"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Liquid SmartInvest · Plataforma Quantitativa & Social de Investimentos" },
			{
				name: "description",
				content: "Liquid SmartInvest reúne rede social de investidores, ligas gamificadas, modelos de Machine Learning e otimização quantitativa inspirada em referências institucionais."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "icon",
				href: "/logo.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/logo.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	const path = useRouterState({ select: (r) => r.location.pathname });
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!getStoredToken() && path !== "/login") navigate({ to: "/login" });
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [path === "/login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-Bi2gnVq1.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Feed · SmartInvest AI" },
		{
			name: "description",
			content: "Acompanhe os aportes, análises e ligas dos investidores que você segue no feed."
		},
		{
			property: "og:title",
			content: "Feed · SmartInvest AI"
		},
		{
			property: "og:description",
			content: "Rede social gamificada para investidores: aportes, ligas e análises apoiadas em IA."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./carteira-BVEgXuOe.mjs");
var Route$9 = createFileRoute("/carteira")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./chat-fK2FuR9B.mjs");
var Route$8 = createFileRoute("/chat")({
	head: () => ({ meta: [
		{ title: "Chat & Assistente IA · Aporta" },
		{
			name: "description",
			content: "Consulte ações, tire dúvidas sobre investimentos e converse com o Assistente de IA OpenRouter e a comunidade."
		},
		{
			property: "og:title",
			content: "Chat & Assistente IA · Aporta"
		},
		{
			property: "og:description",
			content: "Assistente de IA para análise de ações e perguntas gerais do mercado financeiro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./grupos--rcH7GjO.mjs");
var Route$7 = createFileRoute("/grupos")({
	head: () => ({ meta: [
		{ title: "Grupos e Convites · Aporta" },
		{
			name: "description",
			content: "Crie ligas privadas de investimento, acompanhe os aportes do grupo e convide amigos por link."
		},
		{
			property: "og:title",
			content: "Grupos e Convites · Aporta"
		},
		{
			property: "og:description",
			content: "Ligas privadas, ranking de amigos e convite por link compartilhável."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./login-BvJogz2N.mjs");
var Route$6 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Acessar · SmartInvest AI" }, {
		name: "description",
		content: "Acesse sua conta no SmartInvest AI ou crie um novo perfil para acompanhar seus investimentos."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./mercado-C_Q9Q_sb.mjs");
var Route$5 = createFileRoute("/mercado")({
	head: () => ({ meta: [
		{ title: "Mercado B3 · Cotações & Inteligência Quantitativa · Liquid Invest" },
		{
			name: "description",
			content: "Busque tickers da B3 com autocompletar e abra o dashboard de previsibilidade do ativo."
		},
		{
			property: "og:title",
			content: "Mercado B3 · Liquid Invest"
		},
		{
			property: "og:description",
			content: "Busca de ativos, indicadores técnicos e previsibilidade por IA."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./noticias-DZbOFnS3.mjs");
var Route$4 = createFileRoute("/noticias")({
	head: () => ({ meta: [
		{ title: "Notícias do mercado · Aporta" },
		{
			name: "description",
			content: "Últimas notícias do mercado financeiro e do Brasil com classificação de sentimento por IA."
		},
		{
			property: "og:title",
			content: "Notícias do mercado · Aporta"
		},
		{
			property: "og:description",
			content: "Manchetes com tags de sentimento: positivo, neutro e negativo."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./questionario-UkssTW1B.mjs");
var Route$3 = createFileRoute("/questionario")({
	beforeLoad: () => {
		if (!localStorage.getItem("auth_token")) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./ranking-CtT8fdK3.mjs");
var Route$2 = createFileRoute("/ranking")({
	head: () => ({ meta: [
		{ title: "Ranking e Conquistas · Aporta" },
		{
			name: "description",
			content: "Acompanhe sua pontuação mensal, níveis, badges e o ranking de ações recomendadas por Machine Learning."
		},
		{
			property: "og:title",
			content: "Ranking e Conquistas · Aporta"
		},
		{
			property: "og:description",
			content: "Ranking de ações por IA e gamificação de aportes mensais."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./smart-invest-CgOwPQTA.mjs");
var Route$1 = createFileRoute("/smart-invest")({
	head: () => ({ meta: [
		{ title: "Smart Invest · Carteiras automatizadas · Aporta" },
		{
			name: "description",
			content: "Responda ao perfil de risco e receba uma sugestão de carteira em Renda Fixa, Ações, FIIs e ETFs otimizada via Markowitz e K-Means."
		},
		{
			property: "og:title",
			content: "Smart Invest · Aporta"
		},
		{
			property: "og:description",
			content: "Carteiras sugeridas por IA de acordo com o seu perfil de risco e Teoria Moderna de Portfólio."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./ativo._ticker-B-x8ym4W.mjs");
var Route = createFileRoute("/ativo/$ticker")({
	head: ({ params }) => ({ meta: [
		{ title: `${params.ticker} · Previsibilidade & Parecer IA · Aporta` },
		{
			name: "description",
			content: `Gráfico, indicadores técnicos, notícias e tese de investimento por IA para ${params.ticker}.`
		},
		{
			property: "og:title",
			content: `${params.ticker} · Aporta`
		},
		{
			property: "og:description",
			content: `Análise técnica, sentimento de notícias e orquestração de IA para ${params.ticker}.`
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	CarteiraRoute: Route$9.update({
		id: "/carteira",
		path: "/carteira",
		getParentRoute: () => Route$11
	}),
	ChatRoute: Route$8.update({
		id: "/chat",
		path: "/chat",
		getParentRoute: () => Route$11
	}),
	GruposRoute: Route$7.update({
		id: "/grupos",
		path: "/grupos",
		getParentRoute: () => Route$11
	}),
	LoginRoute: Route$6.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$11
	}),
	MercadoRoute: Route$5.update({
		id: "/mercado",
		path: "/mercado",
		getParentRoute: () => Route$11
	}),
	NoticiasRoute: Route$4.update({
		id: "/noticias",
		path: "/noticias",
		getParentRoute: () => Route$11
	}),
	QuestionarioRoute: Route$3.update({
		id: "/questionario",
		path: "/questionario",
		getParentRoute: () => Route$11
	}),
	RankingRoute: Route$2.update({
		id: "/ranking",
		path: "/ranking",
		getParentRoute: () => Route$11
	}),
	SmartInvestRoute: Route$1.update({
		id: "/smart-invest",
		path: "/smart-invest",
		getParentRoute: () => Route$11
	}),
	AtivoTickerRoute: Route.update({
		id: "/ativo/$ticker",
		path: "/ativo/$ticker",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { DialogDescription as _, chats as a, DialogTrigger as b, groups as c, portfolios as d, priceSeries as f, DialogContent as g, Dialog as h, badges as i, messages as l, router_exports as m, UploadProofDialog as n, currentUser as o, ranking as p, assets as r, getRouter as s, Route as t, news as u, DialogHeader as v, DialogTitle as y };
