import { e as error, j as json } from './index-B2LGyy1l.js';
import { d as db, v as votes, b as deals } from './db-bOqIGVC4.js';
import { and, eq, sql } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';

const POST = async ({ request, locals, params }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  const dealId = Number(params.id);
  if (isNaN(dealId)) throw error(400, "Invalid deal ID");
  const body = await request.json();
  const value = body.value;
  if (value !== 1 && value !== -1) {
    throw error(400, "Vote value must be 1 or -1");
  }
  const [existingVote] = await db.select().from(votes).where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId))).limit(1);
  let userVote = value;
  if (existingVote) {
    if (existingVote.value === value) {
      await db.delete(votes).where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId)));
      userVote = null;
    } else {
      await db.update(votes).set({ value }).where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, dealId)));
    }
  } else {
    await db.insert(votes).values({
      user_id: locals.user.id,
      deal_id: dealId,
      value
    });
  }
  const scoreResult = await db.select({ total: sql`coalesce(sum(${votes.value}), 0)` }).from(votes).where(eq(votes.deal_id, dealId));
  const newScore = Number(scoreResult[0]?.total ?? 0);
  await db.update(deals).set({ score: newScore }).where(eq(deals.id, dealId));
  return json({ score: newScore, userVote });
};

export { POST };
//# sourceMappingURL=_server.ts-uQJY09Uj.js.map
