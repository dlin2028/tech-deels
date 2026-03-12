import { db } from '$lib/server/db';
import { deals, categories } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allCategories = await db.select().from(categories).orderBy(categories.name);

	const baseSelect = {
		id: deals.id,
		title: deals.title,
		url: deals.url,
		price: deals.price,
		originalPrice: deals.originalPrice,
		store: deals.store,
		shippingCost: deals.shippingCost,
		imageUrl: deals.imageUrl,
		score: deals.score,
		createdAt: deals.createdAt,
		categoryId: deals.categoryId,
		commentCount: sql<number>`(select count(*) from comments where deal_id = ${deals.id})`.mapWith(
			Number
		)
	};

	const [newDealsRaw, hotDealsRaw] = await Promise.all([
		db
			.select(baseSelect)
			.from(deals)
			.where(eq(deals.status, 'active'))
			.orderBy(desc(deals.createdAt))
			.limit(50),
		db
			.select(baseSelect)
			.from(deals)
			.where(eq(deals.status, 'active'))
			.orderBy(desc(deals.score), desc(deals.createdAt))
			.limit(50)
	]);

	function enrichDeals(dealsRaw: typeof newDealsRaw) {
		return dealsRaw.map((deal) => ({
			...deal,
			category: deal.categoryId ? (allCategories.find((c) => c.id === deal.categoryId) ?? null) : null
		}));
	}

	return {
		newDeals: enrichDeals(newDealsRaw),
		hotDeals: enrichDeals(hotDealsRaw),
		categories: allCategories
	};
};
