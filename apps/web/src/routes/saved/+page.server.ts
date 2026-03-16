import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { savedDeals, deals, users, merchants, categories } from '@tech-deels/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/login');

  const saved = await db
    .select({
      id: savedDeals.id,
      createdAt: savedDeals.createdAt,
      dealId: deals.id,
      title: deals.title,
      price: deals.price,
      originalPrice: deals.originalPrice,
      categoryName: categories.name,
      merchantName: merchants.name,
    })
    .from(savedDeals)
    .innerJoin(deals, eq(savedDeals.dealId, deals.id))
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(merchants, eq(deals.merchantId, merchants.id))
    .where(eq(savedDeals.userId, locals.user.id))
    .orderBy(desc(savedDeals.createdAt));

  return { saved };
};
