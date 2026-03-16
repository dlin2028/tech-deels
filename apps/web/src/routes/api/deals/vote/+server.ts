import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db.js';
import { votes, deals } from '@tech-deels/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dealId, value } = await request.json();

  if (![1, -1].includes(value)) {
    return json({ error: 'Invalid vote value' }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(votes)
    .where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId)))
    .limit(1);

  if (existing.length) {
    if (existing[0].value === value) {
      await db.delete(votes).where(eq(votes.id, existing[0].id));
    } else {
      await db.update(votes).set({ value }).where(eq(votes.id, existing[0].id));
    }
  } else {
    await db.insert(votes).values({ userId: locals.user.id, dealId, value });
  }

  // Recalculate hot score
  const [dealRow] = await db
    .select({ createdAt: deals.createdAt })
    .from(deals)
    .where(eq(deals.id, dealId))
    .limit(1);

  if (dealRow) {
    const [voteResult] = await db
      .select({ score: sql<number>`COALESCE(SUM(${votes.value}), 0)` })
      .from(votes)
      .where(eq(votes.dealId, dealId));

    const score = Number(voteResult?.score ?? 0);
    const ageHours = (Date.now() - dealRow.createdAt.getTime()) / 3_600_000;
    const hotScore = score / Math.pow(ageHours + 2, 1.8);

    await db.update(deals).set({ hotScore }).where(eq(deals.id, dealId));
  }

  return json({ success: true });
};
