import { d as db, c as categories, a as comments, u as users, b as deals, v as votes } from './db-bOqIGVC4.js';
import { eq, count, sql, desc } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async ({ url, locals }) => {
  const tab = url.searchParams.get("tab") ?? "hot";
  const categorySlug = url.searchParams.get("category") ?? null;
  let categoryId = null;
  if (categorySlug) {
    const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).limit(1);
    categoryId = cat[0]?.id ?? null;
  }
  const commentCounts = db.select({
    deal_id: comments.deal_id,
    count: count(comments.id).as("count")
  }).from(comments).groupBy(comments.deal_id).as("comment_counts");
  let query = db.select({
    id: deals.id,
    title: deals.title,
    url: deals.url,
    price: deals.price,
    original_price: deals.original_price,
    store: deals.store,
    description: deals.description,
    image_url: deals.image_url,
    status: deals.status,
    score: deals.score,
    created_at: deals.created_at,
    username: users.username,
    category_name: categories.name,
    category_slug: categories.slug,
    comment_count: sql`coalesce(${commentCounts.count}, 0)`
  }).from(deals).leftJoin(users, eq(deals.user_id, users.id)).leftJoin(categories, eq(deals.category_id, categories.id)).leftJoin(commentCounts, eq(deals.id, commentCounts.deal_id)).where(
    categoryId ? sql`${deals.status} = 'active' AND ${deals.category_id} = ${categoryId}` : sql`${deals.status} = 'active'`
  );
  if (tab === "new") {
    query = query.orderBy(desc(deals.created_at));
  } else {
    query = query.orderBy(desc(deals.score), desc(deals.created_at));
  }
  const dealsList = await query.limit(50);
  const allCategories = await db.select({
    id: categories.id,
    name: categories.name,
    slug: categories.slug
  }).from(categories).orderBy(categories.name);
  let userVotes = {};
  if (locals.user) {
    const uv = await db.select({ deal_id: votes.deal_id, value: votes.value }).from(votes).where(eq(votes.user_id, locals.user.id));
    for (const v of uv) {
      userVotes[v.deal_id] = v.value;
    }
  }
  return {
    deals: dealsList,
    categories: allCategories,
    tab,
    categorySlug,
    userVotes
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-nwZqXw2R.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/3.DYya_Ors.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/CDhcFfYA.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-Dgxv1uiO.js.map
