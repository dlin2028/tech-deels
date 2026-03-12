import { db } from '$lib/server/db';
import { deals, categories, users, tags, dealTags } from '$lib/server/db/schema';
import { desc, eq, sql, and, ilike, or, inArray } from 'drizzle-orm';
import { cache } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

const FEED_TTL = 30_000; // 30 seconds cache for feeds

export const load: PageServerLoad = async ({ url }) => {
	const categorySlug = url.searchParams.get('category') ?? '';
	const tagSlug = url.searchParams.get('tag') ?? '';
	const q = url.searchParams.get('q') ?? '';
	const condition = url.searchParams.get('condition') ?? '';

	const allCategories = await cache.wrap('categories:all', () =>
		db.select().from(categories).orderBy(categories.name)
	);

	const allTags = await cache.wrap('tags:all', () =>
		db.select().from(tags).orderBy(tags.name)
	);

	// Resolve filter IDs
	const filterCat = categorySlug
		? (allCategories.find((c) => c.slug === categorySlug) ?? null)
		: null;
	const filterTag = tagSlug
		? (allTags.find((t) => t.slug === tagSlug) ?? null)
		: null;

	const baseSelect = {
		id: deals.id,
		title: deals.title,
		url: deals.url,
		affiliateUrl: deals.affiliateUrl,
		price: deals.price,
		originalPrice: deals.originalPrice,
		store: deals.store,
		shippingCost: deals.shippingCost,
		imageUrl: deals.imageUrl,
		condition: deals.condition,
		score: deals.score,
		status: deals.status,
		createdAt: deals.createdAt,
		categoryId: deals.categoryId,
		postedBy: deals.postedBy,
		posterUsername: users.username,
		commentCount: sql<number>`(select count(*) from comments where deal_id = ${deals.id})`.mapWith(Number)
	};

	// Build WHERE conditions
	const conditions = [eq(deals.status, 'active')];
	if (filterCat) conditions.push(eq(deals.categoryId, filterCat.id));
	if (condition) conditions.push(eq(deals.condition, condition));

	// Full-text search using ilike (simple approach without tsvector)
	if (q) {
		conditions.push(
			or(
				ilike(deals.title, `%${q}%`),
				ilike(deals.description, `%${q}%`),
				ilike(deals.store, `%${q}%`)
			)!
		);
	}

	// If filtering by tag, get deal IDs with that tag first
	if (filterTag) {
		const taggedDeals = await db
			.select({ dealId: dealTags.dealId })
			.from(dealTags)
			.where(eq(dealTags.tagId, filterTag.id));
		const tagDealIds = taggedDeals.map((r) => r.dealId);
		if (tagDealIds.length === 0) {
			return {
				newDeals: [],
				hotDeals: [],
				categories: allCategories,
				tags: allTags,
				filters: { q, categorySlug, tagSlug, condition }
			};
		}
		conditions.push(inArray(deals.id, tagDealIds));
	}

	const whereClause = and(...conditions);

	// Use cache only for unfiltered feeds
	const cacheKey = q || categorySlug || tagSlug || condition ? null : 'feeds:main';

	const fetchFeeds = async () => {
		const [newDealsRaw, hotDealsRaw] = await Promise.all([
			db
				.select(baseSelect)
				.from(deals)
				.leftJoin(users, eq(deals.postedBy, users.id))
				.where(whereClause)
				.orderBy(desc(deals.createdAt))
				.limit(50),
			db
				.select(baseSelect)
				.from(deals)
				.leftJoin(users, eq(deals.postedBy, users.id))
				.where(whereClause)
				.orderBy(desc(deals.score), desc(deals.createdAt))
				.limit(50)
		]);

		function enrichDeals(dealsRaw: typeof newDealsRaw) {
			return dealsRaw.map((deal) => ({
				...deal,
				category: deal.categoryId ? (allCategories.find((c) => c.id === deal.categoryId) ?? null) : null
			}));
		}

		return { newDeals: enrichDeals(newDealsRaw), hotDeals: enrichDeals(hotDealsRaw) };
	};

	const { newDeals, hotDeals } = cacheKey
		? await cache.wrap(cacheKey, fetchFeeds, FEED_TTL)
		: await fetchFeeds();

	return {
		newDeals,
		hotDeals,
		categories: allCategories,
		tags: allTags,
		filters: { q, categorySlug, tagSlug, condition }
	};
};
