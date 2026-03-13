import { db, deals, categories, users } from '$lib/server/db';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const sort = url.searchParams.get('sort') ?? 'hot';
  const categorySlug = url.searchParams.get('category') ?? null;
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    // Build order clause
    const orderClause = sort === 'new'
      ? desc(deals.createdAt)
      : sort === 'top'
        ? desc(deals.score)
        : desc(deals.hotScore);

    let query = db
      .select({
        id: deals.id,
        title: deals.title,
        description: deals.description,
        url: deals.url,
        price: deals.price,
        originalPrice: deals.originalPrice,
        shippingCost: deals.shippingCost,
        store: deals.store,
        brand: deals.brand,
        imageUrl: deals.imageUrl,
        status: deals.status,
        condition: deals.condition,
        upvotes: deals.upvotes,
        downvotes: deals.downvotes,
        commentCount: deals.commentCount,
        viewCount: deals.viewCount,
        isFeatured: deals.isFeatured,
        hotScore: deals.hotScore,
        score: deals.score,
        createdAt: deals.createdAt,
        categoryId: deals.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        username: users.username,
      })
      .from(deals)
      .leftJoin(categories, eq(deals.categoryId, categories.id))
      .leftJoin(users, eq(deals.userId, users.id))
      .where(eq(deals.status, 'active'))
      .orderBy(orderClause)
      .limit(pageSize)
      .offset(offset);

    const dealList = await query;

    // Count total active deals
    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(deals)
      .where(eq(deals.status, 'active'));

    return {
      deals: dealList,
      sort,
      page,
      pageSize,
      totalDeals: count,
    };
  } catch (err) {
    console.error('Failed to load deals:', err);
    return {
      deals: [],
      sort,
      page,
      pageSize,
      totalDeals: 0,
    };
  }
};
