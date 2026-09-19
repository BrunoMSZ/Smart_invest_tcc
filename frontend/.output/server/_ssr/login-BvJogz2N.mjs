import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as LoaderCircle, G as DollarSign, J as CircleCheck, P as Lock, a as User, it as Calendar, j as Mail, m as ShieldCheck, ut as ArrowRight } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as setStoredToken, c as SelectItem, d as Label, f as Input, l as SelectTrigger, n as api, o as Select, p as Button, s as SelectContent, u as SelectValue } from "./router-B3F8OG1u2.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BvJogz2N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("login");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loginEmail, setLoginEmail] = (0, import_react.useState)("");
	const [loginSenha, setLoginSenha] = (0, import_react.useState)("");
	const [regNome, setRegNome] = (0, import_react.useState)("");
	const [regEmail, setRegEmail] = (0, import_react.useState)("");
	const [regSenha, setRegSenha] = (0, import_react.useState)("");
	const [regIdade, setRegIdade] = (0, import_react.useState)("");
	const [regRenda, setRegRenda] = (0, import_react.useState)("");
	const [regPerfil, setRegPerfil] = (0, import_react.useState)("conservador");
	const handleLogin = async (e, customEmail, customSenha) => {
		if (e) e.preventDefault();
		const email = customEmail || loginEmail;
		const senha = customSenha || loginSenha;
		if (!email || !senha) {
			toast.error("Por favor, preencha e-mail e senha.");
			return;
		}
		setLoading(true);
		try {
			const res = await api.login(email.trim(), senha);
			if (res.status === "novo_cliente") {
				toast.info("E-mail não encontrado. Redirecionando para cadastro...");
				setRegEmail(email);
				setTab("register");
				return;
			}
			if (res.token) {
				setStoredToken(res.token);
				localStorage.setItem("auth_token", res.token);
			} else localStorage.setItem("auth_token", "mock_logado");
			const tempoExpiracao = (/* @__PURE__ */ new Date()).getTime() + 36e5;
			localStorage.setItem("auth_expires_at", tempoExpiracao.toString());
			toast.success("Login realizado com sucesso!", { description: `Bem-vindo de volta, ${res.usuario?.name || "Investidor"}!` });
			navigate({ to: "/" });
		} catch (err) {
			toast.error(err.message || "Erro ao realizar login. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};
	const handleRegister = async (e) => {
		e.preventDefault();
		if (!regNome.trim() || !regEmail.trim() || !regSenha.trim()) {
			toast.error("Preencha todos os campos obrigatórios.");
			return;
		}
		setLoading(true);
		try {
			const res = await api.register({
				nome: regNome.trim(),
				email: regEmail.trim(),
				senha: regSenha,
				idade: parseInt(regIdade) || 30,
				renda_mensal: parseFloat(regRenda) || 5e3,
				perfil_investidor: regPerfil
			});
			if (res.token) {
				setStoredToken(res.token);
				localStorage.setItem("auth_token", res.token);
			} else localStorage.setItem("auth_token", "mock_logado");
			const tempoExpiracao = (/* @__PURE__ */ new Date()).getTime() + 36e5;
			localStorage.setItem("auth_expires_at", tempoExpiracao.toString());
			toast.success("Conta criada!", { description: `Olá, ${res.usuario?.name || "Investidor"}! Perfil configurado como ${res.usuario?.perfil_investidor || regPerfil}. Vamos seguir para o questionário...` });
			navigate({ to: "/questionario" });
		} catch (err) {
			toast.error(err.message || "Erro ao cadastrar usuário. Verifique os dados.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 overflow-hidden selection:bg-primary/20 selection:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 w-full max-w-md space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-3 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "Liquid Invest Logo",
									className: "h-24 w-24 object-contain drop-shadow-[0_0_25px_rgba(252,91,63,0.35)] hover:scale-105 transition-transform duration-300"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black tracking-tight text-foreground",
									children: "LIQUID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-primary",
									children: "INVEST"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground",
								children: "Fintech Quantitativa & Rede Social B3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-white/5 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ref. Institucional: BlackRock · Vanguard · Berkshire · BTG · XP" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card liquid-glow p-6 sm:p-8 border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							value: tab,
							onValueChange: (v) => setTab(v),
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "grid w-full grid-cols-2 mb-6 bg-surface-2/60 border border-border p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "login",
										className: "font-bold data-[state=active]:bg-primary data-[state=active]:text-white",
										children: "Entrar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "register",
										className: "font-bold data-[state=active]:bg-primary data-[state=active]:text-white",
										children: "Criar Conta"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "login",
									className: "space-y-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleLogin,
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email_login",
													children: "E-mail"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "email_login",
														type: "email",
														required: true,
														placeholder: "seu@email.com",
														value: loginEmail,
														onChange: (e) => setLoginEmail(e.target.value),
														className: "pl-10"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "senha_login",
														children: "Senha"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[11px] text-muted-foreground" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "senha_login",
														type: "password",
														required: true,
														placeholder: "••••••••",
														value: loginSenha,
														onChange: (e) => setLoginSenha(e.target.value),
														className: "pl-10"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												className: "w-full font-bold gap-2 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25",
												disabled: loading,
												children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Entrando..." : "Acessar Plataforma" })]
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "register",
									className: "space-y-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleRegister,
										className: "space-y-3.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "reg_nome",
													children: "Nome Completo"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "reg_nome",
														required: true,
														placeholder: "Ex: João da Silva",
														value: regNome,
														onChange: (e) => setRegNome(e.target.value),
														className: "pl-10"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "reg_email",
													children: "E-mail"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "reg_email",
														type: "email",
														required: true,
														placeholder: "joao@exemplo.com",
														value: regEmail,
														onChange: (e) => setRegEmail(e.target.value),
														className: "pl-10"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "reg_senha",
													children: "Senha"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "reg_senha",
														type: "password",
														required: true,
														placeholder: "Mínimo 6 caracteres",
														value: regSenha,
														onChange: (e) => setRegSenha(e.target.value),
														className: "pl-10"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "reg_idade",
														children: "Idade"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "reg_idade",
															type: "number",
															min: 18,
															max: 100,
															value: regIdade,
															onChange: (e) => setRegIdade(e.target.value),
															className: "pl-9"
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "reg_renda",
														children: "Renda Mensal (R$)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "reg_renda",
															type: "number",
															value: regRenda,
															onChange: (e) => setRegRenda(e.target.value),
															className: "pl-9"
														})]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Perfil de Investimento Inicial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: regPerfil,
													onValueChange: setRegPerfil,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "conservador",
															children: "Conservador (Títulos / Selic)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "moderado",
															children: "Moderado (Equilibrado / FIIs)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "arrojado",
															children: "Arrojado (Ações / Renda Variável)"
														})
													] })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												className: "w-full font-bold gap-2 mt-4 bg-primary hover:bg-[#E04B30] text-white shadow-lg shadow-primary/25",
												disabled: loading,
												children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Cadastrando..." : "Criar Conta na Liquid Invest" })]
											})
										]
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(/* @__PURE__ */ new Date()).getFullYear(), " Liquid Invest · Plataforma Quantitativa & Social B3."] })]
					})
				]
			})
		]
	});
}
//#endregion
export { LoginPage as component };
