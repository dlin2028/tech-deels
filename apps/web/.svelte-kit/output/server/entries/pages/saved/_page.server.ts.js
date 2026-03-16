import { redirect } from "@sveltejs/kit";
import { d as db, m as merchants, e as categories, b as deals, s as savedDeals } from "../../../chunks/db.js";
import { eq, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user) redirect(302, "/login");
  const saved = await db.select({
    id: savedDeals.id,
    createdAt: savedDeals.createdAt,
    dealId: deals.id,
    title: deals.title,
    price: deals.price,
    originalPrice: deals.originalPrice,
    categoryName: categories.name,
    merchantName: merchants.name
  }).from(savedDeals).innerJoin(deals, eq(savedDeals.dealId, deals.id)).leftJoin(categories, eq(deals.categoryId, categories.id)).leftJoin(merchants, eq(deals.merchantId, merchants.id)).where(eq(savedDeals.userId, locals.user.id)).orderBy(desc(savedDeals.createdAt));
  return { saved };
};
export {
  load
};
