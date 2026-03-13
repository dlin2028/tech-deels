import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { deal, user, category, vote } from '$lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { hotScore } from '$lib/utils';

const HOT_CACHE_TTL = 60_000; // 1 minute
let hotCache: { deals: unknown[]; ts: number } | null = null;

export const load: PageServerLoad = async ({ url, locals }) => {
	const sort = url.searchParams.get('sort') || 'hot';
	const categorySlug = url.searchParams.get('category') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	const categories = await db.select().from(category).orderBy(category.name);

	let dealsQuery = db
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
		.where(
			categorySlug
				? and(eq(deal.status, 'active'), eq(category.slug, categorySlug))
				: eq(deal.status, 'active')
		)
		.limit(limit)
		.offset(offset);

	let rawDeals;
	if (sort === 'hot' && !categorySlug && page === 1 && hotCache && Date.now() - hotCache.ts < HOT_CACHE_TTL) {
		rawDeals = hotCache.deals;
	} else {
		if (sort === 'new') {
			rawDeals = await dealsQuery.orderBy(desc(deal.createdAt));
		} else {
			rawDeals = await dealsQuery.orderBy(desc(deal.score));
		}

		if (sort === 'hot') {
			rawDeals = (rawDeals as typeof rawDeals).sort((a: any, b: any) =>
				hotScore(b.deal.score, new Date(b.deal.createdAt)) -
				hotScore(a.deal.score, new Date(a.deal.createdAt))
			);
			if (!categorySlug && page === 1) {
				hotCache = { deals: rawDeals, ts: Date.now() };
			}
		}
	}

	// Get user votes if logged in
	let userVotes: Record<string, number> = {};
	if (locals.user) {
		const votes = await db
			.select()
			.from(vote)
			.where(eq(vote.userId, locals.user.id));
		for (const v of votes) {
			userVotes[v.dealId] = v.value;
		}
	}

	const deals = (rawDeals as any[]).map((r: any) => ({
		...r.deal,
		user: r.user,
		category: r.category,
		userVote: userVotes[r.deal.id] ?? null
	}));

	return {
		deals,
		categories,
		sort,
		categorySlug,
		page
	};
};
