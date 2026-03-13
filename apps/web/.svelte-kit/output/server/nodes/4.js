import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.BWNzw-qj.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/Bx1QyGZl.js","_app/immutable/chunks/CzGWyOFM.js","_app/immutable/chunks/CDhcFfYA.js"];
export const stylesheets = [];
export const fonts = [];
