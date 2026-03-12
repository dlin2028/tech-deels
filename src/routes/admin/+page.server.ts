import { error, redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { flags, deals, comments, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { cache } from '$lib/server/cache';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	if (!locals.user.isAdmin) error(403, 'Admin access required');

	const [openFlags, recentDealsRaw, flaggedUsers] = await Promise.all([
		db
			.select({
				id: flags.id,
				reason: flags.reason,
				details: flags.details,
				status: flags.status,
				createdAt: flags.createdAt,
				dealId: flags.dealId,
				commentId: flags.commentId,
				reporterUsername: users.username
			})
			.from(flags)
			.leftJoin(users, eq(flags.reporterId, users.id))
			.where(eq(flags.status, 'pending'))
			.orderBy(desc(flags.createdAt))
			.limit(50),

		db
			.select({
				id: deals.id,
				title: deals.title,
				status: deals.status,
				score: deals.score,
				store: deals.store,
				createdAt: deals.createdAt,
				postedBy: deals.postedBy,
				posterUsername: users.username
			})
			.from(deals)
			.leftJoin(users, eq(deals.postedBy, users.id))
			.orderBy(desc(deals.createdAt))
			.limit(20),

		db
			.select({
				id: users.id,
				username: users.username,
				email: users.email,
				reputation: users.reputation,
				isAdmin: users.isAdmin,
				createdAt: users.createdAt
			})
			.from(users)
			.orderBy(desc(users.createdAt))
			.limit(20)
	]);

	return {
		openFlags,
		recentDeals: recentDealsRaw,
		users: flaggedUsers
	};
};

export const actions: Actions = {
	resolveFlag: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) error(403, 'Admin only');

		const formData = await request.formData();
		const flagId = parseInt(String(formData.get('flagId')));
		const action = formData.get('action'); // 'resolve' or 'dismiss'

		if (isNaN(flagId)) return fail(400, { error: 'Invalid flag ID' });

		const status = action === 'resolve' ? 'resolved' : 'dismissed';
		await db
			.update(flags)
			.set({ status, resolvedBy: locals.user.id })
			.where(eq(flags.id, flagId));

		return { success: true };
	},

	deleteDeal: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) error(403, 'Admin only');

		const formData = await request.formData();
		const dealId = parseInt(String(formData.get('dealId')));
		if (isNaN(dealId)) return fail(400, { error: 'Invalid deal ID' });

		await db.update(deals).set({ status: 'expired' }).where(eq(deals.id, dealId));
		cache.invalidate('feeds:');

		return { deleted: true };
	},

	toggleAdmin: async ({ request, locals }) => {
		if (!locals.user?.isAdmin) error(403, 'Admin only');

		const formData = await request.formData();
		const userId = String(formData.get('userId'));
		const makeAdmin = formData.get('makeAdmin') === 'true';

		if (!userId) return fail(400, { error: 'Invalid user' });

		await db.update(users).set({ isAdmin: makeAdmin }).where(eq(users.id, userId));

		return { updated: true };
	}
};
