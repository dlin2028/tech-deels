import { db, deals, categories } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/auth/login');
  }

  const allCategories = await db.select({ id: categories.id, name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(categories.sortOrder);

  return { categories: allCategories };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'You must be signed in to submit a deal.' });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const url = String(formData.get('url') ?? '').trim();
    const price = parseFloat(String(formData.get('price') ?? ''));
    const originalPrice = formData.get('originalPrice') ? parseFloat(String(formData.get('originalPrice'))) : null;
    const store = String(formData.get('store') ?? '').trim();
    const brand = String(formData.get('brand') ?? '').trim() || null;
    const description = String(formData.get('description') ?? '').trim() || null;
    const imageUrl = String(formData.get('imageUrl') ?? '').trim() || null;
    const categoryId = formData.get('categoryId') ? parseInt(String(formData.get('categoryId'))) : null;
    const shippingCost = formData.get('shippingCost') ? parseFloat(String(formData.get('shippingCost'))) : 0;
    const condition = String(formData.get('condition') ?? 'new') as 'new' | 'refurbished' | 'used' | 'open_box';

    // Validation
    if (!title || title.length < 10) {
      return fail(400, { error: 'Title must be at least 10 characters.', title, url, store });
    }
    if (title.length > 255) {
      return fail(400, { error: 'Title must be 255 characters or less.', title, url, store });
    }
    if (!url) {
      return fail(400, { error: 'Deal URL is required.', title, url, store });
    }
    try {
      new URL(url);
    } catch {
      return fail(400, { error: 'Please enter a valid URL.', title, url, store });
    }
    if (isNaN(price) || price < 0) {
      return fail(400, { error: 'Please enter a valid price.', title, url, store });
    }
    if (!store) {
      return fail(400, { error: 'Store name is required.', title, url, store });
    }

    let dealId: number;
    try {
      const [inserted] = await db.insert(deals).values({
        title,
        url,
        price,
        originalPrice,
        shippingCost,
        store,
        brand,
        description,
        imageUrl,
        categoryId,
        userId: locals.user.id,
        condition,
        status: 'active',
      }).returning({ id: deals.id });

      dealId = inserted.id;
    } catch (err) {
      console.error('Deal submission error:', err);
      return fail(500, { error: 'Failed to submit deal. Please try again.', title, url, store });
    }

    redirect(302, `/deals/${dealId}`);
  },
};
