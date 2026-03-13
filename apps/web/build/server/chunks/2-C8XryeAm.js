import { r as redirect } from './index-B2LGyy1l.js';

const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    throw redirect(302, "/");
  }
  return {};
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-CGjbqHdq.js')).default;
const server_id = "src/routes/admin/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.DIi0T76F.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-C8XryeAm.js.map
