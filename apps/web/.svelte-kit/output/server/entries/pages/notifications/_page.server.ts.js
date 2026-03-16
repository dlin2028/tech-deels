import { redirect } from "@sveltejs/kit";
import { d as db, u as users, n as notifications } from "../../../chunks/db.js";
import { eq, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user) redirect(302, "/login");
  const notifs = await db.select({
    id: notifications.id,
    type: notifications.type,
    read: notifications.read,
    createdAt: notifications.createdAt,
    dealId: notifications.dealId,
    commentId: notifications.commentId,
    actorUsername: users.username
  }).from(notifications).leftJoin(users, eq(notifications.actorId, users.id)).where(eq(notifications.userId, locals.user.id)).orderBy(desc(notifications.createdAt)).limit(50);
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, locals.user.id));
  return { notifications: notifs };
};
export {
  load
};
