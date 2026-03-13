import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { deals, users, votes, comments } from "@tech-deels/db";
import { eq, count, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { username } = params;

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      reputation: users.reputation,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) throw error(404, "User not found");

  const userDeals = await db
    .select({
      id: deals.id,
      title: deals.title,
      url: deals.url,
      price: deals.price,
      store: deals.store,
      score: deals.score,
      status: deals.status,
      created_at: deals.created_at,
    })
    .from(deals)
    .where(eq(deals.user_id, user.id))
    .orderBy(sql`${deals.created_at} desc`)
    .limit(20);

  const [stats] = await db
    .select({
      deal_count: count(deals.id),
      total_score: sql<number>`coalesce(sum(${deals.score}), 0)`,
    })
    .from(deals)
    .where(eq(deals.user_id, user.id));

  return {
    profile: user,
    deals: userDeals,
    stats: {
      dealCount: Number(stats?.deal_count ?? 0),
      totalScore: Number(stats?.total_score ?? 0),
    },
  };
};
