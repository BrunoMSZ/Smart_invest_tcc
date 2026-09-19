import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as RefreshCcw, Y as CircleAlert, d as Trash2, tt as ChartPie, w as Plus, y as Save } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as SelectItem, f as Input, l as SelectTrigger, m as cn, o as Select, p as Button, s as SelectContent, u as SelectValue } from "./router-B3F8OG1u2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carteira-BVEgXuOe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var carteirasSugeridas = {
	conservador: [
		{
			id: "1",
			nome: "Tesouro Selic 2027",
			tipo: "Renda Fixa",
			percentual: 60
		},
		{
			id: "2",
			nome: "Tesouro IPCA+ 2035",
			tipo: "Renda Fixa",
			percentual: 25
		},
		{
			id: "3",
			nome: "KNCR11",
			tipo: "FIIs",
			percentual: 10
		},
		{
			id: "4",
			nome: "BOVA11",
			tipo: "ETFs",
			percentual: 5
		}
	],
	moderado: [
		{
			id: "1",
			nome: "Tesouro IPCA+",
			tipo: "Renda Fixa",
			percentual: 35
		},
		{
			id: "2",
			nome: "ITUB4",
			tipo: "Ações",
			percentual: 15
		},
		{
			id: "3",
			nome: "WEGE3",
			tipo: "Ações",
			percentual: 15
		},
		{
			id: "4",
			nome: "HGLG11",
			tipo: "FIIs",
			percentual: 20
		},
		{
			id: "5",
			nome: "IVVB11",
			tipo: "ETFs",
			percentual: 15
		}
	],
	arrojado: [
		{
			id: "1",
			nome: "WEGE3",
			tipo: "Ações",
			percentual: 25
		},
		{
			id: "2",
			nome: "PETR4",
			tipo: "Ações",
			percentual: 20
		},
		{
			id: "3",
			nome: "VISC11",
			tipo: "FIIs",
			percentual: 20
		},
		{
			id: "4",
			nome: "HASH11",
			tipo: "Cripto",
			percentual: 15
		},
		{
			id: "5",
			nome: "Tesouro Selic (Reserva)",
			tipo: "Renda Fixa",
			percentual: 20
		}
	]
};
var coresPorTipo = {
	"Renda Fixa": "bg-[#4585DB]",
	"Ações": "bg-[#FC5B3F]",
	"FIIs": "bg-[#30BC9C]",
	"ETFs": "bg-[#A855F7]",
	"Cripto": "bg-[#F59E0B]"
};
function CarteiraPage() {
	const [perfil, setPerfil] = (0, import_react.useState)("moderado");
	const [ativos, setAtivos] = (0, import_react.useState)(carteirasSugeridas["moderado"] || []);
	const totalPercentual = (0, import_react.useMemo)(() => {
		return ativos.reduce((acc, ativo) => acc + (Number(ativo.percentual) || 0), 0);
	}, [ativos]);
	const diferenca = 100 - totalPercentual;
	const handleMudarPerfil = (novoPerfil) => {
		setPerfil(novoPerfil);
		setAtivos([...carteirasSugeridas[novoPerfil] || []]);
		toast.info(`Carteira rebalanceada para o perfil ${novoPerfil.charAt(0).toUpperCase() + novoPerfil.slice(1)}`);
	};
	const atualizarAtivo = (id, campo, valor) => {
		setAtivos((prev) => prev.map((ativo) => ativo.id === id ? {
			...ativo,
			[campo]: valor
		} : ativo));
	};
	const removerAtivo = (id) => {
		setAtivos((prev) => prev.filter((ativo) => ativo.id !== id));
	};
	const adicionarAtivo = () => {
		const novoId = Math.random().toString(36).substring(2, 9);
		setAtivos([...ativos, {
			id: novoId,
			nome: "",
			tipo: "Ações",
			percentual: 0
		}]);
	};
	const salvarCarteira = async () => {
		if (totalPercentual !== 100) {
			toast.error("A soma dos percentuais deve ser exatamente 100%.");
			return;
		}
		toast.success("Carteira salva com sucesso!", { description: "Sua alocação ideal foi atualizada." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "surface-card p-6 border-border/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-black tracking-tight text-foreground",
					children: "Carteira Ideal de Investimentos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-1 text-sm",
					children: "Defina sua alocação alvo balanceada. O motor de risco quantitativo utilizará essas proporções para orientar seus próximos aportes."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "surface-card border-border/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base font-bold flex items-center gap-2 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-5 h-5 text-primary" }), "Perfil de Alocação de Referência"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
					className: "text-xs text-muted-foreground",
					children: "Altere seu perfil para carregar a sugestão parametrizada segundo referências institucionais (XP, BTG Pactual e Vanguard)."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-4 items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 w-full sm:w-1/2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: perfil,
							onValueChange: handleMudarPerfil,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um perfil" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "conservador",
									children: "Conservador (Foco em Renda Fixa)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "moderado",
									children: "Moderado (Equilíbrio e Dividendos)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "arrojado",
									children: "Arrojado (Crescimento e Risco)"
								})
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => handleMudarPerfil(perfil),
						className: "gap-2 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "w-4 h-4" }), "Restaurar Sugestão"]
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/50 bg-surface/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-lg",
					children: "Composição da Carteira"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Adicione, remova ou edite o peso de cada ativo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alocação Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: totalPercentual === 100 ? "text-success" : "text-destructive",
										children: [totalPercentual.toFixed(1), "% / 100%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-3 w-full overflow-hidden rounded-full bg-surface-2",
									children: ativos.map((ativo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { width: `${ativo.percentual}%` },
										className: `h-full ${coresPorTipo[ativo.tipo] || "bg-primary"} transition-all duration-500`,
										title: `${ativo.nome}: ${ativo.percentual}%`
									}, ativo.id))
								}),
								totalPercentual !== 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-destructive flex items-center gap-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3 h-3" }), diferenca > 0 ? `Falta alocar ${diferenca.toFixed(1)}% na sua carteira.` : `Você ultrapassou ${(diferenca * -1).toFixed(1)}% do limite.`]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-4",
							children: ativos.map((ativo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-12 gap-3 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-5 sm:col-span-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: ativo.nome,
											onChange: (e) => atualizarAtivo(ativo.id, "nome", e.target.value),
											placeholder: "Ex: PETR4",
											className: "bg-background/50"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-4 sm:col-span-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: ativo.tipo,
											onValueChange: (val) => atualizarAtivo(ativo.id, "tipo", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Renda Fixa",
													children: "Renda Fixa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Ações",
													children: "Ações"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "FIIs",
													children: "FIIs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "ETFs",
													children: "ETFs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Cripto",
													children: "Cripto"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2 sm:col-span-2 relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: ativo.percentual,
											onChange: (e) => atualizarAtivo(ativo.id, "percentual", Number(e.target.value)),
											className: "bg-background/50 pr-6"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute right-3 top-2.5 text-sm text-muted-foreground",
											children: "%"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-1 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => removerAtivo(ativo.id),
											className: "text-muted-foreground hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})
									})
								]
							}, ativo.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: adicionarAtivo,
							className: "w-full border-dashed gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Adicionar Novo Ativo"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					onClick: salvarCarteira,
					disabled: totalPercentual !== 100,
					className: "gap-2 font-bold w-full sm:w-auto bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), "Salvar Carteira"]
				})
			})
		]
	});
}
//#endregion
export { CarteiraPage as component };
