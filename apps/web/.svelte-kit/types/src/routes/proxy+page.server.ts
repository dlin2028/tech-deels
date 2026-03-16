// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { deals, users, merchants, categories, votes, comments } from '@tech-deels/db/schema';
import { desc, eq, sql, and } from 'drizzle-orm';

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const sort = url.searchParams.get('sort') ?? 'hot';
  const categorySlug = url.searchParams.get('category');
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = [eq(deals.status, 'active')];

  const dealsData = await db
    .select({
      id: deals.id,
      title: deals.title,
      url: deals.url,
      affiliateUrl: deals.affiliateUrl,
      price: deals.price,
      originalPrice: deals.originalPrice,
      shippingCost: deals.shippingCost,
      currency: deals.currency,
      status: deals.status,
      hotScore: deals.hotScore,
      createdAt: deals.createdAt,
      username: users.username,
      merchantName: merchants.name,
      merchantSlug: merchants.slug,
      categoryName: categories.name,
      categorySlug: categories.slug,
      voteScore: sql<number>`COALESCE(SUM(${votes.value}), 0)`.as('vote_score'),
      commentCount: sql<number>`COUNT(DISTINCT ${comments.id})`.as('comment_count'),
    })
    .from(deals)
    .leftJoin(users, eq(deals.userId, users.id))
    .leftJoin(merchants, eq(deals.merchantId, merchants.id))
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(votes, eq(deals.id, votes.dealId))
    .leftJoin(
      comments,
      and(eq(deals.id, comments.dealId), sql`${comments.deletedAt} IS NULL`),
    )
    .where(eq(deals.status, 'active'))
    .groupBy(
      deals.id,
      users.username,
      merchants.name,
      merchants.slug,
      categories.name,
      categories.slug,
    )
    .orderBy(sort === 'hot' ? desc(deals.hotScore) : desc(deals.createdAt))
    .limit(limit)
    .offset(offset);

  const categoriesList = await db.select().from(categories);

  return {
    deals: dealsData,
    categories: categoriesList,
    sort,
    page,
    categorySlug,
  };
};
