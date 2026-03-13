import * as server from '../entries/pages/search/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/search/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/search/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.iCpqL28F.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js"];
export const stylesheets = [];
export const fonts = [];
