import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { deals, users, merchants, categories, votes, comments, dealSpecs } from '@tech-deels/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
  const dealId = Number(params.id);
  if (isNaN(dealId)) error(404, 'Deal not found');

  const [deal] = await db
    .select({
      id: deals.id,
      title: deals.title,
      url: deals.url,
      affiliateUrl: deals.affiliateUrl,
      price: deals.price,
      originalPrice: deals.originalPrice,
      shippingCost: deals.shippingCost,
      currency: deals.currency,
      description: deals.description,
      status: deals.status,
      hotScore: deals.hotScore,
      createdAt: deals.createdAt,
      updatedAt: deals.updatedAt,
      username: users.username,
      userId: deals.userId,
      merchantName: merchants.name,
      merchantSlug: merchants.slug,
      categoryName: categories.name,
      categorySlug: categories.slug,
      voteScore: sql<number>`COALESCE(SUM(${votes.value}), 0)`,
    })
    .from(deals)
    .leftJoin(users, eq(deals.userId, users.id))
    .leftJoin(merchants, eq(deals.merchantId, merchants.id))
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(votes, eq(deals.id, votes.dealId))
    .where(eq(deals.id, dealId))
    .groupBy(deals.id, users.username, merchants.name, merchants.slug, categories.name, categories.slug);

  if (!deal) error(404, 'Deal not found');

  const specs = await db.select().from(dealSpecs).where(eq(dealSpecs.dealId, dealId)).limit(1);

  const commentsData = await db
    .select({
      id: comments.id,
      body: comments.body,
      score: comments.score,
      parentId: comments.parentId,
      createdAt: comments.createdAt,
      deletedAt: comments.deletedAt,
      username: users.username,
      userId: comments.userId,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.dealId, dealId), isNull(comments.deletedAt)))
    .orderBy(comments.createdAt);

  // Get user's vote if logged in
  let userVote: number | null = null;
  if (locals.user) {
    const uv = await db
      .select({ value: votes.value })
      .from(votes)
      .where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId)))
      .limit(1);
    userVote = uv[0]?.value ?? null;
  }

  return {
    deal,
    specs: specs[0] ?? null,
    comments: commentsData,
    userVote,
  };
};
