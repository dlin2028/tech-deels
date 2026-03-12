import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deals, categories, tags, dealTags } from '$lib/server/db/schema';
import { rewriteToAffiliate } from '$lib/server/affiliate';
import { cache } from '$lib/server/cache';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
if (!locals.user) redirect(302, '/login');
const [allCategories, allTags] = await Promise.all([
db.select().from(categories).orderBy(categories.name),
db.select().from(tags).orderBy(tags.name)
]);
return { categories: allCategories, tags: allTags };
};

export const actions: Actions = {
default: async ({ request, locals }) => {
if (!locals.user) return fail(401, { error: 'You must be logged in to post a deal' });

const formData = await request.formData();
const title = formData.get('title');
const url = formData.get('url');
const priceStr = formData.get('price');
const originalPriceStr = formData.get('originalPrice');
const store = formData.get('store');
const shippingCostStr = formData.get('shippingCost');
const categoryStr = formData.get('category');
const description = formData.get('description');
const imageUrl = formData.get('imageUrl');
const condition = formData.get('condition') ?? 'new';
const tagIds = formData.getAll('tags').map(String).filter(Boolean);

if (
typeof title !== 'string' ||
typeof url !== 'string' ||
typeof priceStr !== 'string' ||
typeof store !== 'string'
) {
return fail(400, { error: 'Invalid form data' });
}

if (!title.trim()) return fail(400, { error: 'Title is required', title, url, store });
if (!url.trim()) return fail(400, { error: 'URL is required', title, url, store });
if (!store.trim()) return fail(400, { error: 'Store is required', title, url, store });

const price = Math.round(parseFloat(priceStr) * 100);
if (isNaN(price) || price < 0) {
return fail(400, { error: 'Invalid price', title, url, store });
}

const originalPrice =
originalPriceStr && typeof originalPriceStr === 'string' && originalPriceStr.trim()
? Math.round(parseFloat(originalPriceStr) * 100)
: null;

const shippingCost =
shippingCostStr && typeof shippingCostStr === 'string' && shippingCostStr.trim()
? Math.round(parseFloat(shippingCostStr) * 100)
: 0;

const categoryId =
categoryStr && typeof categoryStr === 'string' && categoryStr.trim()
? parseInt(categoryStr)
: null;

const cleanUrl = url.trim();
const affiliateUrl = rewriteToAffiliate(cleanUrl);

const [newDeal] = await db
.insert(deals)
.values({
title: title.trim(),
url: cleanUrl,
affiliateUrl,
price,
originalPrice,
store: store.trim(),
shippingCost,
categoryId,
condition: typeof condition === 'string' ? condition : 'new',
description:
description && typeof description === 'string' ? description.trim() || null : null,
imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl.trim() || null : null,
postedBy: locals.user.id,
status: 'active',
score: 0
})
.returning({ id: deals.id });

// Insert tags
if (tagIds.length > 0) {
await db.insert(dealTags).values(
tagIds.map((tagId) => ({ dealId: newDeal.id, tagId: parseInt(tagId) }))
);
}

// Invalidate feed cache
cache.invalidate('feeds:');

redirect(302, `/deals/${newDeal.id}`);
}
};
