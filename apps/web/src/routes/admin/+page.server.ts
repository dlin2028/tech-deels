import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { users, deals, flags, categories } from "@tech-deels/db";
import { eq, count, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      reputation: users.reputation,
      created_at: users.created_at,
    })
    .from(users)
    .orderBy(users.created_at);

  const pendingFlags = await db
    .select({
      id: flags.id,
      reason: flags.reason,
      status: flags.status,
      created_at: flags.created_at,
      deal_id: flags.deal_id,
      comment_id: flags.comment_id,
      reporter: users.username,
    })
    .from(flags)
    .leftJoin(users, eq(flags.user_id, users.id))
    .where(eq(flags.status, "pending"))
    .orderBy(flags.created_at);

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.name);

  const [dealStats] = await db
    .select({ count: count(deals.id) })
    .from(deals);

  const [userStats] = await db
    .select({ count: count(users.id) })
    .from(users);

  return {
    users: allUsers,
    flags: pendingFlags,
    categories: allCategories,
    stats: {
      dealCount: Number(dealStats?.count ?? 0),
      userCount: Number(userStats?.count ?? 0),
      flagCount: pendingFlags.length,
    },
  };
};

export const actions: Actions = {
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
  },
};
