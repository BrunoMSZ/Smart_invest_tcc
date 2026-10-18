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
	"/assets/activity-BnwduiYm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df-notowtH0vlMKf86V0yW6iyWq354\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 223,
		"path": "../public/assets/activity-BnwduiYm.js"
	},
	"/logo1.png": {
		"type": "image/png",
		"etag": "\"1466c-DSW9IN/8FwHrhXrrUhMEWmTDfJ4\"",
		"mtime": "2026-10-04T19:02:28.030Z",
		"size": 83564,
		"path": "../public/logo1.png"
	},
	"/assets/api-Dm-S9HRQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128e-iufb3+2knmyDIBcf0PYOk0kL2bU\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 4750,
		"path": "../public/assets/api-Dm-S9HRQ.js"
	},
	"/assets/AreaChart-fVwaHc1c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"893b-flr6m0Z+1s/mfVKWVEGXfSTlBY8\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 35131,
		"path": "../public/assets/AreaChart-fVwaHc1c.js"
	},
	"/assets/arrow-left-BC0pb1UR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-nv9h1FZMPWsu/aQ1y5r2PjYk4n4\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 154,
		"path": "../public/assets/arrow-left-BC0pb1UR.js"
	},
	"/assets/arrow-right-Cu6HJt57.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-cOPRFFotO83IftVZi3TpVHmf58A\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 154,
		"path": "../public/assets/arrow-right-Cu6HJt57.js"
	},
	"/logo2.png": {
		"type": "image/png",
		"etag": "\"289ac-2G0a+NkVYzf/q1HabebJq2P2ilc\"",
		"mtime": "2026-10-04T19:02:28.030Z",
		"size": 166316,
		"path": "../public/logo2.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-09T01:03:17.420Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ativo._ticker-B7YpgeDD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2878d-FXCjgkC7knfXLM1sZTPGibyfQ4A\"",
		"mtime": "2026-10-18T14:44:54.727Z",
		"size": 165773,
		"path": "../public/assets/ativo._ticker-B7YpgeDD.js"
	},
	"/assets/ativo._ticker-CBxEApDe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"554-NLmP+aUVBr8kZCtGksVXEyVRu1Y\"",
		"mtime": "2026-10-18T14:44:54.727Z",
		"size": 1364,
		"path": "../public/assets/ativo._ticker-CBxEApDe.js"
	},
	"/test_dark_perfect.png": {
		"type": "image/png",
		"etag": "\"21e9-YK82I5bWUhTKXqXqjf9VmlJheS8\"",
		"mtime": "2026-09-12T23:29:33.510Z",
		"size": 8681,
		"path": "../public/test_dark_perfect.png"
	},
	"/assets/avatar-compress-Bs6fPYOc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"44c-umBoLsXcvbU6NGQdwtM/x5J7COg\"",
		"mtime": "2026-10-18T14:44:54.727Z",
		"size": 1100,
		"path": "../public/assets/avatar-compress-Bs6fPYOc.js"
	},
	"/assets/badge-ByGhfuwP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-/kq9n/MwzP87dmHiXhXMUlraSUo\"",
		"mtime": "2026-10-18T14:44:54.728Z",
		"size": 804,
		"path": "../public/assets/badge-ByGhfuwP.js"
	},
	"/assets/bot-D_diYJbo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-pRPZhVhA85xSZyLZ4eeLil76lEw\"",
		"mtime": "2026-10-18T14:44:54.728Z",
		"size": 317,
		"path": "../public/assets/bot-D_diYJbo.js"
	},
	"/assets/building-2-ik2pkIVU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-6wIsYShWsvj7ejF1WC6YGApr7h8\"",
		"mtime": "2026-10-18T14:44:54.728Z",
		"size": 372,
		"path": "../public/assets/building-2-ik2pkIVU.js"
	},
	"/assets/carteira-h4tFQ58j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"202b-bCNE+5ohaJFvLVI7afOkqPTUTaU\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 8235,
		"path": "../public/assets/carteira-h4tFQ58j.js"
	},
	"/assets/button-DZgQnUB8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123f-T4NkpRCGnMeG+hLPZEEMo8F2NUs\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 4671,
		"path": "../public/assets/button-DZgQnUB8.js"
	},
	"/assets/circle-check-Dw2Uc0FT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-PVMRKQ/6sqfF5WBZlRyiH+fHtWY\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 167,
		"path": "../public/assets/circle-check-Dw2Uc0FT.js"
	},
	"/assets/chart-pie-kotoHJ_O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-lmS64PsSFDjwxCQXRcYlUO96QFw\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 262,
		"path": "../public/assets/chart-pie-kotoHJ_O.js"
	},
	"/assets/chat-D0lPZRCE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66c2-+s3eEI0qHd8xV31+yBdqB6MEcM4\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 26306,
		"path": "../public/assets/chat-D0lPZRCE.js"
	},
	"/assets/clsx-S8xFBMgc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22db-3ocoZdeS6zzEzKUldzz9yYlMp7w\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 8923,
		"path": "../public/assets/clsx-S8xFBMgc.js"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"a4ccc-0A5zBq+mE1z4ydH3ryrkFrr1qtA\"",
		"mtime": "2026-09-12T23:42:23.154Z",
		"size": 675020,
		"path": "../public/favicon.png"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"8c263-WzJiuB+JtHX0HWberwtGUnS+m/U\"",
		"mtime": "2026-10-04T19:02:28.030Z",
		"size": 574051,
		"path": "../public/logo.png"
	},
	"/logo_master.png": {
		"type": "image/png",
		"etag": "\"a4ccc-0A5zBq+mE1z4ydH3ryrkFrr1qtA\"",
		"mtime": "2026-09-12T23:32:57.827Z",
		"size": 675020,
		"path": "../public/logo_master.png"
	},
	"/assets/Combination-CCjyZEcX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"580f-NmrFJ2iMxVrRryIU3NF3cqsi/Bo\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 22543,
		"path": "../public/assets/Combination-CCjyZEcX.js"
	},
	"/assets/config-Cnab9Cj0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"157b-iViOeNJL1BuATNhFGYaWW8aWpco\"",
		"mtime": "2026-10-18T14:44:54.729Z",
		"size": 5499,
		"path": "../public/assets/config-Cnab9Cj0.js"
	},
	"/assets/confirm-delete-dialog-BK6RpTQf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b6-MDhhTpr297UmAPfOJFUArjJgnpY\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 1974,
		"path": "../public/assets/confirm-delete-dialog-BK6RpTQf.js"
	},
	"/assets/dashboard-CsfV8Jn8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b62-3M5W4ER6p7j1FeHAWgg0VD0M7jo\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 7010,
		"path": "../public/assets/dashboard-CsfV8Jn8.js"
	},
	"/assets/dialog-B5gH1N4M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19e2-C63agcE8fJ6FafOy0mRnqMTJpog\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 6626,
		"path": "../public/assets/dialog-B5gH1N4M.js"
	},
	"/assets/dist-B-kRpLXV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-3zx1aNzbPAdAPoCS9FtpYaKvigk\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 632,
		"path": "../public/assets/dist-B-kRpLXV.js"
	},
	"/assets/dist-1QWBtgUN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f39-zPlD6X9BEWQvuevDrerdjIY/ZFE\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 32569,
		"path": "../public/assets/dist-1QWBtgUN.js"
	},
	"/assets/dist-CidlNbhf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c98-i1T/md+F0FQXYiwV7BlUuQY34kg\"",
		"mtime": "2026-10-18T14:44:54.732Z",
		"size": 7320,
		"path": "../public/assets/dist-CidlNbhf.js"
	},
	"/assets/dist-Bv_bRvqv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1664-qSpCoaXzM5m13wkCiA2H3EMzWHI\"",
		"mtime": "2026-10-18T14:44:54.730Z",
		"size": 5732,
		"path": "../public/assets/dist-Bv_bRvqv.js"
	},
	"/assets/dist-r7aYee-x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94a-sqrMEilgKbuabqNRpLee/PpjIeM\"",
		"mtime": "2026-10-18T14:44:54.732Z",
		"size": 2378,
		"path": "../public/assets/dist-r7aYee-x.js"
	},
	"/assets/file-text-Cy_DnHOX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-q4dx7lob/UoRkDjSx317s0Dswuk\"",
		"mtime": "2026-10-18T14:44:54.732Z",
		"size": 374,
		"path": "../public/assets/file-text-Cy_DnHOX.js"
	},
	"/assets/flame-qltOBFwj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc-g27NbKt/fkRFK4cuQWXBBDRMK3o\"",
		"mtime": "2026-10-18T14:44:54.732Z",
		"size": 188,
		"path": "../public/assets/flame-qltOBFwj.js"
	},
	"/assets/image-Cpk0bTzS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102-QLPgU+vs5+mECU0bxxpkDk8/YDM\"",
		"mtime": "2026-10-18T14:44:54.736Z",
		"size": 258,
		"path": "../public/assets/image-Cpk0bTzS.js"
	},
	"/assets/grupos-BQq3K6Vp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a23-5AgTxn/lFHqRFNsVTTxQ677Rvxg\"",
		"mtime": "2026-10-18T14:44:54.736Z",
		"size": 27171,
		"path": "../public/assets/grupos-BQq3K6Vp.js"
	},
	"/assets/inicio-GcXUPFhr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"376f-qxI7DVgmCoDc1jptaA1icw7eHys\"",
		"mtime": "2026-10-18T14:44:54.736Z",
		"size": 14191,
		"path": "../public/assets/inicio-GcXUPFhr.js"
	},
	"/assets/input-C5Zbleo8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"266-HljWDYIfiwE726BjH+m/kNvObsA\"",
		"mtime": "2026-10-18T14:44:54.737Z",
		"size": 614,
		"path": "../public/assets/input-C5Zbleo8.js"
	},
	"/assets/key-round-Wo0Jdl6P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158-6YYxehS/9jRWutxoe2HZKiRvSbg\"",
		"mtime": "2026-10-18T14:44:54.737Z",
		"size": 344,
		"path": "../public/assets/key-round-Wo0Jdl6P.js"
	},
	"/assets/label-DBPCb-U3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c8-k7TUPZdXUIm78TotVJoVrYRZOyA\"",
		"mtime": "2026-10-18T14:44:54.737Z",
		"size": 712,
		"path": "../public/assets/label-DBPCb-U3.js"
	},
	"/assets/generateCategoricalChart-C1O8zb8n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"546bd-Nl3bxHxd7878YlUoLvdNcKkfyO4\"",
		"mtime": "2026-10-18T14:44:54.735Z",
		"size": 345789,
		"path": "../public/assets/generateCategoricalChart-C1O8zb8n.js"
	},
	"/assets/link-EUW05N4E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5911-sYC4wPvioHKIZxz4mXzHYCagZUo\"",
		"mtime": "2026-10-18T14:44:54.737Z",
		"size": 22801,
		"path": "../public/assets/link-EUW05N4E.js"
	},
	"/assets/link-2-DoLx8SyN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e7-Qq7Vf0U32vnCdWuDdKFARy5AGXE\"",
		"mtime": "2026-10-18T14:44:54.737Z",
		"size": 231,
		"path": "../public/assets/link-2-DoLx8SyN.js"
	},
	"/assets/index-CVXjoBDP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5184f-MFQrFuSUA7QeKCrkUULMIheZtxM\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 333903,
		"path": "../public/assets/index-CVXjoBDP.js"
	},
	"/assets/loader-circle-Dsm_rLLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85-9+ueBsLcQ6J2HgY0RBKvrpOo6A0\"",
		"mtime": "2026-10-18T14:44:54.738Z",
		"size": 133,
		"path": "../public/assets/loader-circle-Dsm_rLLF.js"
	},
	"/assets/lock-DzWxKoAC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-Lw2zAio6d5bZ3r/Jcz8XhkCCSg8\"",
		"mtime": "2026-10-18T14:44:54.738Z",
		"size": 195,
		"path": "../public/assets/lock-DzWxKoAC.js"
	},
	"/assets/login-BD1ubIvP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e77-p+nx4mQfZYdPuE/HLt4U6fWzczU\"",
		"mtime": "2026-10-18T14:44:54.738Z",
		"size": 11895,
		"path": "../public/assets/login-BD1ubIvP.js"
	},
	"/assets/mercado-Fcp5OseT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24c5-5Gf4D/GaTuOYxeu6AR1vfx03vls\"",
		"mtime": "2026-10-18T14:44:54.738Z",
		"size": 9413,
		"path": "../public/assets/mercado-Fcp5OseT.js"
	},
	"/assets/message-circle-R6iwovjV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-k4juu5IkNvJ6KJinGwMJrO7YTtA\"",
		"mtime": "2026-10-18T14:44:54.739Z",
		"size": 230,
		"path": "../public/assets/message-circle-R6iwovjV.js"
	},
	"/assets/message-square-Ct37dG93.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-/xL4UuKsmMgHt3VGuz1w5u1F3HI\"",
		"mtime": "2026-10-18T14:44:54.739Z",
		"size": 222,
		"path": "../public/assets/message-square-Ct37dG93.js"
	},
	"/assets/mock-data-Da3y9xUL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12e0-sQKICJycks2Nw4dPCfxCsnJfQNc\"",
		"mtime": "2026-10-18T14:44:54.739Z",
		"size": 4832,
		"path": "../public/assets/mock-data-Da3y9xUL.js"
	},
	"/assets/newspaper-ByuS3p8U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14d-0TlemqhFrbxclAfOHZ5IcR8iUpM\"",
		"mtime": "2026-10-18T14:44:54.739Z",
		"size": 333,
		"path": "../public/assets/newspaper-ByuS3p8U.js"
	},
	"/assets/noticias-BKD8l5Py.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c5-V7hpkKpSbchzVx2OSZLkf1nBihg\"",
		"mtime": "2026-10-18T14:44:54.740Z",
		"size": 5061,
		"path": "../public/assets/noticias-BKD8l5Py.js"
	},
	"/assets/plus-CbtQl0JP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-58iVD6a3cf8XaA3+CDHK33Q4JR8\"",
		"mtime": "2026-10-18T14:44:54.740Z",
		"size": 142,
		"path": "../public/assets/plus-CbtQl0JP.js"
	},
	"/assets/PieChart-CwIP1DHQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64a4-rvTUDEjbMCYcEdPnPMQBCEy/Bsg\"",
		"mtime": "2026-10-18T14:44:54.725Z",
		"size": 25764,
		"path": "../public/assets/PieChart-CwIP1DHQ.js"
	},
	"/assets/post-detail-dialog-BmSrUOD-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58cf-KFHoP301LaR+NEvX43Kvs7fTkvs\"",
		"mtime": "2026-10-18T14:44:54.740Z",
		"size": 22735,
		"path": "../public/assets/post-detail-dialog-BmSrUOD-.js"
	},
	"/assets/preload-helper-BHvraGrm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184d-x3iIbvccbFMMktig1P7BOKlA2iQ\"",
		"mtime": "2026-10-18T14:44:54.741Z",
		"size": 6221,
		"path": "../public/assets/preload-helper-BHvraGrm.js"
	},
	"/assets/profile-cache-G2WToPCq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b2-ILzHayIDNN70eIH2qEkINVUjRrk\"",
		"mtime": "2026-10-18T14:44:54.741Z",
		"size": 1202,
		"path": "../public/assets/profile-cache-G2WToPCq.js"
	},
	"/assets/progress-CicojXKd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c9-X0qoOh9xCgwTFhDT20Vx+Ibe2z0\"",
		"mtime": "2026-10-18T14:44:54.741Z",
		"size": 2249,
		"path": "../public/assets/progress-CicojXKd.js"
	},
	"/assets/questionario-ef4gf30k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bfb-Uctik5yHvuJ0myBAg+iGP0XcjPg\"",
		"mtime": "2026-10-18T14:44:54.741Z",
		"size": 7163,
		"path": "../public/assets/questionario-ef4gf30k.js"
	},
	"/assets/react-dom-CGbIQYmo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd7-Gx5nK3vxyH6fD42iiPf/IyjrXoA\"",
		"mtime": "2026-10-18T14:44:54.742Z",
		"size": 3543,
		"path": "../public/assets/react-dom-CGbIQYmo.js"
	},
	"/assets/ranking-rZZ1SIe1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2847-mHg1K70fqaWzbMORmeTH3cwcDgw\"",
		"mtime": "2026-10-18T14:44:54.742Z",
		"size": 10311,
		"path": "../public/assets/ranking-rZZ1SIe1.js"
	},
	"/assets/refresh-cw-JQ-ZL971.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-oOh2GeGO4iMFVtRyg+UBtGkUc7I\"",
		"mtime": "2026-10-18T14:44:54.742Z",
		"size": 310,
		"path": "../public/assets/refresh-cw-JQ-ZL971.js"
	},
	"/assets/routes-DWbdDJBV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a1d-SOwU5tz5i+0Y3z8ECNIBA+sGRaY\"",
		"mtime": "2026-10-18T14:44:54.742Z",
		"size": 10781,
		"path": "../public/assets/routes-DWbdDJBV.js"
	},
	"/assets/search-C55YHFj2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3-w09fVePdgvUeyoRo2sHzTO24Szs\"",
		"mtime": "2026-10-18T14:44:54.743Z",
		"size": 163,
		"path": "../public/assets/search-C55YHFj2.js"
	},
	"/assets/send-D3wUVoQF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-MwvIUpJsalbWzDpBgiqfO6LyhkQ\"",
		"mtime": "2026-10-18T14:44:54.743Z",
		"size": 279,
		"path": "../public/assets/send-D3wUVoQF.js"
	},
	"/assets/select-De0cGgR5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bb8a-eUMdObrUken+NIoOVzTposc3UQM\"",
		"mtime": "2026-10-18T14:44:54.743Z",
		"size": 48010,
		"path": "../public/assets/select-De0cGgR5.js"
	},
	"/assets/settings-fTmo4tzr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dc-3e+g+MCnjEDkBitps4ah+8Z08Kk\"",
		"mtime": "2026-10-18T14:44:54.743Z",
		"size": 476,
		"path": "../public/assets/settings-fTmo4tzr.js"
	},
	"/assets/shield-check-CNut141j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-qzQL7jPpTBpt6CHPdcK4L2CkGac\"",
		"mtime": "2026-10-18T14:44:54.744Z",
		"size": 309,
		"path": "../public/assets/shield-check-CNut141j.js"
	},
	"/assets/smart-invest-CE2cjDaX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"273a-ry4hqxDD53hOSbBMUlgMy0a7nE4\"",
		"mtime": "2026-10-18T14:44:54.744Z",
		"size": 10042,
		"path": "../public/assets/smart-invest-CE2cjDaX.js"
	},
	"/assets/sparkles-CW2eJrhL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-ud9RMhOEjiQqHkaA2yxj42E8LNg\"",
		"mtime": "2026-10-18T14:44:54.744Z",
		"size": 483,
		"path": "../public/assets/sparkles-CW2eJrhL.js"
	},
	"/assets/styles-BeDM6j4l.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1d411-FpK2IvtWyYemWVoISyFX29SDo8A\"",
		"mtime": "2026-10-18T14:44:54.748Z",
		"size": 119825,
		"path": "../public/assets/styles-BeDM6j4l.css"
	},
	"/assets/tabs-BA5v9_Aq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6c-w7q3ZIf/ylg8P5wPnkdSwt0kREk\"",
		"mtime": "2026-10-18T14:44:54.744Z",
		"size": 7532,
		"path": "../public/assets/tabs-BA5v9_Aq.js"
	},
	"/assets/teses-BeQvFRzW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29f7-C3gLry0R2yICTFf7Dk205yWntNs\"",
		"mtime": "2026-10-18T14:44:54.745Z",
		"size": 10743,
		"path": "../public/assets/teses-BeQvFRzW.js"
	},
	"/assets/trash-2-CR11-U20.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-KnpnKDVhjhnkUf+lccjTkCUGTDg\"",
		"mtime": "2026-10-18T14:44:54.745Z",
		"size": 317,
		"path": "../public/assets/trash-2-CR11-U20.js"
	},
	"/assets/trending-down-V5-TEd1f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-nakQZeRalt6lAM41UTkk44pZHrc\"",
		"mtime": "2026-10-18T14:44:54.745Z",
		"size": 167,
		"path": "../public/assets/trending-down-V5-TEd1f.js"
	},
	"/assets/trending-up-B8GYeMkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-A4XqXgcWk+dOKU0vsP4FmG2LPf8\"",
		"mtime": "2026-10-18T14:44:54.745Z",
		"size": 164,
		"path": "../public/assets/trending-up-B8GYeMkq.js"
	},
	"/assets/trophy-DzQ0PXZS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d1-P2HK1tIh1i++z9QFiHsYWC7bUHY\"",
		"mtime": "2026-10-18T14:44:54.746Z",
		"size": 465,
		"path": "../public/assets/trophy-DzQ0PXZS.js"
	},
	"/assets/u._userId-BdAjIkKZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ab2-v1Vft/QfSCnbCsfgjMtrLqQoNUs\"",
		"mtime": "2026-10-18T14:44:54.746Z",
		"size": 10930,
		"path": "../public/assets/u._userId-BdAjIkKZ.js"
	},
	"/assets/u._userId-BqqZP0xy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"748-jnSucJpxoUdTVJ9NrBqTfTY8jUw\"",
		"mtime": "2026-10-18T14:44:54.746Z",
		"size": 1864,
		"path": "../public/assets/u._userId-BqqZP0xy.js"
	},
	"/assets/upload-proof-dialog-CZOJuzbq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1357-Xjo6VNYorRdJfCOOWC1ASNPBS3o\"",
		"mtime": "2026-10-18T14:44:54.746Z",
		"size": 4951,
		"path": "../public/assets/upload-proof-dialog-CZOJuzbq.js"
	},
	"/assets/useNavigate-CAfT7lpi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-NeRlqim3uYYhPucO5AlzBFsmpVQ\"",
		"mtime": "2026-10-18T14:44:54.746Z",
		"size": 345,
		"path": "../public/assets/useNavigate-CAfT7lpi.js"
	},
	"/assets/user-C4KonZ_o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-8tVTHKhqZgugqbTG9YqU/nKwEyI\"",
		"mtime": "2026-10-18T14:44:54.747Z",
		"size": 185,
		"path": "../public/assets/user-C4KonZ_o.js"
	},
	"/assets/useRouter-Dct7dSJ-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ab-2jnuADVq+prKl3Af0K0ng1hXCwg\"",
		"mtime": "2026-10-18T14:44:54.747Z",
		"size": 683,
		"path": "../public/assets/useRouter-Dct7dSJ-.js"
	},
	"/assets/users-DLyS41xr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127-YcsbDVT04dB18Ql9xZPOcAgbj9E\"",
		"mtime": "2026-10-18T14:44:54.747Z",
		"size": 295,
		"path": "../public/assets/users-DLyS41xr.js"
	},
	"/assets/utils-DcA_Ddqs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6dcd-syKHTi1wFYLJ3hrXEV7UIkkscug\"",
		"mtime": "2026-10-18T14:44:54.748Z",
		"size": 28109,
		"path": "../public/assets/utils-DcA_Ddqs.js"
	},
	"/assets/whatsapp-reactions-D9cglil9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0f-jcMRX0YEd1kw8LIq6CjdwA7mOtg\"",
		"mtime": "2026-10-18T14:44:54.748Z",
		"size": 3343,
		"path": "../public/assets/whatsapp-reactions-D9cglil9.js"
	},
	"/assets/x-C3p6Mfa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-qSYRSLHElko6LxCQms9WeC8U6+s\"",
		"mtime": "2026-10-18T14:44:54.748Z",
		"size": 143,
		"path": "../public/assets/x-C3p6Mfa6.js"
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
