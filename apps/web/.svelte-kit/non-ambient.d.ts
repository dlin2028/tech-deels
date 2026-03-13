
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
		RouteId(): "/" | "/admin" | "/deals" | "/deals/new" | "/deals/[id]" | "/deals/[id]/vote" | "/login" | "/logout" | "/profile" | "/profile/[username]" | "/register" | "/search";
		RouteParams(): {
			"/deals/[id]": { id: string };
			"/deals/[id]/vote": { id: string };
			"/profile/[username]": { username: string }
		};
		LayoutParams(): {
			"/": { id?: string; username?: string };
			"/admin": Record<string, never>;
			"/deals": { id?: string };
			"/deals/new": Record<string, never>;
			"/deals/[id]": { id: string };
			"/deals/[id]/vote": { id: string };
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/profile": { username?: string };
			"/profile/[username]": { username: string };
			"/register": Record<string, never>;
			"/search": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/deals/new" | `/deals/${string}` & {} | `/deals/${string}/vote` & {} | "/login" | "/logout" | `/profile/${string}` & {} | "/register" | "/search";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}