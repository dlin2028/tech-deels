import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, deal, category } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const [profileUser] = await db.select().from(user).where(eq(user.username, params.username));
	if (!profileUser) error(404, 'User not found');

	const deals = await db
		.select({
			deal: deal,
			category: category
		})
		.from(deal)
		.leftJoin(category, eq(deal.categoryId, category.id))
		.where(eq(deal.userId, profileUser.id))
		.orderBy(desc(deal.createdAt))
		.limit(20);

	return {
		profileUser: {
			id: profileUser.id,
			username: profileUser.username,
			avatarUrl: profileUser.avatarUrl,
			bio: profileUser.bio,
			reputation: profileUser.reputation,
			role: profileUser.role,
			createdAt: profileUser.createdAt
		},
		deals: deals.map((r) => ({ ...r.deal, category: r.category }))
	};
};
