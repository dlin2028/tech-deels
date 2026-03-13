import { e as error } from './index-B2LGyy1l.js';
import { d as db, u as users, b as deals } from './db-bOqIGVC4.js';
import { eq, sql, count } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ params }) => {
  const { username } = params;
  const [user] = await db.select({
    id: users.id,
    username: users.username,
    role: users.role,
    reputation: users.reputation,
    created_at: users.created_at
  }).from(users).where(eq(users.username, username)).limit(1);
  if (!user) throw error(404, "User not found");
  const userDeals = await db.select({
    id: deals.id,
    title: deals.title,
    url: deals.url,
    price: deals.price,
    store: deals.store,
    score: deals.score,
    status: deals.status,
    created_at: deals.created_at
  }).from(deals).where(eq(deals.user_id, user.id)).orderBy(sql`${deals.created_at} desc`).limit(20);
  const [stats] = await db.select({
    deal_count: count(deals.id),
    total_score: sql`coalesce(sum(${deals.score}), 0)`
  }).from(deals).where(eq(deals.user_id, user.id));
  return {
    profile: user,
    deals: userDeals,
    stats: {
      dealCount: Number(stats?.deal_count ?? 0),
      totalScore: Number(stats?.total_score ?? 0)
    }
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DzABNZU0.js')).default;
const server_id = "src/routes/profile/[username]/+page.server.ts";
const imports = ["_app/immutable/nodes/8.Chc-j1Hk.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-BGlS9KDJ.js.map
