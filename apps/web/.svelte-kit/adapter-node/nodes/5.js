import * as server from '../entries/pages/deals/_id_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/deals/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/deals/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CJ6i8kql.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js","_app/immutable/chunks/Bx1QyGZl.js","_app/immutable/chunks/CzGWyOFM.js"];
export const stylesheets = [];
export const fonts = [];
