import { r as redirect, f as fail } from './index-B2LGyy1l.js';
import { d as db, b as deals, c as categories } from './db-bOqIGVC4.js';
import Redis from 'ioredis';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
async function invalidateCache(pattern) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
}
const load = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const allCategories = await db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).orderBy(categories.name);
  return { categories: allCategories };
};
const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, "/login");
    const data = await request.formData();
    const title = String(data.get("title") ?? "").trim();
    const url = String(data.get("url") ?? "").trim();
    const price = data.get("price") ? String(data.get("price")) : null;
    const original_price = data.get("original_price") ? String(data.get("original_price")) : null;
    const store = String(data.get("store") ?? "").trim() || null;
    const description = String(data.get("description") ?? "").trim() || null;
    const image_url = String(data.get("image_url") ?? "").trim() || null;
    const category_id = data.get("category_id") ? Number(data.get("category_id")) : null;
    const errors = {};
    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!url) errors.url = "URL is required";
    else {
      try {
        new URL(url);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }
    if (price && isNaN(Number(price))) errors.price = "Price must be a number";
    if (original_price && isNaN(Number(original_price))) errors.original_price = "Original price must be a number";
    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, title, url, price, original_price, store, description, image_url, category_id });
    }
    const [newDeal] = await db.insert(deals).values({
      title,
      url,
      price: price ?? null,
      original_price: original_price ?? null,
      store,
      description,
      image_url,
      status: "active",
      score: 0,
      user_id: locals.user.id,
      category_id
    }).returning({ id: deals.id });
    await invalidateCache("deals:*");
    throw redirect(302, `/deals/${newDeal.id}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DZhblhDc.js')).default;
const server_id = "src/routes/deals/new/+page.server.ts";
const imports = ["_app/immutable/nodes/6.BWk7ylKH.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-D4fqmS85.js.map
