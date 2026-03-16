import { json } from "@sveltejs/kit";
import { d as db, s as savedDeals } from "../../../../../chunks/db.js";
import { and, eq } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { dealId } = await request.json();
  const existing = await db.select().from(savedDeals).where(and(eq(savedDeals.userId, locals.user.id), eq(savedDeals.dealId, dealId))).limit(1);
  if (existing.length) {
    await db.delete(savedDeals).where(eq(savedDeals.id, existing[0].id));
    return json({ saved: false });
  } else {
    await db.insert(savedDeals).values({ userId: locals.user.id, dealId });
    return json({ saved: true });
  }
};
export {
  POST
};
