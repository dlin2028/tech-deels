import { db, deals, categories, users } from '$lib/server/db';
import { eq, desc, sql, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, params.slug))
    .limit(1);

  if (!category) {
    error(404, 'Category not found');
  }

  const sort = url.searchParams.get('sort') ?? 'hot';
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const orderClause = sort === 'new'
    ? desc(deals.createdAt)
    : sort === 'top'
      ? desc(deals.score)
      : desc(deals.hotScore);

  const dealList = await db
    .select({
      id: deals.id,
      title: deals.title,
      price: deals.price,
      originalPrice: deals.originalPrice,
      shippingCost: deals.shippingCost,
      store: deals.store,
      brand: deals.brand,
      imageUrl: deals.imageUrl,
      status: deals.status,
      upvotes: deals.upvotes,
      downvotes: deals.downvotes,
      commentCount: deals.commentCount,
      isFeatured: deals.isFeatured,
      hotScore: deals.hotScore,
      createdAt: deals.createdAt,
      username: users.username,
      url: deals.url,
    })
    .from(deals)
    .leftJoin(users, eq(deals.userId, users.id))
    .where(and(eq(deals.categoryId, category.id), eq(deals.status, 'active')))
    .orderBy(orderClause)
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(deals)
    .where(and(eq(deals.categoryId, category.id), eq(deals.status, 'active')));

  return { category, deals: dealList, sort, page, pageSize, totalDeals: count };
};
