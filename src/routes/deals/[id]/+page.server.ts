import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deals, categories, comments, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const dealId = parseInt(params.id);
	if (isNaN(dealId)) error(404, 'Deal not found');

	const [deal] = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
	if (!deal) error(404, 'Deal not found');

	const [category, poster, dealComments] = await Promise.all([
		deal.categoryId
			? db.select().from(categories).where(eq(categories.id, deal.categoryId)).limit(1)
			: Promise.resolve([]),
		db.select({ username: users.username }).from(users).where(eq(users.id, deal.postedBy)).limit(1),
		db
			.select({
				id: comments.id,
				dealId: comments.dealId,
				authorId: comments.authorId,
				parentId: comments.parentId,
				content: comments.content,
				score: comments.score,
				createdAt: comments.createdAt,
				authorUsername: users.username
			})
			.from(comments)
			.leftJoin(users, eq(comments.authorId, users.id))
			.where(eq(comments.dealId, dealId))
			.orderBy(comments.createdAt)
	]);

	return {
		deal: {
			...deal,
			category: category[0] ?? null,
			poster: poster[0] ?? null
		},
		comments: dealComments,
		user: locals.user
	};
};

export const actions: Actions = {
	comment: async ({ request, locals, params }) => {
		if (!locals.user) return fail(401, { error: 'You must be logged in to comment' });

		const dealId = parseInt(params.id);
		if (isNaN(dealId)) return fail(400, { error: 'Invalid deal' });

		const formData = await request.formData();
		const content = formData.get('content');
		const parentIdStr = formData.get('parentId');

		if (typeof content !== 'string' || !content.trim()) {
			return fail(400, { error: 'Comment cannot be empty' });
		}

		const parentId =
			parentIdStr && typeof parentIdStr === 'string' && parentIdStr.trim()
				? parseInt(parentIdStr)
				: null;

		await db.insert(comments).values({
			dealId,
			authorId: locals.user.id,
			parentId,
			content: content.trim(),
			score: 0
		});

		return { success: true };
	}
};
