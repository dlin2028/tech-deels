import { d as db, e as categories, m as merchants, u as users, b as deals, c as comments, v as votes } from "../../../chunks/db.js";
import { sql, eq, and, ilike, desc } from "drizzle-orm";
const load = async ({ url }) => {
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (!q) return { deals: [], q };
  const results = await db.select({
    id: deals.id,
    title: deals.title,
    price: deals.price,
    originalPrice: deals.originalPrice,
    shippingCost: deals.shippingCost,
    createdAt: deals.createdAt,
    username: users.username,
    merchantName: merchants.name,
    categoryName: categories.name,
    categorySlug: categories.slug,
    voteScore: sql`COALESCE(SUM(${votes.value}), 0)`,
    commentCount: sql`COUNT(DISTINCT ${comments.id})`
  }).from(deals).leftJoin(users, eq(deals.userId, users.id)).leftJoin(merchants, eq(deals.merchantId, merchants.id)).leftJoin(categories, eq(deals.categoryId, categories.id)).leftJoin(votes, eq(deals.id, votes.dealId)).leftJoin(comments, and(eq(deals.id, comments.dealId), sql`${comments.deletedAt} IS NULL`)).where(and(eq(deals.status, "active"), ilike(deals.title, `%${q}%`))).groupBy(deals.id, users.username, merchants.name, categories.name, categories.slug).orderBy(desc(deals.createdAt)).limit(40);
  return { deals: results, q };
};
export {
  load
};
