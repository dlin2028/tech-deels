import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { vote, deal } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { generateId } from '$lib/utils';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const body = await request.json();
	const value = body.value;

	if (value !== 1 && value !== -1) error(400, 'Invalid vote value');

	const dealId = params.id;
	const userId = locals.user.id;

	// Check if deal exists
	const [existingDeal] = await db.select().from(deal).where(eq(deal.id, dealId));
	if (!existingDeal) error(404, 'Deal not found');

	// Get existing vote
	const [existingVote] = await db
		.select()
		.from(vote)
		.where(and(eq(vote.userId, userId), eq(vote.dealId, dealId)));

	let scoreDelta = 0;
	let newUserVote: number | null = null;

	if (existingVote) {
		if (existingVote.value === value) {
			// Toggle off (remove vote)
			await db.delete(vote).where(eq(vote.id, existingVote.id));
			scoreDelta = -value;
			newUserVote = null;
		} else {
			// Change vote
			await db.update(vote).set({ value }).where(eq(vote.id, existingVote.id));
			scoreDelta = value * 2;
			newUserVote = value;
		}
	} else {
		// New vote
		await db.insert(vote).values({ id: generateId(), userId, dealId, value });
		scoreDelta = value;
		newUserVote = value;
	}

	// Update deal score
	const [updatedDeal] = await db
		.update(deal)
		.set({ score: sql`${deal.score} + ${scoreDelta}` })
		.where(eq(deal.id, dealId))
		.returning({ score: deal.score });

	return json({ score: updatedDeal.score, userVote: newUserVote });
};
