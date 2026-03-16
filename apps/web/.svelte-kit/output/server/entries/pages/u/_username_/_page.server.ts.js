import { error } from "@sveltejs/kit";
import { d as db, u as users, m as merchants, e as categories, b as deals, c as comments, v as votes } from "../../../../chunks/db.js";
import { eq, sql, and, desc } from "drizzle-orm";
const load = async ({ params }) => {
  const [user] = await db.select({
    id: users.id,
    username: users.username,
    reputation: users.reputation,
    bio: users.bio,
    avatarUrl: users.avatarUrl,
    createdAt: users.createdAt,
    role: users.role
  }).from(users).where(eq(users.username, params.username)).limit(1);
  if (!user) error(404, "User not found");
  const userDeals = await db.select({
    id: deals.id,
    title: deals.title,
    price: deals.price,
    originalPrice: deals.originalPrice,
    createdAt: deals.createdAt,
    categoryName: categories.name,
    merchantName: merchants.name,
    voteScore: sql`COALESCE(SUM(${votes.value}), 0)`,
    commentCount: sql`COUNT(DISTINCT ${comments.id})`
  }).from(deals).leftJoin(categories, eq(deals.categoryId, categories.id)).leftJoin(merchants, eq(deals.merchantId, merchants.id)).leftJoin(votes, eq(deals.id, votes.dealId)).leftJoin(comments, and(eq(deals.id, comments.dealId), sql`${comments.deletedAt} IS NULL`)).where(eq(deals.userId, user.id)).groupBy(deals.id, categories.name, merchants.name).orderBy(desc(deals.createdAt)).limit(20);
  return { profile: user, deals: userDeals };
};
export {
  load
};
