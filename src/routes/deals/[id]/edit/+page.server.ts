import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deal, category } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { rewriteAffiliateUrl } from '$lib/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const [d] = await db.select().from(deal).where(eq(deal.id, params.id));
	if (!d) error(404, 'Deal not found');
	if (d.userId !== locals.user.id && locals.user.role !== 'admin') error(403, 'Forbidden');

	const categories = await db.select().from(category).orderBy(category.name);
	return { deal: d, categories };
};

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const [d] = await db.select().from(deal).where(eq(deal.id, params.id));
		if (!d) return fail(404, { message: 'Not found' });
		if (d.userId !== locals.user.id && locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' });

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

		const affiliateUrl = rewriteAffiliateUrl(url);

		await db.update(deal).set({
			title,
			description,
			url,
			affiliateUrl,
			price: isNaN(price) ? null : price,
			originalPrice: isNaN(originalPrice) ? null : originalPrice,
			store: store || null,
			imageUrl: imageUrl || null,
			categoryId,
			updatedAt: new Date()
		}).where(eq(deal.id, params.id));

		redirect(302, `/deals/${params.id}`);
	}
};
