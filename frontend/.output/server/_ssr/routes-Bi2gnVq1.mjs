import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as LoaderCircle, H as Heart, L as Layers, O as MessageSquare, W as Flame, at as Building2, c as Trophy, d as Trash2, g as Send, h as Share2, l as TrendingUp, lt as Award, m as ShieldCheck, p as Sparkles, rt as ChartColumn, t as Zap, ut as ArrowRight, z as Image } from "../_libs/lucide-react.mjs";
import { b as DialogTrigger, g as DialogContent, h as Dialog, n as UploadProofDialog, o as currentUser, p as ranking, r as assets, v as DialogHeader, y as DialogTitle } from "./router-B3F8OG1u.mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as Input, m as cn, n as api, p as Button } from "./router-B3F8OG1u2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bi2gnVq1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var famousFirms = [
	{
		name: "BlackRock",
		tag: "Maior Gestora Global",
		badge: "US$ 10 Tri AUM",
		highlight: "Modelos de Risco Aladdin & iShares"
	},
	{
		name: "Vanguard",
		tag: "Pioneira em ETFs & Alocação",
		badge: "Bogleheads Benchmark",
		highlight: "Filosofia Passiva de Baixo Custo"
	},
	{
		name: "Berkshire Hathaway",
		tag: "Value Investing Clássico",
		badge: "Buffett & Munger",
		highlight: "Foco em Moats Econômicos"
	},
	{
		name: "Goldman Sachs",
		tag: "Research Quantitativo",
		badge: "Global Asset Mgmt",
		highlight: "Estratégias Macro & Equities"
	},
	{
		name: "BTG Pactual",
		tag: "Líder LatAm",
		badge: "Investment Banking",
		highlight: "Mesa de Operações & Renda Fixa"
	},
	{
		name: "XP Investimentos",
		tag: "Ecossistema B3",
		badge: "Líder de Varejo B3",
		highlight: "Acesso Amplo ao Mercado Brasileiro"
	},
	{
		name: "B3 (Bolsa do Brasil)",
		tag: "Infraestrutura Oficial",
		badge: "Regulada CVM",
		highlight: "Ibovespa, IFIX & Ações Listadas"
	},
	{
		name: "Itaú BBA",
		tag: "Institucional",
		badge: "Corporate & Investment",
		highlight: "Cobertura de Ações & Valuation"
	}
];
function InstitutionalPartnersBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-4 sm:p-5 overflow-hidden relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center justify-center p-1.5 rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-foreground",
						children: "Referências & Metodologias Institucionais"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Padrão CVM & B3"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: "Nossos algoritmos de Markowitz, K-Means e Machine Learning são calibrados seguindo as melhores práticas das maiores gestoras e bancos de investimento do mundo."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] font-semibold text-primary flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5" }), "Wall St & Faria Lima"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
			children: famousFirms.map((firm, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative rounded-xl border border-white/5 bg-[#0D1119] p-3 transition-all duration-200 hover:border-primary/40 hover:bg-[#131924] hover:-translate-y-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors",
							children: firm.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded",
							children: firm.badge
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-muted-foreground mt-1 truncate",
						children: firm.tag
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-muted-foreground/70 mt-0.5 truncate flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-2.5 w-2.5 text-emerald-400" }), firm.highlight]
					})
				]
			}, idx))
		})]
	});
}
function FeedPage() {
	if (!(typeof window !== "undefined" && localStorage.getItem("auth_token") !== null)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		replace: true
	});
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [loadingPosts, setLoadingPosts] = (0, import_react.useState)(true);
	const [newPostText, setNewPostText] = (0, import_react.useState)("");
	const [publishing, setPublishing] = (0, import_react.useState)(false);
	const [likedMap, setLikedMap] = (0, import_react.useState)({});
	const [likesCountMap, setLikesCountMap] = (0, import_react.useState)({});
	const [userProfile, setUserProfile] = (0, import_react.useState)(currentUser);
	const [rankingList, setRankingList] = (0, import_react.useState)(ranking);
	const [marketAssets, setMarketAssets] = (0, import_react.useState)(assets);
	const carregarDados = async () => {
		try {
			const postsData = await api.getPosts();
			if (Array.isArray(postsData) && postsData.length > 0) {
				setPosts(postsData);
				const countMap = {};
				postsData.forEach((p) => {
					countMap[p.id] = p.likes;
				});
				setLikesCountMap(countMap);
			}
		} catch (err) {
			console.log("Usando posts fallback:", err);
		} finally {
			setLoadingPosts(false);
		}
		try {
			const profileData = await api.getProfile();
			if (profileData?.dados) setUserProfile(profileData.dados);
		} catch (err) {
			console.log("Erro ao carregar perfil:", err);
		}
		try {
			const rankingData = await api.getUserRanking();
			if (Array.isArray(rankingData) && rankingData.length > 0) setRankingList(rankingData);
		} catch (err) {
			console.log("Erro ao carregar ranking:", err);
		}
		try {
			const homeData = await api.getHomeDashboard();
			if (homeData?.acoes_em_alta && homeData.acoes_em_alta.length > 0) setMarketAssets(homeData.acoes_em_alta.map((a) => ({
				ticker: a.ticker,
				name: a.nome || a.ticker,
				price: a.preco || 35,
				change: a.alta || 1.5,
				sector: a.setor || "B3"
			})));
		} catch (err) {
			console.log("Erro ao carregar home dashboard:", err);
		}
	};
	(0, import_react.useEffect)(() => {
		carregarDados();
	}, []);
	const handlePublishPost = async () => {
		const text = newPostText.trim();
		if (!text || publishing) return;
		setPublishing(true);
		try {
			await api.createPost({
				conteudo: text,
				tag: "Análise",
				comprovante: false
			});
			toast.success("Publicado no feed com sucesso!");
			setNewPostText("");
			const updatedPosts = await api.getPosts();
			setPosts(updatedPosts);
		} catch (err) {
			toast.error(err.message || "Erro ao publicar");
		} finally {
			setPublishing(false);
		}
	};
	const handleLike = async (postId) => {
		const isCurrentlyLiked = likedMap[postId] || false;
		const currentCount = likesCountMap[postId] || 0;
		setLikedMap((prev) => ({
			...prev,
			[postId]: !isCurrentlyLiked
		}));
		setLikesCountMap((prev) => ({
			...prev,
			[postId]: isCurrentlyLiked ? Math.max(currentCount - 1, 0) : currentCount + 1
		}));
		try {
			await api.toggleLikePost(postId);
		} catch (err) {
			setLikedMap((prev) => ({
				...prev,
				[postId]: isCurrentlyLiked
			}));
			setLikesCountMap((prev) => ({
				...prev,
				[postId]: currentCount
			}));
		}
	};
	const handleDeletePost = async (postId) => {
		if (!window.confirm("Tem certeza que deseja excluir esta publicação?")) return;
		try {
			await api.deletePost(postId);
			toast.success("Publicação excluída com sucesso!");
			setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
		} catch (err) {
			toast.error(err.message || "Erro ao excluir publicação.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#161C2A] via-[#10141E] to-[#0D1017] p-6 sm:p-8 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "Liquid Invest Logo",
								className: "h-64 w-64 object-contain drop-shadow-[0_0_40px_rgba(252,91,63,0.35)] opacity-95 animate-pulse",
								style: { animationDuration: "4s" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fintech Quantitativa & Social da B3" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-2xl font-black sm:text-4xl tracking-tight leading-tight text-foreground",
									children: [
										"Economize tempo. Obtenha",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#FF755C] to-[#FFA085]",
											children: "maior rentabilidade"
										}),
										". Multiplique seu patrimônio."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed",
									children: "Junte-se à comunidade de investidores inteligentes. Aporte todo mês com comprovante verificado, acumule pontos nas ligas e receba teses preditivas por inteligência artificial."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/smart-invest",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											className: "bg-primary hover:bg-[#E04B30] text-white font-bold gap-2 px-5 shadow-lg shadow-primary/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Simular Carteira Markowitz" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/mercado",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "border-border bg-surface-2/60 hover:bg-surface-2 text-foreground font-semibold",
											children: "Explorar Ações B3"
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/5 pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-foreground",
											children: "Multi-Ativos B3"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-snug",
										children: "Ações, FIIs, Renda Fixa e ETFs consolidados em um só ambiente."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-foreground",
											children: "Machine Learning"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-snug",
										children: "Classificação preditiva de momentum, RSI, volatilidade e notícias."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/5 bg-surface/50 p-3.5 hover:border-primary/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 text-sky-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-foreground",
											children: "Aportes Verificados"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-snug",
										children: "Gamificação com pontuação real comprovada e subida de nível."
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4 sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center sm:text-left mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
							children: "Passos simples para acelerar seus investimentos"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "in-circle-badge shrink-0",
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground",
									children: "Faça o Aporte Mensal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Envie o print ou nota de corretagem no feed para comprovação."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "in-circle-badge shrink-0",
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground",
									children: "Ganhe Pontos na Liga"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Suba no ranking de consistência e desbloqueie badges exclusivas."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 p-3 rounded-xl bg-surface-2/40 border border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "in-circle-badge shrink-0",
									children: "3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground",
									children: "Otimize com IA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Receba pesos ótimos de carteira calculados por Markowitz e K-Means."
								})] })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstitutionalPartnersBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold sm:text-2xl text-foreground",
						children: "Feed da Comunidade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "Aportes auditados, teses e discussões em tempo real com outros investidores."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-primary/40 bg-primary/10 text-primary text-xs font-semibold",
						children: [posts.length, " publicações ativas"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card p-4 sm:p-5 border-border/80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 border border-white/10 text-xs font-bold text-primary",
							children: userProfile.initials || "US"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: newPostText,
								onChange: (e) => setNewPostText(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handlePublishPost();
									}
								},
								placeholder: "Compartilhe seu aporte, análise ou dúvida com a comunidade...",
								className: "min-h-20 resize-none border-0 bg-transparent px-0 text-sm sm:text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadProofDialog, {
									onSuccess: () => {
										carregarDados();
									},
									trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Anexar comprovante de aporte (+1 ponto)" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "font-bold gap-1.5 bg-primary hover:bg-[#E04B30] text-white px-4 shadow-md shadow-primary/20",
									onClick: handlePublishPost,
									disabled: publishing || !newPostText.trim(),
									children: [publishing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Publicar no Feed" })]
								})]
							})]
						})]
					})
				}),
				loadingPosts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex items-center justify-center p-12 text-muted-foreground gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Carregando publicações..." })]
				}) : posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card p-10 text-center text-muted-foreground",
					children: "Nenhuma publicação encontrada. Seja o primeiro a postar!"
				}) : posts.map((post) => {
					const isLiked = likedMap[post.id] || false;
					const currentLikes = likesCountMap[post.id] !== void 0 ? likesCountMap[post.id] : post.likes;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "surface-card p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold",
										children: post.initials
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: post.author
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												post.handle,
												" · ",
												post.time
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "shrink-0 border-primary/30 text-primary",
											children: post.tag
										}), post.handle === userProfile.handle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeletePost(post.id),
											className: "text-muted-foreground hover:text-destructive transition-colors",
											title: "Excluir publicação",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap",
								children: post.content
							}),
							post.proof && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 overflow-hidden rounded-xl border border-border bg-surface-2/60",
								children: [post.proof_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative max-h-80 w-full overflow-hidden bg-black/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: post.proof_url,
										alt: "Comprovante de Aporte",
										className: "h-full w-full object-contain mx-auto max-h-72"
									})
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: "Comprovante de aporte verificado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: "+1 ponto computado na base de dados"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
								className: "mt-4 flex items-center gap-1 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleLike(post.id),
										className: cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2", isLiked && "text-primary font-semibold"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4", isLiked && "fill-current text-primary") }), currentLikes]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentModal, { post }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											navigator.clipboard.writeText(window.location.href);
											toast.success("Link copiado para a área de transferência!");
										},
										className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-surface-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" }), "Compartilhar"]
									})
								]
							})
						]
					}, post.id);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden space-y-5 xl:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Seu progresso"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-xs text-primary font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5" }),
									userProfile.streak || 8,
									" meses"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-display text-3xl font-bold text-gradient-gold",
							children: [userProfile.points || 34, " pts"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Nível ",
								userProfile.level || 6,
								" · ",
								userProfile.levelName || "Investidor Consistente"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: (userProfile.points || 34) / (userProfile.nextLevelAt || 40) * 100,
							className: "mt-3 h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"Faltam ",
								Math.max((userProfile.nextLevelAt || 40) - (userProfile.points || 34), 0),
								" pontos para o nível",
								" ",
								(userProfile.level || 6) + 1
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Liga de Investidores"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2.5",
							children: rankingList.slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-4 text-xs font-bold text-muted-foreground",
										children: r.pos
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-primary",
										children: [r.points, " pts"]
									})
								]
							}, r.pos))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ranking",
							className: "mt-4 block text-center text-xs font-medium text-primary hover:underline",
							children: "Ver ranking completo"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), "Em destaque no mercado"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2.5",
						children: marketAssets.slice(0, 4).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ativo/$ticker",
							params: { ticker: a.ticker },
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-medium",
								children: a.ticker
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("text-xs font-semibold", a.change >= 0 ? "text-success" : "text-destructive"),
								children: [
									a.change >= 0 ? "+" : "",
									typeof a.change === "number" ? a.change.toFixed(2) : a.change,
									"%"
								]
							})]
						}) }, a.ticker))
					})]
				})
			]
		})]
	});
}
function CommentModal({ post }) {
	const [comentarios, setComentarios] = (0, import_react.useState)([]);
	const [novoComentario, setNovoComentario] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const carregarComentarios = () => {
		api.getComments(post.id).then((res) => setComentarios(res || [])).catch(() => console.log("Nenhum comentário encontrado"));
	};
	(0, import_react.useEffect)(() => {
		carregarComentarios();
	}, [post.id]);
	const handleEnviar = async () => {
		if (!novoComentario.trim()) return;
		setLoading(true);
		try {
			await api.addComment(post.id, novoComentario);
			setNovoComentario("");
			toast.success("Comentário salvo!");
			carregarComentarios();
		} catch (err) {
			toast.error("Erro ao salvar comentário.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex items-center gap-1.5 transition-colors hover:text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: comentarios.length || post.comments || 0 })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-md bg-surface border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Comentários" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-h-[50vh] flex-col gap-4 overflow-y-auto p-1 pr-2",
				children: comentarios.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground text-center py-4",
					children: "Nenhum comentário ainda. Seja o primeiro!"
				}) : comentarios.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold text-foreground uppercase",
						children: c.autor_initials || (c.autor_nome ? c.autor_nome.charAt(0) : "IA")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 rounded-xl bg-surface-2/50 p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-baseline gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: c.autor_nome || "Investidor Anônimo"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-foreground/90",
							children: c.conteudo
						})]
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Escreva um comentário...",
					value: novoComentario,
					onChange: (e) => setNovoComentario(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && handleEnviar(),
					className: "flex-1 bg-surface-2/50",
					disabled: loading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					onClick: handleEnviar,
					disabled: !novoComentario.trim() || loading,
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})
		]
	})] });
}
//#endregion
export { FeedPage as component };
