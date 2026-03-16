import { json } from "@sveltejs/kit";
import { d as db, v as votes, b as deals } from "../../../../../chunks/db.js";
import { and, eq, sql } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { dealId, value } = await request.json();
  if (![1, -1].includes(value)) {
    return json({ error: "Invalid vote value" }, { status: 400 });
  }
  const existing = await db.select().from(votes).where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId))).limit(1);
  if (existing.length) {
    if (existing[0].value === value) {
      await db.delete(votes).where(eq(votes.id, existing[0].id));
    } else {
      await db.update(votes).set({ value }).where(eq(votes.id, existing[0].id));
    }
  } else {
    await db.insert(votes).values({ userId: locals.user.id, dealId, value });
  }
  const [dealRow] = await db.select({ createdAt: deals.createdAt }).from(deals).where(eq(deals.id, dealId)).limit(1);
  if (dealRow) {
    const [voteResult] = await db.select({ score: sql`COALESCE(SUM(${votes.value}), 0)` }).from(votes).where(eq(votes.dealId, dealId));
    const score = Number(voteResult?.score ?? 0);
    const ageHours = (Date.now() - dealRow.createdAt.getTime()) / 36e5;
    const hotScore = score / Math.pow(ageHours + 2, 1.8);
    await db.update(deals).set({ hotScore }).where(eq(deals.id, dealId));
  }
  return json({ success: true });
};
export {
  POST
};
