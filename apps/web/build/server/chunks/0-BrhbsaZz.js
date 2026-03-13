const load = async ({ locals }) => {
  return {
    user: locals.user ? {
      id: locals.user.id,
      username: locals.user.username,
      email: locals.user.email,
      role: locals.user.role,
      reputation: locals.user.reputation
    } : null
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-BVNipCe9.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.CYif-XLP.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
const stylesheets = ["_app/immutable/assets/0.CoffN4Sz.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-BrhbsaZz.js.map
