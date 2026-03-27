import { db, deals, comments, categories, users, votes, savedDeals } from '$lib/server/db';
import { eq, desc, sql, and } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const dealId = parseInt(params.id);

  if (isNaN(dealId)) {
    error(404, 'Deal not found');
  }

  // Increment view count
  await db
    .update(deals)
    .set({ viewCount: sql`${deals.viewCount} + 1` })
    .where(eq(deals.id, dealId));

  // Fetch deal with user and category
  const [deal] = await db
    .select({
      id: deals.id,
      title: deals.title,
      description: deals.description,
      url: deals.url,
      affiliateUrl: deals.affiliateUrl,
      imageUrl: deals.imageUrl,
      price: deals.price,
      originalPrice: deals.originalPrice,
      shippingCost: deals.shippingCost,
      store: deals.store,
      brand: deals.brand,
      status: deals.status,
      condition: deals.condition,
      upvotes: deals.upvotes,
      downvotes: deals.downvotes,
      commentCount: deals.commentCount,
      viewCount: deals.viewCount,
      clickCount: deals.clickCount,
      isFeatured: deals.isFeatured,
      hotScore: deals.hotScore,
      score: deals.score,
      expiresAt: deals.expiresAt,
      createdAt: deals.createdAt,
      updatedAt: deals.updatedAt,
      userId: deals.userId,
      categoryId: deals.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      username: users.username,
      userReputation: users.reputation,
    })
    .from(deals)
    .leftJoin(categories, eq(deals.categoryId, categories.id))
    .leftJoin(users, eq(deals.userId, users.id))
    .where(eq(deals.id, dealId))
    .limit(1);

  if (!deal) {
    error(404, 'Deal not found');
  }

  // Fetch top-level comments with user info
  const dealComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      userId: comments.userId,
      parentId: comments.parentId,
      upvotes: comments.upvotes,
      downvotes: comments.downvotes,
      isDeleted: comments.isDeleted,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      username: users.username,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.dealId, dealId), eq(comments.isDeleted, false)))
    .orderBy(desc(comments.createdAt));

  // Get user's vote on this deal if logged in
  let userVote: 'up' | 'down' | null = null;
  let isSaved = false;

  if (locals.user) {
    const [existingVote] = await db
      .select({ voteType: votes.voteType })
      .from(votes)
      .where(and(eq(votes.dealId, dealId), eq(votes.userId, locals.user.id)))
      .limit(1);
    userVote = existingVote?.voteType ?? null;

    const [saved] = await db
      .select({ id: savedDeals.id })
      .from(savedDeals)
      .where(and(eq(savedDeals.dealId, dealId), eq(savedDeals.userId, locals.user.id)))
      .limit(1);
    isSaved = !!saved;
  }

  // Build comment tree
  const topLevel = dealComments.filter((c) => !c.parentId);
  const replies = dealComments.filter((c) => !!c.parentId);

  const commentTree = topLevel.map((c) => ({
    ...c,
    replies: replies.filter((r) => r.parentId === c.id),
  }));

  return {
    deal,
    comments: commentTree,
    userVote,
    isSaved,
  };
};

export const actions: Actions = {
  upvote: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: 'Must be signed in to vote.' });
    const dealId = parseInt(params.id);
    if (isNaN(dealId)) return fail(400, { error: 'Invalid deal.' });

    const [existing] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.dealId, dealId), eq(votes.userId, locals.user.id)))
      .limit(1);

    if (existing) {
      if (existing.voteType === 'up') {
        // Remove vote
        await db.delete(votes).where(eq(votes.id, existing.id));
        await db.update(deals).set({ upvotes: sql`${deals.upvotes} - 1` }).where(eq(deals.id, dealId));
      } else {
        // Switch to upvote
        await db.update(votes).set({ voteType: 'up' }).where(eq(votes.id, existing.id));
        await db
          .update(deals)
          .set({ upvotes: sql`${deals.upvotes} + 1`, downvotes: sql`${deals.downvotes} - 1` })
          .where(eq(deals.id, dealId));
      }
    } else {
      await db.insert(votes).values({ userId: locals.user.id, dealId, voteType: 'up' });
      await db.update(deals).set({ upvotes: sql`${deals.upvotes} + 1` }).where(eq(deals.id, dealId));
    }

    return { success: true };
  },

  downvote: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: 'Must be signed in to vote.' });
    const dealId = parseInt(params.id);
    if (isNaN(dealId)) return fail(400, { error: 'Invalid deal.' });

    const [existing] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.dealId, dealId), eq(votes.userId, locals.user.id)))
      .limit(1);

    if (existing) {
      if (existing.voteType === 'down') {
        await db.delete(votes).where(eq(votes.id, existing.id));
        await db.update(deals).set({ downvotes: sql`${deals.downvotes} - 1` }).where(eq(deals.id, dealId));
      } else {
        await db.update(votes).set({ voteType: 'down' }).where(eq(votes.id, existing.id));
        await db
          .update(deals)
          .set({ downvotes: sql`${deals.downvotes} + 1`, upvotes: sql`${deals.upvotes} - 1` })
          .where(eq(deals.id, dealId));
      }
    } else {
      await db.insert(votes).values({ userId: locals.user.id, dealId, voteType: 'down' });
      await db.update(deals).set({ downvotes: sql`${deals.downvotes} + 1` }).where(eq(deals.id, dealId));
    }

    return { success: true };
  },

  save: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: 'Must be signed in to save deals.' });
    const dealId = parseInt(params.id);
    if (isNaN(dealId)) return fail(400, { error: 'Invalid deal.' });

    const [existing] = await db
      .select()
      .from(savedDeals)
      .where(and(eq(savedDeals.dealId, dealId), eq(savedDeals.userId, locals.user.id)))
      .limit(1);

    if (existing) {
      await db.delete(savedDeals).where(eq(savedDeals.id, existing.id));
    } else {
      await db.insert(savedDeals).values({ userId: locals.user.id, dealId });
    }

    return { success: true };
  },

  comment: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Must be signed in to comment.' });
    const dealId = parseInt(params.id);
    if (isNaN(dealId)) return fail(400, { error: 'Invalid deal.' });

    const formData = await request.formData();
    const content = String(formData.get('content') ?? '').trim();
    const parentId = formData.get('parentId') ? parseInt(String(formData.get('parentId'))) : null;

    if (!content || content.length < 2) {
      return fail(400, { error: 'Comment must be at least 2 characters.' });
    }
    if (content.length > 5000) {
      return fail(400, { error: 'Comment must be 5000 characters or less.' });
    }

    await db.insert(comments).values({
      content,
      userId: locals.user.id,
      dealId,
      parentId,
    });

    await db
      .update(deals)
      .set({ commentCount: sql`${deals.commentCount} + 1` })
      .where(eq(deals.id, dealId));

    return { success: true };
  },
};
