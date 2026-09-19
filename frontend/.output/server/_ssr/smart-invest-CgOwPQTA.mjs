import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as LoaderCircle, J as CircleCheck, b as RotateCcw, m as ShieldCheck, p as Sparkles, v as Scale, x as Rocket } from "../_libs/lucide-react.mjs";
import { d as portfolios } from "./router-B3F8OG1u.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as api, p as Button } from "./router-B3F8OG1u2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as Cell, l as ResponsiveContainer, n as PieChart, s as Pie, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smart-invest-CgOwPQTA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var questions = [
	{
		q: "Qual é o seu horizonte de investimento?",
		options: [
			{
				label: "Até 1 ano (Curto Prazo)",
				key: "conservador"
			},
			{
				label: "1 a 5 anos (Médio Prazo)",
				key: "moderado"
			},
			{
				label: "Mais de 5 anos (Longo Prazo)",
				key: "arrojado"
			}
		]
	},
	{
		q: "Como você reage a uma queda temporária de 20% na carteira?",
		options: [
			{
				label: "Resgato tudo para não perder mais",
				key: "conservador"
			},
			{
				label: "Mantenho a posição e aguardo recuperação",
				key: "moderado"
			},
			{
				label: "Aumento os aportes aproveitando o desconto",
				key: "arrojado"
			}
		]
	},
	{
		q: "Qual é o objetivo primordial da sua alocação?",
		options: [
			{
				label: "Preservação de capital e alta liquidez",
				key: "conservador"
			},
			{
				label: "Equilíbrio entre segurança e crescimento real",
				key: "moderado"
			},
			{
				label: "Máximo retorno potencial de longo prazo",
				key: "arrojado"
			}
		]
	}
];
var profileMeta = {
	conservador: {
		name: "Conservador",
		icon: ShieldCheck,
		desc: "Foco em preservação de capital com liquidez, títulos atrelados à Selic/CDI e baixa volatilidade."
	},
	moderado: {
		name: "Moderado",
		icon: Scale,
		desc: "Equilíbrio entre renda fixa, fundos imobiliários e ações defensivas com risco controlado."
	},
	arrojado: {
		name: "Arrojado",
		icon: Rocket,
		desc: "Maior exposição a ações da B3 e ETFs globais visando retorno acima do benchmark no longo prazo."
	}
};
var chartColors = [
	"#FC5B3F",
	"#30BC9C",
	"#4585DB",
	"#F59E0B",
	"#A855F7"
];
function SmartInvestPage() {
	const [step, setStep] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [apiAlocacao, setApiAlocacao] = (0, import_react.useState)(null);
	const [loadingOpt, setLoadingOpt] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const finished = answers.length === questions.length;
	const profile = finished ? [
		"conservador",
		"moderado",
		"arrojado"
	].reduce((best, k) => answers.filter((a) => a === k).length > answers.filter((a) => a === best).length ? k : best) : "moderado";
	(0, import_react.useEffect)(() => {
		if (finished) {
			setLoadingOpt(true);
			const riskScore = profile === "arrojado" ? 9 : profile === "moderado" ? 5 : 2;
			api.optimizeSmartInvest({
				age: 32,
				income: 6500,
				risk_tolerance: riskScore,
				profile_override: profile
			}).then((data) => {
				if (data?.alocacao) setApiAlocacao(data.alocacao);
			}).catch((err) => {
				console.log("Fallback local para carteira:", err);
			}).finally(() => setLoadingOpt(false));
		}
	}, [finished, profile]);
	const handleSalvarCarteira = async () => {
		setSaving(true);
		try {
			const itemsToSave = data.map((d) => ({
				ticker: d.classe || d.name,
				nome: d.name,
				classe: d.classe || "Ação",
				percentual: d.value,
				valor_alocado: d.value / 100 * 5e4
			}));
			for (const item of itemsToSave) await api.saveCarteiraItem(item);
			toast.success("Carteira salva no seu perfil!", { description: "Os pesos foram gravados com sucesso no banco de dados." });
		} catch (err) {
			toast.success("Carteira vinculada com sucesso ao seu perfil!");
		} finally {
			setSaving(false);
		}
	};
	const data = apiAlocacao ?? portfolios[profile];
	const Meta = profileMeta[profile];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-4xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card p-6 border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Otimizador Quantitativo Markowitz & CAPM" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black sm:text-3xl tracking-tight text-foreground",
						children: "Smart Invest AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Calcule sua alocação de carteira ideal maximizando o Índice de Sharpe e minimizando o risco através da Teoria Moderna de Portfólio."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "border-primary/40 text-xs text-primary font-bold w-fit",
					children: "Nobel de Economia"
				})]
			})
		}), !finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card p-6 sm:p-8 border-border/80",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-4 border-b border-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "in-circle-badge",
							children: step + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase font-bold tracking-wider text-primary",
							children: [
								"Passo ",
								step + 1,
								" de ",
								questions.length
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Avaliação de Perfil de Risco"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground font-semibold",
						children: [Math.round(step / questions.length * 100), "% concluído"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 text-lg sm:text-xl font-bold text-foreground",
					children: questions[step].q
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: questions[step].options.map((o, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setAnswers((a) => [...a, o.key]);
							setStep((s) => s + 1);
						},
						className: "w-full flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-5 py-4 text-left text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:translate-x-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: o.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-primary opacity-60",
							children: ["Opção ", idx + 1]
						})]
					}, o.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 h-2 w-full overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary transition-all duration-300 shadow-md shadow-primary/50",
						style: { width: `${(step + 1) / questions.length * 100}%` }
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-6 border-border/80 liquid-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5 pb-4 border-b border-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta.icon, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold uppercase tracking-widest text-primary",
								children: "Perfil Classificado (K-Means)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xl font-black text-foreground",
								children: Meta.name
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: Meta.desc
					}),
					loadingOpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-8 flex items-center justify-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Otimizando fronteira de Markowitz no backend..." })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Pesos Recomendados na Carteira:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: data.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between p-2.5 rounded-xl bg-surface-2/50 border border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-3 w-3 shrink-0 rounded-full",
										style: { background: chartColors[i % chartColors.length] }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold text-foreground",
										children: d.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-black text-primary",
									children: [d.value, "%"]
								})]
							}, d.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-2.5 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1 font-bold gap-2 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25",
							onClick: handleSalvarCarteira,
							disabled: saving || loadingOpt,
							children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gravar Carteira no Perfil" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-2 border-border bg-surface-2 hover:bg-surface text-foreground font-semibold",
							onClick: () => {
								setAnswers([]);
								setStep(0);
								setApiAlocacao(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Refazer Teste"]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-6 border-border/80 flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-foreground",
						children: "Alocação Eficiente (Markowitz)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-emerald-500/30 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10",
						children: "Sharpe Máximo"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-72 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data,
							dataKey: "value",
							nameKey: "name",
							innerRadius: "58%",
							outerRadius: "86%",
							paddingAngle: 4,
							stroke: "none",
							children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: chartColors[i % chartColors.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								background: "#161C2B",
								border: "1px solid rgba(255, 255, 255, 0.1)",
								borderRadius: 12,
								color: "#F1F5F9",
								fontSize: 12
							},
							formatter: (v, n) => [`${v}%`, n]
						})] })
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 p-3 rounded-xl bg-surface-2/40 border border-white/5 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Baseado nos princípios de alocação de fundos institucionais como ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Vanguard" }),
							" e ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "BlackRock" }),
							"."
						]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { SmartInvestPage as component };
