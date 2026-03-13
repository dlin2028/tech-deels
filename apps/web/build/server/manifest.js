const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BQdHibhy.js",app:"_app/immutable/entry/app.cpUH9-4c.js",imports:["_app/immutable/entry/start.BQdHibhy.js","_app/immutable/chunks/CzGWyOFM.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/entry/app.cpUH9-4c.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BrhbsaZz.js')),
			__memo(() => import('./chunks/1-C6Oxoh_h.js')),
			__memo(() => import('./chunks/2-C8XryeAm.js')),
			__memo(() => import('./chunks/3-Dgxv1uiO.js')),
			__memo(() => import('./chunks/4-Ck2jgyTU.js')),
			__memo(() => import('./chunks/5-S0NkqBnR.js')),
			__memo(() => import('./chunks/6-D4fqmS85.js')),
			__memo(() => import('./chunks/7-CZiJNgkb.js')),
			__memo(() => import('./chunks/8-BGlS9KDJ.js')),
			__memo(() => import('./chunks/9-gWLgPQa2.js')),
			__memo(() => import('./chunks/10-fhuvFjOi.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/deals/new",
				pattern: /^\/deals\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/deals/[id]",
				pattern: /^\/deals\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/deals/[id]/vote",
				pattern: /^\/deals\/([^/]+?)\/vote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-uQJY09Uj.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Bdjt3qI5.js'))
			},
			{
				id: "/profile/[username]",
				pattern: /^\/profile\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
