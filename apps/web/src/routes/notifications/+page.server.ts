import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { notifications, users } from '@tech-deels/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/login');

  const notifs = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      read: notifications.read,
      createdAt: notifications.createdAt,
      dealId: notifications.dealId,
      commentId: notifications.commentId,
      actorUsername: users.username,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.actorId, users.id))
    .where(eq(notifications.userId, locals.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  // Mark all as read
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, locals.user.id));

  return { notifications: notifs };
};
