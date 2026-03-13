import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deal, user, dealFlag } from '$lib/server/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'moderator')) {
		error(403, 'Forbidden');
	}

	const [dealCount] = await db.select({ count: count() }).from(deal);
	const [userCount] = await db.select({ count: count() }).from(user);
	const [flagCount] = await db.select({ count: count() }).from(dealFlag);

	const recentDeals = await db
		.select({
			deal: deal,
			user: { id: user.id, username: user.username }
		})
		.from(deal)
		.leftJoin(user, eq(deal.userId, user.id))
		.orderBy(desc(deal.createdAt))
		.limit(20);

	const flags = await db
		.select({
			flag: dealFlag,
			deal: { id: deal.id, title: deal.title },
			reporter: { id: user.id, username: user.username }
		})
		.from(dealFlag)
		.leftJoin(deal, eq(dealFlag.dealId, deal.id))
		.leftJoin(user, eq(dealFlag.userId, user.id))
		.orderBy(desc(dealFlag.createdAt))
		.limit(20);

	const users = await db
		.select()
		.from(user)
		.orderBy(desc(user.createdAt))
		.limit(20);

	return {
		stats: {
			deals: dealCount?.count ?? 0,
			users: userCount?.count ?? 0,
			flags: flagCount?.count ?? 0
		},
		recentDeals: recentDeals.map((r) => ({ ...r.deal, user: r.user })),
		flags: flags.map((r) => ({ ...r.flag, deal: r.deal, reporter: r.reporter })),
		users
	};
};

export const actions: Actions = {
	updateDealStatus: async ({ request, locals }) => {
		if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'moderator')) {
			return fail(403, { message: 'Forbidden' });
		}
		const formData = await request.formData();
		const dealId = formData.get('dealId')?.toString();
		const status = formData.get('status')?.toString() as 'active' | 'expired' | 'pending' | 'rejected';

		if (!dealId || !status) return fail(400, { message: 'Invalid data' });

		await db.update(deal).set({ status }).where(eq(deal.id, dealId));
		return { success: true };
	},
	updateUserRole: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { message: 'Forbidden' });
		}
		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();
		const role = formData.get('role')?.toString() as 'user' | 'moderator' | 'admin';

		if (!userId || !role) return fail(400, { message: 'Invalid data' });

		await db.update(user).set({ role }).where(eq(user.id, userId));
		return { success: true };
	}
};
