import * as server from '../entries/pages/deals/new/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/deals/new/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/deals/new/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BWk7ylKH.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
export const stylesheets = [];
export const fonts = [];
