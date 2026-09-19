import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as Medal, F as LoaderCircle, K as Crown, P as Lock, W as Flame, c as Trophy, l as TrendingUp, p as Sparkles, ut as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as badges, n as UploadProofDialog, o as currentUser, p as ranking } from "./router-B3F8OG1u.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn, n as api, p as Button } from "./router-B3F8OG1u2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ranking-CtT8fdK3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var months = [
	"Set",
	"Out",
	"Nov",
	"Dez",
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago"
];
var done = [
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true
];
function RankingPage() {
	const [stockRanking, setStockRanking] = (0, import_react.useState)([]);
	const [userRanking, setUserRanking] = (0, import_react.useState)(ranking);
	const [userProfile, setUserProfile] = (0, import_react.useState)(currentUser);
	const [loadingStocks, setLoadingStocks] = (0, import_react.useState)(true);
	const carregarDados = () => {
		setLoadingStocks(true);
		api.getStockRanking(10).then((data) => {
			if (Array.isArray(data) && data.length > 0) setStockRanking(data);
		}).catch((err) => {
			console.log("Fallback stock ranking:", err);
		}).finally(() => setLoadingStocks(false));
		api.getUserRanking().then((data) => {
			if (Array.isArray(data) && data.length > 0) setUserRanking(data);
		}).catch((err) => {
			console.log("Fallback user ranking:", err);
		});
		api.getProfile().then((res) => {
			if (res?.dados) setUserProfile(res.dados);
		}).catch((err) => {
			console.log("Fallback user profile:", err);
		});
	};
	(0, import_react.useEffect)(() => {
		carregarDados();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card p-6 border-border/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Liga de Consistência & Disciplina B3" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black sm:text-3xl tracking-tight text-foreground",
							children: "Ranking & Recomendações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Acompanhe a atratividade quantitativa dos ativos e dispute posições com outros investidores comprovando aportes reais."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-primary/40 text-xs text-primary font-bold w-fit",
						children: "Temporada 2026"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card liquid-glow p-6 border-border/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase font-bold tracking-widest text-primary",
										children: "Sua pontuação de aportes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-display text-5xl font-black text-foreground",
										children: [
											userProfile.points || 34,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-lg font-bold text-primary",
												children: "pts"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 truncate text-sm text-muted-foreground",
										children: [
											"Nível ",
											userProfile.level || 6,
											" · ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: userProfile.levelName || "Investidor Consistente"
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/30 shadow-lg shadow-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-7 w-7" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: (userProfile.points || 34) / (userProfile.nextLevelAt || 40) * 100,
							className: "mt-5 h-2.5 bg-surface-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"Faltam ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [Math.max((userProfile.nextLevelAt || 40) - (userProfile.points || 34), 0), " pontos"] }),
								" para o nível",
								" ",
								(userProfile.level || 6) + 1
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadProofDialog, { onSuccess: carregarDados })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-6 border-border/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm font-bold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary" }), "Sequência de Aportes Mensais"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [userProfile.streak || 8, " meses consecutivos registrados e auditados"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid grid-cols-6 gap-2",
							children: months.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("grid h-10 place-items-center rounded-xl border text-xs font-bold transition-all", done[i] ? "border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/15" : "border-border bg-surface-2/40 text-muted-foreground/60"),
									children: done[i] ? "+1" : "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-[11px] font-medium text-muted-foreground",
									children: m
								})]
							}, m))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "acoes",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-surface-2/60 border border-border p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "acoes",
								className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Top Ações por IA"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "ranking",
								className: "data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs",
								children: "Liga de Usuários"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "badges",
								className: "data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs",
								children: "Conquistas"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "acoes",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card divide-y divide-border overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-surface-2/30 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Score Multi-Fatorial de Atratividade"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Ponderação: 60% Probabilidade XGBoost + 30% Tendência + 10% Humor FinBERT"
								})] }), loadingStocks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calculando..." })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-primary/30 text-primary text-xs",
									children: "Atualização Diária"
								})]
							}), stockRanking.map((stock, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 p-4 hover:bg-surface-2/50 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold", idx === 0 ? "bg-primary text-primary-foreground font-black" : idx <= 2 ? "bg-gold-soft text-primary font-bold" : "bg-surface-2 text-muted-foreground"),
										children: ["#", idx + 1]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-base font-bold text-foreground",
												children: stock.ticker
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] py-0",
												children: stock.setor
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												stock.nome,
												" · R$ ",
												typeof stock.preco === "number" ? stock.preco.toFixed(2) : stock.preco
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-black text-gradient-gold",
											children: [stock.score_final, " pts"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-success font-medium flex items-center justify-end gap-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), stock.decisao]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/ativo/${stock.ticker}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "gap-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analisar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
										})
									})
								]
							}, stock.ticker))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "ranking",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "surface-card divide-y divide-border overflow-hidden",
							children: userRanking.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5", r.name === userProfile.name && "bg-gold-soft"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold", r.pos <= 3 ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"),
										children: r.pos
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold",
										children: r.initials
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: r.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												r.badge,
												" · ",
												r.streak,
												" meses seguidos"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-sm font-bold text-primary",
										children: [r.points, " pts"]
									})
								]
							}, r.pos))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "badges",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
							children: badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("surface-card flex items-center gap-3 p-4", !b.earned && "opacity-55"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", b.earned ? "bg-gold-soft text-primary" : "bg-surface-2 text-muted-foreground"),
									children: b.earned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: b.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: b.desc
									})]
								})]
							}, b.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5 text-primary" }), "Conquistas desbloqueiam molduras de perfil exclusivas nas ligas."]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { RankingPage as component };
