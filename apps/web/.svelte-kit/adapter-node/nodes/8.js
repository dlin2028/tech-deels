import * as server from '../entries/pages/profile/_username_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_username_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/[username]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.Chc-j1Hk.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js"];
export const stylesheets = [];
export const fonts = [];
