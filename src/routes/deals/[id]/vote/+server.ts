import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deals, votes, users } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { cache } from '$lib/server/cache';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
if (!locals.user) error(401, 'You must be logged in to vote');

const dealId = parseInt(params.id);
if (isNaN(dealId)) error(400, 'Invalid deal ID');

const body = await request.json().catch(() => ({}));
const value = body.value === 1 ? 1 : body.value === -1 ? -1 : null;
if (value === null) error(400, 'Vote value must be 1 or -1');

const [existingVote] = await db
.select()
.from(votes)
.where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId)))
.limit(1);

let scoreDelta = 0;

if (existingVote) {
if (existingVote.value === value) {
await db.delete(votes).where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId)));
scoreDelta = -value;
} else {
await db.update(votes).set({ value }).where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId)));
scoreDelta = value - existingVote.value;
}
} else {
await db.insert(votes).values({ userId: locals.user.id, dealId, value });
scoreDelta = value;
}

const [updated] = await db
.update(deals)
.set({ score: sql`${deals.score} + ${scoreDelta}` })
.where(eq(deals.id, dealId))
.returning({ score: deals.score, postedBy: deals.postedBy });

// Reputation: 5 pts per net upvote, -1 per net downvote
if (updated && scoreDelta !== 0) {
const repDelta = scoreDelta > 0 ? 5 : -1;
await db.update(users)
.set({ reputation: sql`${users.reputation} + ${repDelta}` })
.where(eq(users.id, updated.postedBy));
}

cache.invalidate('feeds:');
return json({ score: updated.score, myVote: value });
};
