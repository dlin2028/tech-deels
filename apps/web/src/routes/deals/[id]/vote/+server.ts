import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { votes, deals } from "@tech-deels/db";
import { eq, and, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals, params }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }

  const dealId = Number(params.id);
  if (isNaN(dealId)) throw error(400, "Invalid deal ID");

  const body = await request.json();
  const value = body.value as number;

  if (value !== 1 && value !== -1) {
    throw error(400, "Vote value must be 1 or -1");
  }

  // Check existing vote
  const [existingVote] = await db
    .select()
    .from(votes)
    .where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId)))
    .limit(1);

  let userVote: number | null = value;

  if (existingVote) {
    if (existingVote.value === value) {
      // Toggle off (remove vote)
      await db
        .delete(votes)
        .where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId)));
      userVote = null;
    } else {
      // Change vote
      await db
        .update(votes)
        .set({ value })
        .where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId)));
    }
  } else {
    // Insert new vote
    await db.insert(votes).values({
      user_id: locals.user.id,
      deal_id: dealId,
      value,
    });
  }

  // Recalculate score
  const scoreResult = await db
    .select({ total: sql<number>`coalesce(sum(${votes.value}), 0)` })
    .from(votes)
    .where(eq(votes.deal_id, dealId));

  const newScore = Number(scoreResult[0]?.total ?? 0);

  await db
    .update(deals)
    .set({ score: newScore })
    .where(eq(deals.id, dealId));

  return json({ score: newScore, userVote });
};
