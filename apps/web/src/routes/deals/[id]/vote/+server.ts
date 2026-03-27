import { db, votes, deals } from '$lib/server/db';
import { eq, sql, and } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, url }) => {
  if (!locals.user) {
    error(401, 'Must be signed in to vote.');
  }

  const dealId = parseInt(params.id);
  if (isNaN(dealId)) {
    error(400, 'Invalid deal ID.');
  }

  const voteType = url.searchParams.get('type') as 'up' | 'down' | null;
  if (!voteType || !['up', 'down'].includes(voteType)) {
    error(400, 'Invalid vote type. Use ?type=up or ?type=down');
  }

  const [existing] = await db
    .select()
    .from(votes)
    .where(and(eq(votes.dealId, dealId), eq(votes.userId, locals.user.id)))
    .limit(1);

  if (existing) {
    if (existing.voteType === voteType) {
      // Toggle off
      await db.delete(votes).where(eq(votes.id, existing.id));
      const col = voteType === 'up' ? deals.upvotes : deals.downvotes;
      await db.update(deals).set({ [voteType === 'up' ? 'upvotes' : 'downvotes']: sql`${col} - 1` }).where(eq(deals.id, dealId));
      return json({ action: 'removed', voteType });
    } else {
      // Switch vote
      await db.update(votes).set({ voteType }).where(eq(votes.id, existing.id));
      if (voteType === 'up') {
        await db.update(deals).set({ upvotes: sql`${deals.upvotes} + 1`, downvotes: sql`${deals.downvotes} - 1` }).where(eq(deals.id, dealId));
      } else {
        await db.update(deals).set({ downvotes: sql`${deals.downvotes} + 1`, upvotes: sql`${deals.upvotes} - 1` }).where(eq(deals.id, dealId));
      }
      return json({ action: 'switched', voteType });
    }
  }

  await db.insert(votes).values({ userId: locals.user.id, dealId, voteType });
  const col = voteType === 'up' ? deals.upvotes : deals.downvotes;
  await db.update(deals).set({ [voteType === 'up' ? 'upvotes' : 'downvotes']: sql`${col} + 1` }).where(eq(deals.id, dealId));

  return json({ action: 'voted', voteType });
};
