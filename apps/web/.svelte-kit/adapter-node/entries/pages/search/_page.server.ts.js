import { d as db, c as categories, u as users, a as deals } from "../../../chunks/db.js";
import { eq, or, ilike, desc } from "drizzle-orm";
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
export {
  load
};
