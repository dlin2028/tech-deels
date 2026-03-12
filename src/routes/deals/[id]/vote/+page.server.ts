import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deals, votes, users } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { cache } from '$lib/server/cache';
import type { Actions } from './$types';

async function applyVote(userId: string, dealId: number, value: 1 | -1) {
const [existingVote] = await db
.select()
.from(votes)
.where(and(eq(votes.userId, userId), eq(votes.dealId, dealId)))
.limit(1);

let scoreDelta = 0;

if (existingVote) {
if (existingVote.value === value) {
await db.delete(votes).where(and(eq(votes.userId, userId), eq(votes.dealId, dealId)));
scoreDelta = -value;
} else {
await db.update(votes).set({ value }).where(and(eq(votes.userId, userId), eq(votes.dealId, dealId)));
scoreDelta = value - existingVote.value;
}
} else {
await db.insert(votes).values({ userId, dealId, value });
scoreDelta = value;
}

// Update deal score
const [updatedDeal] = await db
.update(deals)
.set({ score: sql`${deals.score} + ${scoreDelta}` })
.where(eq(deals.id, dealId))
.returning({ score: deals.score, postedBy: deals.postedBy });

// Award reputation to deal poster (5 pts per upvote, -1 per downvote)
if (updatedDeal && scoreDelta !== 0) {
const repDelta = scoreDelta > 0 ? 5 : -1;
await db.update(users)
.set({ reputation: sql`${users.reputation} + ${repDelta}` })
.where(eq(users.id, updatedDeal.postedBy));
}

// Invalidate feed cache
cache.invalidate('feeds:');
}

export const actions: Actions = {
upvote: async ({ params, locals }) => {
if (!locals.user) error(401, 'You must be logged in to vote');
const dealId = parseInt(params.id);
if (isNaN(dealId)) error(400, 'Invalid deal ID');
await applyVote(locals.user.id, dealId, 1);
redirect(303, `/deals/${dealId}`);
},
downvote: async ({ params, locals }) => {
if (!locals.user) error(401, 'You must be logged in to vote');
const dealId = parseInt(params.id);
if (isNaN(dealId)) error(400, 'Invalid deal ID');
await applyVote(locals.user.id, dealId, -1);
redirect(303, `/deals/${dealId}`);
}
};
