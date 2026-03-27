import { db, deals, categories, users } from '$lib/server/db';
import { eq, desc, ilike, or, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  if (!query) {
    return { deals: [], query, page, pageSize, totalDeals: 0 };
  }

  const searchPattern = `%${query}%`;

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
      url: deals.url,
      categoryName: categories.name,
      categorySlug: categories.slug,
      username: users.username,
    })
    .from(deals)
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(users, eq(deals.userId, users.id))
    .where(
      or(
        ilike(deals.title, searchPattern),
        ilike(deals.store, searchPattern),
        ilike(deals.brand, searchPattern),
        ilike(deals.description, searchPattern)
      )
    )
    .orderBy(desc(deals.hotScore))
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(deals)
    .where(
      or(
        ilike(deals.title, searchPattern),
        ilike(deals.store, searchPattern),
        ilike(deals.brand, searchPattern),
        ilike(deals.description, searchPattern)
      )
    );

  return { deals: dealList, query, page, pageSize, totalDeals: count };
};
