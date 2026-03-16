// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { users, deals, categories, merchants, votes, comments } from '@tech-deels/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      reputation: users.reputation,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
      role: users.role,
    })
    .from(users)
    .where(eq(users.username, params.username))
    .limit(1);

  if (!user) error(404, 'User not found');

  const userDeals = await db
    .select({
      id: deals.id,
      title: deals.title,
      price: deals.price,
      originalPrice: deals.originalPrice,
      createdAt: deals.createdAt,
      categoryName: categories.name,
      merchantName: merchants.name,
      voteScore: sql<number>`COALESCE(SUM(${votes.value}), 0)`,
      commentCount: sql<number>`COUNT(DISTINCT ${comments.id})`,
    })
    .from(deals)
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(merchants, eq(deals.merchantId, merchants.id))
    .leftJoin(votes, eq(deals.id, votes.dealId))
    .leftJoin(comments, and(eq(deals.id, comments.dealId), sql`${comments.deletedAt} IS NULL`))
    .where(eq(deals.userId, user.id))
    .groupBy(deals.id, categories.name, merchants.name)
    .orderBy(desc(deals.createdAt))
    .limit(20);

  return { profile: user, deals: userDeals };
};
