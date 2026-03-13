import { f as fail } from './index-B2LGyy1l.js';
import { d as db, c as categories, f as flags, b as deals, u as users } from './db-bOqIGVC4.js';
import { eq, count } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const load = async () => {
  const allUsers = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role,
    reputation: users.reputation,
    created_at: users.created_at
  }).from(users).orderBy(users.created_at);
  const pendingFlags = await db.select({
    id: flags.id,
    reason: flags.reason,
    status: flags.status,
    created_at: flags.created_at,
    deal_id: flags.deal_id,
    comment_id: flags.comment_id,
    reporter: users.username
  }).from(flags).leftJoin(users, eq(flags.user_id, users.id)).where(eq(flags.status, "pending")).orderBy(flags.created_at);
  const allCategories = await db.select().from(categories).orderBy(categories.name);
  const [dealStats] = await db.select({ count: count(deals.id) }).from(deals);
  const [userStats] = await db.select({ count: count(users.id) }).from(users);
  return {
    users: allUsers,
    flags: pendingFlags,
    categories: allCategories,
    stats: {
      dealCount: Number(dealStats?.count ?? 0),
      userCount: Number(userStats?.count ?? 0),
      flagCount: pendingFlags.length
    }
  };
};
const actions = {
  banUser: async ({ request }) => {
    const data = await request.formData();
    const userId = String(data.get("userId") ?? "");
    if (!userId) return fail(400, { error: "User ID required" });
    await db.update(users).set({ role: "banned" }).where(eq(users.id, userId));
    return { success: true };
  },
  unbanUser: async ({ request }) => {
    const data = await request.formData();
    const userId = String(data.get("userId") ?? "");
    if (!userId) return fail(400, { error: "User ID required" });
    await db.update(users).set({ role: "user" }).where(eq(users.id, userId));
    return { success: true };
  },
  deleteDeal: async ({ request }) => {
    const data = await request.formData();
    const dealId = Number(data.get("dealId"));
    if (isNaN(dealId)) return fail(400, { error: "Deal ID required" });
    await db.update(deals).set({ status: "expired" }).where(eq(deals.id, dealId));
    return { success: true };
  },
  resolveFlag: async ({ request }) => {
    const data = await request.formData();
    const flagId = Number(data.get("flagId"));
    if (isNaN(flagId)) return fail(400, { error: "Flag ID required" });
    await db.update(flags).set({ status: "resolved" }).where(eq(flags.id, flagId));
    return { success: true };
  },
  addCategory: async ({ request }) => {
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim() || null;
    if (!name) return fail(400, { error: "Category name required" });
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await db.insert(categories).values({ name, slug, description });
    return { success: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BBk79w-O.js')).default;
const server_id = "src/routes/admin/+page.server.ts";
const imports = ["_app/immutable/nodes/4.BWNzw-qj.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js","_app/immutable/chunks/Bx1QyGZl.js","_app/immutable/chunks/CzGWyOFM.js","_app/immutable/chunks/CDhcFfYA.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-Ck2jgyTU.js.map
