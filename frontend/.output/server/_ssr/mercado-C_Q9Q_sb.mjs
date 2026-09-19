import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as LoaderCircle, U as Funnel, _ as Search, ft as Activity, l as TrendingUp, p as Sparkles, u as TrendingDown, ut as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as assets } from "./router-B3F8OG1u.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Input, m as cn, n as api } from "./router-B3F8OG1u2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mercado-C_Q9Q_sb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var filterTabs = [
	"Todos",
	"Ações B3",
	"FIIs",
	"ETFs",
	"Em Alta",
	"Em Baixa"
];
function MarketPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [selectedFilter, setSelectedFilter] = (0, import_react.useState)("Todos");
	const [assetList, setAssetList] = (0, import_react.useState)(assets);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setLoading(true);
		api.getStocks({ limit: 300 }).then((stocks) => {
			if (stocks && stocks.length > 0) {
				const list = stocks.map((a) => ({
					ticker: a.ticker,
					name: a.nome || a.ticker,
					price: a.preco || a.price || 35,
					change: a.change !== void 0 ? a.change : 0,
					sector: a.setor || "Mercado B3",
					classe: a.classe || "Ações B3"
				}));
				setAssetList(list);
			}
		}).catch((err) => {
			console.warn("[Mercado] Erro ao carregar ativos da base:", err);
		}).finally(() => setLoading(false));
	}, []);
	const results = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		if (!term) return [];
		return assetList.filter((a) => a.ticker.toLowerCase().includes(term) || a.name && a.name.toLowerCase().includes(term));
	}, [q, assetList]);
	const filteredAssets = (0, import_react.useMemo)(() => {
		if (selectedFilter === "Em Alta") return assetList.filter((a) => a.change >= 0);
		if (selectedFilter === "Em Baixa") return assetList.filter((a) => a.change < 0);
		if (selectedFilter === "FIIs") return assetList.filter((a) => a.classe === "FIIs" || a.ticker.endsWith("11") && a.sector?.toLowerCase().includes("fii"));
		if (selectedFilter === "ETFs") return assetList.filter((a) => a.classe === "ETFs");
		if (selectedFilter === "Ações B3") return assetList.filter((a) => a.classe === "Ações B3" || /^[A-Z]{4}(?:3|4|5|6)$/.test(a.ticker));
		return assetList;
	}, [assetList, selectedFilter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terminal Quantitativo B3" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold sm:text-3xl tracking-tight text-foreground",
						children: "Mercado Financeiro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Cotações em tempo real, filtros fundamentalistas e previsibilidade alimentada por Machine Learning."
					})
				] }), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground bg-surface-2/60 px-3 py-1.5 rounded-xl border border-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sincronizando cotações..." })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-3.5 border-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase text-muted-foreground tracking-wider",
								children: "Ativos Monitorados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg sm:text-xl font-bold text-foreground mt-0.5",
								children: [assetList.length, " Tickers"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-emerald-400 font-semibold",
								children: "100% Cobertura B3"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-3.5 border-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase text-muted-foreground tracking-wider",
								children: "Algoritmo ML"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-bold text-primary mt-0.5",
								children: "XGBoost & NLP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Sentimento + Técnico"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-3.5 border-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase text-muted-foreground tracking-wider",
								children: "Metodologia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-bold text-foreground mt-0.5",
								children: "Markowitz"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-sky-400",
								children: "Fronteira Eficiente"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-3.5 border-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase text-muted-foreground tracking-wider",
								children: "Auditoria"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-bold text-emerald-400 mt-0.5",
								children: "CVM / B3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Padrão Institucional"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && results[0]) navigate({
								to: "/ativo/$ticker",
								params: { ticker: results[0].ticker }
							});
						},
						placeholder: "Buscar por ticker ou empresa (ex: PETR4, VALE3, ITUB4, HGLG11, IVVB11)...",
						className: "h-14 rounded-2xl pl-12 pr-4 text-base bg-surface border-border focus-visible:border-primary focus-visible:ring-primary/30 shadow-lg"
					}),
					results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "surface-card absolute inset-x-0 top-16 z-20 max-h-80 overflow-y-auto p-2 shadow-2xl border-border bg-surface",
						children: results.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ativo/$ticker",
							params: { ticker: a.ticker },
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-surface-2 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-bold text-foreground",
									children: a.ticker
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: a.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm font-bold text-foreground",
									children: ["R$ ", typeof a.price === "number" ? a.price.toFixed(2) : a.price]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded", a.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"),
									children: [
										a.change >= 0 ? "+" : "",
										typeof a.change === "number" ? a.change.toFixed(2) : a.change,
										"%"
									]
								})]
							})]
						}) }, a.ticker))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border/80 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-primary" }), "Filtrar:"]
				}), filterTabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelectedFilter(tab),
					className: cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all", selectedFilter === tab ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface-2/60 text-muted-foreground hover:bg-surface-2 hover:text-foreground border border-white/5"),
					children: tab
				}, tab))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold text-muted-foreground uppercase tracking-wider",
					children: q ? "Resultados da busca" : `Ativos em Destaque (${filteredAssets.length})`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Clique no ativo para abrir o parecer da IA"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: filteredAssets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ativo/$ticker",
					params: { ticker: a.ticker },
					className: "surface-card group p-4 transition-all duration-200 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-bold text-base text-foreground group-hover:text-primary transition-colors",
										children: a.ticker
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-2 border border-white/5 text-muted-foreground",
										children: "B3"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground mt-0.5",
									children: a.name || a.sector
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold", a.change >= 0 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"),
								children: [
									a.change >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }),
									a.change >= 0 ? "+" : "",
									typeof a.change === "number" ? a.change.toFixed(2) : a.change,
									"%"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline justify-between pt-2 border-t border-white/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Preço Atual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold text-foreground",
								children: ["R$ ", typeof a.price === "number" ? a.price.toFixed(2) : a.price]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between text-[11px] text-primary/90 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }), "Score Quant & IA"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" })]
						})
					]
				}, a.ticker))
			})] })
		]
	});
}
//#endregion
export { MarketPage as component };
