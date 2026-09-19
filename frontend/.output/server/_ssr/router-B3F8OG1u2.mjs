import { i as __toESM } from "../_runtime.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Check, Q as ChevronDown, X as ChevronUp } from "../_libs/lucide-react.mjs";
import { m as router_exports } from "./router-B3F8OG1u.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-Bq5vK6RO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/input-B8Q2ztVi.js
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/label-DBD1bRRP.js
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/select-Dg1urBTx.js
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/api-QcSriJ06.js
var API_BASE_URL = "http://localhost:8000";
function getStoredToken() {
	return localStorage.getItem("auth_token");
}
function setStoredToken(token) {
	localStorage.setItem("auth_token", token);
}
function removeStoredToken() {
	localStorage.removeItem("auth_token");
}
async function apiFetch(endpoint, options = {}) {
	const token = getStoredToken();
	const headers = {
		"Content-Type": "application/json",
		...options.headers || {}
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
	const res = await fetch(url, {
		...options,
		headers
	});
	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		throw new Error(errorData.detail || `Erro na requisição (${res.status})`);
	}
	return res.json();
}
var api = {
	login: (email, senha) => apiFetch("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			senha
		})
	}),
	register: (data) => apiFetch("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	getProfile: () => apiFetch("/api/profile"),
	updateProfile: (data) => apiFetch("/api/profile", {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	getHomeDashboard: () => apiFetch("/api/home"),
	getStocks: (params) => {
		const query = new URLSearchParams();
		if (params?.search) query.set("search", params.search);
		if (params?.classe) query.set("classe", params.classe);
		if (params?.limit) query.set("limit", String(params.limit));
		const qs = query.toString();
		return apiFetch(`/api/stocks${qs ? `?${qs}` : ""}`);
	},
	analyzeStock: (ticker) => apiFetch(`/api/analyze/${ticker}`),
	getNews: (ticker, limit = 10) => apiFetch(`/api/news?limit=${limit}${ticker ? `&ticker=${ticker}` : ""}`),
	getStockRanking: (top_n = 10) => apiFetch(`/api/ranking?top_n=${top_n}`),
	getUserRanking: () => apiFetch("/api/ranking/users"),
	enviarQuestionario: (dados) => apiFetch("/api/questionario", {
		method: "POST",
		body: JSON.stringify(dados)
	}),
	optimizeSmartInvest: (data) => apiFetch("/api/smart-invest/optimize", {
		method: "POST",
		body: JSON.stringify({
			idade: data.age,
			renda_mensal: data.income,
			respostas_risco: data.risk_tolerance,
			profile_override: data.profile_override
		})
	}),
	getUserCarteira: () => apiFetch("/api/user/carteira"),
	saveCarteiraItem: (item) => apiFetch("/api/user/carteira", {
		method: "POST",
		body: JSON.stringify(item)
	}),
	removeCarteiraItem: (id) => apiFetch(`/api/user/carteira/${id}`, { method: "DELETE" }),
	getPosts: () => apiFetch("/api/posts"),
	createPost: (data) => apiFetch("/api/posts", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	deletePost: (postId) => apiFetch(`/api/posts/${postId}`, { method: "DELETE" }),
	getComments: (postId) => apiFetch(`/api/posts/${postId}/comments`),
	addComment: (postId, conteudo) => apiFetch(`/api/posts/${postId}/comments`, {
		method: "POST",
		body: JSON.stringify({ conteudo })
	}),
	toggleLikePost: (postId) => apiFetch(`/api/posts/${postId}/like`, { method: "POST" }),
	getGroups: () => apiFetch("/api/groups"),
	getGroup: (groupId) => apiFetch(`/api/groups/${groupId}`),
	createGroup: (data) => apiFetch("/api/groups", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	joinGroup: (codigo) => apiFetch("/api/groups/join", {
		method: "POST",
		body: JSON.stringify({ codigo })
	}),
	recordGroupAporte: (groupId) => apiFetch(`/api/groups/${groupId}/aporte`, { method: "POST" }),
	getGroupMessages: (groupId) => apiFetch(`/api/groups/${groupId}/messages`),
	sendGroupMessage: (groupId, mensagem) => apiFetch(`/api/groups/${groupId}/messages`, {
		method: "POST",
		body: JSON.stringify({ mensagem })
	}),
	sendChatMessage: (message, history, ticker) => apiFetch("/api/chat", {
		method: "POST",
		body: JSON.stringify({
			message,
			history,
			ticker
		})
	}),
	getChatHistory: () => apiFetch("/api/chat/history"),
	getMarketTicker: () => apiFetch("/api/market/ticker")
};
//#endregion
export { setStoredToken as a, SelectItem as c, Label as d, Input as f, removeStoredToken as i, SelectTrigger as l, cn as m, api as n, Select as o, Button as p, getStoredToken as r, SelectContent as s, router_exports as t, SelectValue as u };
