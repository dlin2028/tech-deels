import { error } from "@sveltejs/kit";
import { d as db, u as users, g as moderationReports } from "../../../../chunks/db.js";
import { eq, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin" && locals.user.role !== "moderator") {
    error(403, "Forbidden");
  }
  const reports = await db.select({
    id: moderationReports.id,
    targetType: moderationReports.targetType,
    targetId: moderationReports.targetId,
    reason: moderationReports.reason,
    details: moderationReports.details,
    status: moderationReports.status,
    createdAt: moderationReports.createdAt,
    reporterUsername: users.username
  }).from(moderationReports).leftJoin(users, eq(moderationReports.reporterId, users.id)).where(eq(moderationReports.status, "pending")).orderBy(desc(moderationReports.createdAt)).limit(50);
  return { reports };
};
export {
  load
};
