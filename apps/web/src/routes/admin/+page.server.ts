import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { users, deals, comments } from '@tech-deels/db/schema';
import { count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const [userCount] = await db.select({ count: count() }).from(users);
  const [dealCount] = await db.select({ count: count() }).from(deals);
  const [commentCount] = await db.select({ count: count() }).from(comments);

  return {
    stats: {
      users: userCount.count,
      deals: dealCount.count,
      comments: commentCount.count,
    },
  };
};
