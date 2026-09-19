globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"49d9-NNyCa9618bt5VWh+knCQbFQPOwI\"",
		"mtime": "2026-09-12T23:42:23.085Z",
		"size": 18905,
		"path": "../public/favicon.ico"
	},
	"/assets/arrow-right-Dn3gMp8d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-DX1rAuKgH9CRNi9VFods2RDCREI\"",
		"mtime": "2026-09-19T17:22:03.218Z",
		"size": 154,
		"path": "../public/assets/arrow-right-Dn3gMp8d.js"
	},
	"/assets/badge-C8uBWIda.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"304-WSkwmjK2RTZFQ80oKXipMC+enws\"",
		"mtime": "2026-09-19T17:22:03.218Z",
		"size": 772,
		"path": "../public/assets/badge-C8uBWIda.js"
	},
	"/assets/bot-qrtVKX-t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-MODSWkceKNeMSXQvLJQ9b6jLNTw\"",
		"mtime": "2026-09-19T17:22:03.219Z",
		"size": 317,
		"path": "../public/assets/bot-qrtVKX-t.js"
	},
	"/assets/button-ByJkY9gz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121f-TKRIUyX7Ws8affaSY4l4WFQdKzA\"",
		"mtime": "2026-09-19T17:22:03.219Z",
		"size": 4639,
		"path": "../public/assets/button-ByJkY9gz.js"
	},
	"/assets/carteira-n_OoeSBB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f9f-tPAbTKbJaYUGkqoDyghby3TtbqM\"",
		"mtime": "2026-09-19T17:22:03.219Z",
		"size": 8095,
		"path": "../public/assets/carteira-n_OoeSBB.js"
	},
	"/assets/chat-D3YfXd2I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3205-QlRXUEhWhiCYWzMFG0cc4QoVUT8\"",
		"mtime": "2026-09-19T17:22:03.220Z",
		"size": 12805,
		"path": "../public/assets/chat-D3YfXd2I.js"
	},
	"/assets/dist-FtUESRA3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1665-21akYkI1i855UkXXJdR9X8QyonM\"",
		"mtime": "2026-09-19T17:22:03.220Z",
		"size": 5733,
		"path": "../public/assets/dist-FtUESRA3.js"
	},
	"/assets/dist-jG0jPuYC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94b-yU3Dc3kzFx5f0RwUdZ7gyrhpGeA\"",
		"mtime": "2026-09-19T17:22:03.220Z",
		"size": 2379,
		"path": "../public/assets/dist-jG0jPuYC.js"
	},
	"/assets/ativo._ticker-DcCSB5Qy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30fe0-ICwp6GD3SdYetKjxnWS0r7MB9Qs\"",
		"mtime": "2026-09-19T17:22:03.218Z",
		"size": 200672,
		"path": "../public/assets/ativo._ticker-DcCSB5Qy.js"
	},
	"/assets/flame-B11bkdi6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc-57xe4IyhcSEM1x4ppucAjZP6XLc\"",
		"mtime": "2026-09-19T17:22:03.221Z",
		"size": 188,
		"path": "../public/assets/flame-B11bkdi6.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-09T01:03:17.420Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/grupos-45TB6d2E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a1f-Od3W1EfZb3HotDaWgoXsjT5HDRA\"",
		"mtime": "2026-09-19T17:22:03.222Z",
		"size": 27167,
		"path": "../public/assets/grupos-45TB6d2E.js"
	},
	"/assets/lock-CkAkaTj1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-1eYaVLAr4p9D9xhNzlwDkZ1jcA8\"",
		"mtime": "2026-09-19T17:22:03.222Z",
		"size": 195,
		"path": "../public/assets/lock-CkAkaTj1.js"
	},
	"/test_dark_perfect.png": {
		"type": "image/png",
		"etag": "\"21e9-YK82I5bWUhTKXqXqjf9VmlJheS8\"",
		"mtime": "2026-09-12T23:29:33.510Z",
		"size": 8681,
		"path": "../public/test_dark_perfect.png"
	},
	"/assets/mercado-DNXsW695.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2354-pc6cn9B1Q1Q1YhQehBR06wQhlYc\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 9044,
		"path": "../public/assets/mercado-DNXsW695.js"
	},
	"/assets/login-DJIif7EN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2553-JvAhn3NCzsriuZSp5o8sWp6Cxu0\"",
		"mtime": "2026-09-19T17:22:03.223Z",
		"size": 9555,
		"path": "../public/assets/login-DJIif7EN.js"
	},
	"/assets/message-square-Ccct3_kf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-lXmR56Eb0RtOETgWA4iNKER2DEQ\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 222,
		"path": "../public/assets/message-square-Ccct3_kf.js"
	},
	"/assets/noticias-CxyINJRK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee4-B11B7DoAJnHrbvs104djTcEm+no\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 3812,
		"path": "../public/assets/noticias-CxyINJRK.js"
	},
	"/assets/plus-yWrP6-7P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-G7i7VcN8cfCCxvzgj9i65qja/gQ\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 142,
		"path": "../public/assets/plus-yWrP6-7P.js"
	},
	"/assets/generateCategoricalChart-BxwYdMP6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"546b3-RQAp/qUYWtrgTM/RHy87Tg27rrI\"",
		"mtime": "2026-09-19T17:22:03.222Z",
		"size": 345779,
		"path": "../public/assets/generateCategoricalChart-BxwYdMP6.js"
	},
	"/assets/index-MHB-pksH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78151-S/zMS1PgIjx8vQpxvpyeBQTBJ68\"",
		"mtime": "2026-09-19T17:22:03.217Z",
		"size": 491857,
		"path": "../public/assets/index-MHB-pksH.js"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"a4ccc-0A5zBq+mE1z4ydH3ryrkFrr1qtA\"",
		"mtime": "2026-09-12T23:32:57.965Z",
		"size": 675020,
		"path": "../public/logo.png"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"a4ccc-0A5zBq+mE1z4ydH3ryrkFrr1qtA\"",
		"mtime": "2026-09-12T23:42:23.154Z",
		"size": 675020,
		"path": "../public/favicon.png"
	},
	"/logo_master.png": {
		"type": "image/png",
		"etag": "\"a4ccc-0A5zBq+mE1z4ydH3ryrkFrr1qtA\"",
		"mtime": "2026-09-12T23:32:57.827Z",
		"size": 675020,
		"path": "../public/logo_master.png"
	},
	"/assets/progress-DjcW63BU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a9-6md9D2sJRi8MgbYWq7MxsTQW82U\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 2217,
		"path": "../public/assets/progress-DjcW63BU.js"
	},
	"/assets/questionario-SAr2NY_X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b6d-e2Hifj/FXfzXoIe8il2Vuk8m9FA\"",
		"mtime": "2026-09-19T17:22:03.226Z",
		"size": 7021,
		"path": "../public/assets/questionario-SAr2NY_X.js"
	},
	"/assets/ranking-DdSnkdfC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"271a-EL8PbJWrkH8yY1I6s7MD9wQKtKg\"",
		"mtime": "2026-09-19T17:22:03.227Z",
		"size": 10010,
		"path": "../public/assets/ranking-DdSnkdfC.js"
	},
	"/assets/react-dom-BPM8wZdn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd8-3OreP2Q55R+qg3NCoeud2SKCZh4\"",
		"mtime": "2026-09-19T17:22:03.227Z",
		"size": 3544,
		"path": "../public/assets/react-dom-BPM8wZdn.js"
	},
	"/assets/routes-BsiTTfZj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b6b-vnkBkoAVYpdMIvVwr/RyDgxoLpw\"",
		"mtime": "2026-09-19T17:22:03.227Z",
		"size": 23403,
		"path": "../public/assets/routes-BsiTTfZj.js"
	},
	"/assets/search-BA5WCtTl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3-kxpznyVN/XGSRGr+yzof2fd1pVY\"",
		"mtime": "2026-09-19T17:22:03.227Z",
		"size": 163,
		"path": "../public/assets/search-BA5WCtTl.js"
	},
	"/assets/send-DMTu-Ts9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-ikaDFrfbRsll9WZZo7n6lanqMxk\"",
		"mtime": "2026-09-19T17:22:03.228Z",
		"size": 279,
		"path": "../public/assets/send-DMTu-Ts9.js"
	},
	"/assets/smart-invest-Cdt4NhwT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5d-8zTLMgV3Yo08vQVVyNUAg/zd+pk\"",
		"mtime": "2026-09-19T17:22:03.228Z",
		"size": 35421,
		"path": "../public/assets/smart-invest-Cdt4NhwT.js"
	},
	"/assets/tabs-DwTTUJgb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d52-5Yh8G2WSkqZWn8buZeZkzroaln0\"",
		"mtime": "2026-09-19T17:22:03.228Z",
		"size": 7506,
		"path": "../public/assets/tabs-DwTTUJgb.js"
	},
	"/assets/trash-2-D6DY3zhK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-PemRfuyrZX3SClPh1M40Vwqlfkw\"",
		"mtime": "2026-09-19T17:22:03.228Z",
		"size": 317,
		"path": "../public/assets/trash-2-D6DY3zhK.js"
	},
	"/assets/styles-DeIZLATM.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a65c-BvRe/FoI97XDQp0xZO6KUR4kTkA\"",
		"mtime": "2026-09-19T17:22:03.229Z",
		"size": 108124,
		"path": "../public/assets/styles-DeIZLATM.css"
	},
	"/assets/utils-DF3Yaucg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9085-iKNU8aBYeqSIBz3mRVl6ePzSKqA\"",
		"mtime": "2026-09-19T17:22:03.229Z",
		"size": 36997,
		"path": "../public/assets/utils-DF3Yaucg.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy__blPdM = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy__blPdM
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
