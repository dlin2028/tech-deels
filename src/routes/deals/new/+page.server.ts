import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deal, category } from '$lib/server/db/schema';
import { generateId, rewriteAffiliateUrl } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const categories = await db.select().from(category).orderBy(category.name);
	return { categories };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const url = formData.get('url')?.toString().trim();
		const price = parseFloat(formData.get('price')?.toString() || '');
		const originalPrice = parseFloat(formData.get('originalPrice')?.toString() || '');
		const store = formData.get('store')?.toString().trim();
		const imageUrl = formData.get('imageUrl')?.toString().trim();
		const categoryId = formData.get('categoryId')?.toString() || null;

		if (!title || !description || !url) {
			return fail(400, { message: 'Title, description, and URL are required' });
		}

		try {
			new URL(url);
		} catch {
			return fail(400, { message: 'Invalid URL' });
		}

		const affiliateUrl = rewriteAffiliateUrl(url);
		const id = generateId();

		await db.insert(deal).values({
			id,
			title,
			description,
			url,
			affiliateUrl,
			price: isNaN(price) ? null : price,
			originalPrice: isNaN(originalPrice) ? null : originalPrice,
			store: store || null,
			imageUrl: imageUrl || null,
			status: 'active',
			score: 0,
			userId: locals.user.id,
			categoryId
		});

		redirect(302, `/deals/${id}`);
	}
};
