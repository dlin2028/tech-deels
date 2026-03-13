import { d as db, c as categories, u as users, b as deals } from './db-bOqIGVC4.js';
import { eq, or, ilike, desc } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ url }) => {
  const q = url.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return { results: [], q };
  }
  const pattern = `%${q}%`;
  const results = await db.select({
    id: deals.id,
    title: deals.title,
    url: deals.url,
    price: deals.price,
    original_price: deals.original_price,
    store: deals.store,
    description: deals.description,
    score: deals.score,
    created_at: deals.created_at,
    username: users.username,
    category_name: categories.name
  }).from(deals).leftJoin(users, eq(deals.user_id, users.id)).leftJoin(categories, eq(deals.category_id, categories.id)).where(
    or(
      ilike(deals.title, pattern),
      ilike(deals.description, pattern),
      ilike(deals.store, pattern)
    )
  ).orderBy(desc(deals.score)).limit(50);
  return { results, q };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D7B6X1E4.js')).default;
const server_id = "src/routes/search/+page.server.ts";
const imports = ["_app/immutable/nodes/10.iCpqL28F.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-fhuvFjOi.js.map
