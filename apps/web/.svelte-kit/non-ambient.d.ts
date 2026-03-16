
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(auth)" | "/" | "/admin" | "/affiliate-disclosure" | "/api" | "/api/comments" | "/api/comments/[id]" | "/api/comments/[id]/vote" | "/api/deals" | "/api/deals/save" | "/api/deals/vote" | "/deals" | "/deals/new" | "/deals/[id]" | "/guidelines" | "/(auth)/login" | "/(auth)/logout" | "/mod" | "/mod/queue" | "/notifications" | "/privacy" | "/saved" | "/search" | "/(auth)/signup" | "/terms" | "/u" | "/u/[username]";
		RouteParams(): {
			"/api/comments/[id]": { id: string };
			"/api/comments/[id]/vote": { id: string };
			"/deals/[id]": { id: string };
			"/u/[username]": { username: string }
		};
		LayoutParams(): {
			"/(auth)": Record<string, never>;
			"/": { id?: string; username?: string };
			"/admin": Record<string, never>;
			"/affiliate-disclosure": Record<string, never>;
			"/api": { id?: string };
			"/api/comments": { id?: string };
			"/api/comments/[id]": { id: string };
			"/api/comments/[id]/vote": { id: string };
			"/api/deals": Record<string, never>;
			"/api/deals/save": Record<string, never>;
			"/api/deals/vote": Record<string, never>;
			"/deals": { id?: string };
			"/deals/new": Record<string, never>;
			"/deals/[id]": { id: string };
			"/guidelines": Record<string, never>;
			"/(auth)/login": Record<string, never>;
			"/(auth)/logout": Record<string, never>;
			"/mod": Record<string, never>;
			"/mod/queue": Record<string, never>;
			"/notifications": Record<string, never>;
			"/privacy": Record<string, never>;
			"/saved": Record<string, never>;
			"/search": Record<string, never>;
			"/(auth)/signup": Record<string, never>;
			"/terms": Record<string, never>;
			"/u": { username?: string };
			"/u/[username]": { username: string }
		};
		Pathname(): "/" | "/admin" | "/affiliate-disclosure" | "/api/comments" | `/api/comments/${string}/vote` & {} | "/api/deals/save" | "/api/deals/vote" | "/deals/new" | `/deals/${string}` & {} | "/guidelines" | "/login" | "/logout" | "/mod/queue" | "/notifications" | "/privacy" | "/saved" | "/search" | "/signup" | "/terms" | `/u/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}