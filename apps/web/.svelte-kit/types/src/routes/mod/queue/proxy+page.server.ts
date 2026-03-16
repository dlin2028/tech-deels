// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { moderationReports, users } from '@tech-deels/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'moderator')) {
    error(403, 'Forbidden');
  }

  const reports = await db
    .select({
      id: moderationReports.id,
      targetType: moderationReports.targetType,
      targetId: moderationReports.targetId,
      reason: moderationReports.reason,
      details: moderationReports.details,
      status: moderationReports.status,
      createdAt: moderationReports.createdAt,
      reporterUsername: users.username,
    })
    .from(moderationReports)
    .leftJoin(users, eq(moderationReports.reporterId, users.id))
    .where(eq(moderationReports.status, 'pending'))
    .orderBy(desc(moderationReports.createdAt))
    .limit(50);

  return { reports };
};
