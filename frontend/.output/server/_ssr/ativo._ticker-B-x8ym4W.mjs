import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Newspaper, F as LoaderCircle, dt as ArrowLeft, l as TrendingUp, p as Sparkles, st as Bot, u as TrendingDown } from "../_libs/lucide-react.mjs";
import { f as priceSeries, r as assets, t as Route } from "./router-B3F8OG1u.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn, p as Button } from "./router-B3F8OG1u2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
import { a as Area, i as XAxis, l as ResponsiveContainer, o as CartesianGrid, r as YAxis, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ativo._ticker-B-x8ym4W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ranges = [
	"1D",
	"1S",
	"1M",
	"6M",
	"1A",
	"5A"
];
function AssetPage() {
	const { ticker } = Route.useParams();
	const asset = assets.find((a) => a.ticker === ticker.toUpperCase()) ?? assets[0];
	const [range, setRange] = (0, import_react.useState)("1M");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [aiData, setAiData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		setLoading(true);
		fetch(`http://localhost:8000/api/analyze/${ticker}`).then((res) => {
			if (!res.ok) throw new Error("Erro na API");
			return res.json();
		}).then((data) => {
			if (isMounted) setAiData(data);
		}).catch((err) => {
			console.log("API local não disponível, usando fallback:", err);
		}).finally(() => {
			if (isMounted) setLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, [ticker]);
	const quant = aiData?.dados_quantitativos;
	const preco = quant?.preco_atual ?? asset.price;
	const score = quant?.score_final ?? 78;
	const decisao = quant?.decisao_sugerida ?? "COMPRA";
	const probMl = quant?.prob_ml ? Math.round(quant.prob_ml * 100) : 72;
	const parecerIA = aiData?.orquestracao_ia?.parecer_executivo;
	const humorNoticias = aiData?.sentimento_noticias?.score_humor_liquido ?? .45;
	const noticias = aiData?.sentimento_noticias?.noticias ?? [];
	const indicators = [
		{
			label: "RSI (14)",
			value: quant?.rsi ? String(quant.rsi) : "58,2",
			hint: (quant?.rsi ?? 58) > 70 ? "Sobrecomprado" : (quant?.rsi ?? 58) < 30 ? "Sobrevendido" : "Neutro"
		},
		{
			label: "Dist. MM 21",
			value: quant?.ma_21_dist ? `${(quant.ma_21_dist * 100).toFixed(1)}%` : "+2,4%",
			hint: "Curto Prazo"
		},
		{
			label: "Dist. MM 200",
			value: quant?.ma_200_dist ? `${(quant.ma_200_dist * 100).toFixed(1)}%` : "+8,3%",
			hint: "Longo Prazo"
		},
		{
			label: "Volatilidade (30d)",
			value: quant?.vol_30 ? `${(quant.vol_30 * 100).toFixed(1)}%` : "22,0%",
			hint: "Risco Anualizado"
		},
		{
			label: "Momentum (63d)",
			value: quant?.momentum_63 ? `${(quant.momentum_63 * 100).toFixed(1)}%` : "+7,5%",
			hint: "Trimestre"
		},
		{
			label: "Taxa Selic",
			value: quant?.selic_anual ? `${quant.selic_anual}% a.a.` : "10,5% a.a.",
			hint: "Benchmark Macro"
		}
	];
	const up = asset.change >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/mercado",
				className: "inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Voltar para o mercado"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "surface-card p-5 sm:p-6 border-border/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 mb-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-3xl font-black tracking-tight sm:text-4xl text-foreground",
									children: ticker.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-primary/40 bg-primary/10 text-xs font-semibold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1" }), "Predição Quantitativa IA"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-white/10 bg-surface-2 text-xs text-muted-foreground",
									children: "B3 · Bolsa Brasileira"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted-foreground",
							children: [
								asset.name,
								" · Setor: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground/90",
									children: asset.sector
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground block sm:hidden",
							children: "Cotação Atual"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl sm:text-3xl font-black text-foreground",
							children: ["R$ ", preco.toFixed(2)]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("inline-flex items-center gap-1 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg", up ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"),
							children: [
								up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }),
								up ? "+" : "",
								asset.change.toFixed(2),
								"%"
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-4 sm:p-6 border-border/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-primary animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Série Temporal & Médias Móveis"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: ranges.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRange(r),
							className: cn("rounded-lg px-3 py-1.5 text-xs font-bold transition-all", range === r ? "bg-primary text-white shadow-md shadow-primary/25" : "text-muted-foreground bg-surface-2/60 hover:bg-surface-2 hover:text-foreground border border-white/5"),
							children: r
						}, r))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full sm:h-80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: priceSeries,
							margin: {
								left: -18,
								right: 8,
								top: 8,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "fill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-primary)",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-primary)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "var(--color-muted-foreground)",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: ["dataMin - 1", "dataMax + 1"],
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "var(--color-muted-foreground)",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--color-surface-2)",
										border: "1px solid var(--color-border)",
										borderRadius: 12,
										color: "var(--color-foreground)",
										fontSize: 12
									},
									labelStyle: { color: "var(--color-muted-foreground)" },
									formatter: (v) => [`R$ ${v.toFixed(2)}`, "Preço"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "p",
									stroke: "var(--color-primary)",
									strokeWidth: 2,
									fill: "url(#fill)"
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Indicadores técnicos & quantitativos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-3",
						children: indicators.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface-2/50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] uppercase tracking-wide text-muted-foreground",
									children: i.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate text-base font-semibold",
									children: i.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-primary",
									children: i.hint
								})
							]
						}, i.label))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card gold-glow p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), "Previsibilidade do Modelo (ML)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-display text-5xl font-bold text-gradient-gold",
							children: score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Score Composto (0–100)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: score,
							className: "mt-4 h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: cn("hover:opacity-90", decisao.includes("COMPRA") ? "bg-success/15 text-success" : "bg-primary/15 text-primary"),
								children: ["Sinal: ", decisao]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-primary/30 text-primary",
								children: [
									"Confiança ",
									probMl,
									"%"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs leading-relaxed text-muted-foreground",
							children: ["Índice de Humor das Notícias (FinBERT): ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: humorNoticias > 0 ? `+${humorNoticias.toFixed(2)} (Otimista)` : `${humorNoticias.toFixed(2)} (Neutro/Defensivo)`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/chat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-4 w-full font-semibold gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }),
									"Perguntar à IA sobre ",
									ticker.toUpperCase()
								]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5 sm:p-6 border border-primary/20 bg-surface-1/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-gold-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Parecer Institucional do OpenRouter AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Síntese em tempo real: XGBoost Quantitativo + NLP FinBERT + LLM Gratuita"
						})] })]
					}), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gerando tese..." })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 text-sm leading-relaxed font-sans",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
						remarkPlugins: [remarkGfm],
						components: {
							h1: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 mb-4 text-2xl font-bold text-foreground",
								...props
							}),
							h2: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-5 mb-3 text-xl font-bold text-foreground",
								...props
							}),
							h3: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 mb-2 text-lg font-bold text-foreground",
								...props
							}),
							p: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-4 leading-relaxed text-muted-foreground",
								...props
							}),
							strong: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-semibold text-foreground",
								...props
							}),
							ul: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mb-4 list-disc pl-5 text-muted-foreground",
								...props
							}),
							ol: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mb-4 list-decimal pl-5 text-muted-foreground",
								...props
							}),
							li: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "mb-1",
								...props
							}),
							table: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-6 w-full overflow-x-auto rounded-lg border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full border-collapse text-sm",
									...props
								})
							}),
							thead: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-surface-2",
								...props
							}),
							th: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border p-3 text-left font-semibold text-foreground",
								...props
							}),
							td: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border p-3 text-foreground",
								...props
							})
						},
						children: parecerIA ? parecerIA : `O modelo aponta padrão consistente de assimetria para ${ticker.toUpperCase()}, sustentado pelo alinhamento das médias móveis e volume projetado. O índice de sentimento FinBERT confirma viés construtivo nas notícias recentes. Para gerar teses completas personalizadas com Llama 3.3 ou Gemini 2.0, conecte a API backend.`
					})
				})]
			}),
			noticias.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Últimas notícias processadas pelo FinBERT"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: noticias.map((n, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-border/70 bg-surface-2/40 flex items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground truncate",
							children: n.titulo
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: cn("shrink-0 text-[10px]", n.sentiment === "Positivo" ? "border-success/40 text-success" : "border-muted text-muted-foreground"),
							children: [
								n.sentiment,
								" (",
								n.sentiment_score ? n.sentiment_score > 0 ? `+${n.sentiment_score.toFixed(2)}` : n.sentiment_score.toFixed(2) : "0.00",
								")"
							]
						})]
					}, idx))
				})]
			})
		]
	});
}
//#endregion
export { AssetPage as component };
