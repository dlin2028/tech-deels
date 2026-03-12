import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, deals, comments } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { username } = params;

	const [user] = await db
		.select({
			id: users.id,
			username: users.username,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
			reputation: users.reputation,
			isAdmin: users.isAdmin,
			createdAt: users.createdAt
		})
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	if (!user) error(404, `User @${username} not found`);

	const [recentDeals, recentComments, stats] = await Promise.all([
		db
			.select({
				id: deals.id,
				title: deals.title,
				price: deals.price,
				store: deals.store,
				score: deals.score,
				status: deals.status,
				createdAt: deals.createdAt,
				commentCount: sql<number>`(select count(*) from comments where deal_id = ${deals.id})`.mapWith(Number)
			})
			.from(deals)
			.where(eq(deals.postedBy, user.id))
			.orderBy(desc(deals.createdAt))
			.limit(10),

		db
			.select({
				id: comments.id,
				dealId: comments.dealId,
				content: comments.content,
				score: comments.score,
				createdAt: comments.createdAt
			})
			.from(comments)
			.where(eq(comments.authorId, user.id))
			.orderBy(desc(comments.createdAt))
			.limit(10),

		db
			.select({
				dealCount: sql<number>`count(distinct ${deals.id})`.mapWith(Number),
				commentCount: sql<number>`count(distinct ${comments.id})`.mapWith(Number)
			})
			.from(users)
			.leftJoin(deals, eq(deals.postedBy, users.id))
			.leftJoin(comments, eq(comments.authorId, users.id))
			.where(eq(users.id, user.id))
			.groupBy(users.id)
	]);

	const isOwnProfile = locals.user?.id === user.id;

	return {
		profile: user,
		recentDeals,
		recentComments,
		stats: stats[0] ?? { dealCount: 0, commentCount: 0 },
		isOwnProfile
	};
};
