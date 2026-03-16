import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db.js';
import { commentVotes, comments } from '@tech-deels/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const commentId = Number(params.id);
  if (isNaN(commentId)) return json({ error: 'Invalid comment ID' }, { status: 400 });

  const { value } = await request.json();
  if (![1, -1].includes(value)) {
    return json({ error: 'Invalid vote value' }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(commentVotes)
    .where(and(eq(commentVotes.userId, locals.user.id), eq(commentVotes.commentId, commentId)))
    .limit(1);

  if (existing.length) {
    if (existing[0].value === value) {
      await db.delete(commentVotes).where(eq(commentVotes.id, existing[0].id));
    } else {
      await db.update(commentVotes).set({ value }).where(eq(commentVotes.id, existing[0].id));
    }
  } else {
    await db.insert(commentVotes).values({ userId: locals.user.id, commentId, value });
  }

  // Update comment score
  const [scoreResult] = await db
    .select({ score: sql<number>`COALESCE(SUM(${commentVotes.value}), 0)` })
    .from(commentVotes)
    .where(eq(commentVotes.commentId, commentId));

  const newScore = Number(scoreResult?.score ?? 0);
  await db.update(comments).set({ score: newScore }).where(eq(comments.id, commentId));

  return json({ score: newScore });
};
