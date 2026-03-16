// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { deals, users, merchants, categories, votes, comments } from '@tech-deels/db/schema';
import { ilike, desc, eq, sql, and } from 'drizzle-orm';

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const q = url.searchParams.get('q')?.trim() ?? '';

  if (!q) return { deals: [], q };

  const results = await db
    .select({
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
      voteScore: sql<number>`COALESCE(SUM(${votes.value}), 0)`,
      commentCount: sql<number>`COUNT(DISTINCT ${comments.id})`,
    })
    .from(deals)
    .leftJoin(users, eq(deals.userId, users.id))
    .leftJoin(merchants, eq(deals.merchantId, merchants.id))
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(votes, eq(deals.id, votes.dealId))
    .leftJoin(comments, and(eq(deals.id, comments.dealId), sql`${comments.deletedAt} IS NULL`))
    .where(and(eq(deals.status, 'active'), ilike(deals.title, `%${q}%`)))
    .groupBy(deals.id, users.username, merchants.name, categories.name, categories.slug)
    .orderBy(desc(deals.createdAt))
    .limit(40);

  return { deals: results, q };
};
