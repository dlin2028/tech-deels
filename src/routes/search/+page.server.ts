import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { deal, user, category } from '$lib/server/db/schema';
import { eq, ilike, or, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() || '';
	const categorySlug = url.searchParams.get('category') || '';

	if (!q && !categorySlug) {
		const categories = await db.select().from(category).orderBy(category.name);
		return { deals: [], query: q, categories, categorySlug };
	}

	const categories = await db.select().from(category).orderBy(category.name);

	let whereClause;
	const searchCondition = q
		? or(ilike(deal.title, `%${q}%`), ilike(deal.description, `%${q}%`))
		: undefined;

	const categoryCondition = categorySlug
		? eq(category.slug, categorySlug)
		: undefined;

	if (searchCondition && categoryCondition) {
		whereClause = and(eq(deal.status, 'active'), searchCondition, categoryCondition);
	} else if (searchCondition) {
		whereClause = and(eq(deal.status, 'active'), searchCondition);
	} else if (categoryCondition) {
		whereClause = and(eq(deal.status, 'active'), categoryCondition);
	} else {
		whereClause = eq(deal.status, 'active');
	}

	const deals = await db
		.select({
			deal: deal,
			user: {
				id: user.id,
				username: user.username,
				avatarUrl: user.avatarUrl,
				reputation: user.reputation
			},
			category: category
		})
		.from(deal)
		.leftJoin(user, eq(deal.userId, user.id))
		.leftJoin(category, eq(deal.categoryId, category.id))
		.where(whereClause)
		.orderBy(desc(deal.score))
		.limit(50);

	return {
		deals: deals.map((r) => ({ ...r.deal, user: r.user, category: r.category })),
		query: q,
		categories,
		categorySlug
	};
};
