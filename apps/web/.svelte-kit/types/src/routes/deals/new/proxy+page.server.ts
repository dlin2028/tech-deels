// @ts-nocheck
import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { deals, categories } from "@tech-deels/db";
import { invalidateCache } from "$lib/server/cache";
import type { Actions, PageServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user) throw redirect(302, "/login");

  const allCategories = await db
    .select({ id: categories.id, name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(categories.name);

  return { categories: allCategories };
};

export const actions = {
  default: async ({ request, locals }: import('./$types').RequestEvent) => {
    if (!locals.user) throw redirect(302, "/login");

    const data = await request.formData();
    const title = String(data.get("title") ?? "").trim();
    const url = String(data.get("url") ?? "").trim();
    const price = data.get("price") ? String(data.get("price")) : null;
    const original_price = data.get("original_price") ? String(data.get("original_price")) : null;
    const store = String(data.get("store") ?? "").trim() || null;
    const description = String(data.get("description") ?? "").trim() || null;
    const image_url = String(data.get("image_url") ?? "").trim() || null;
    const category_id = data.get("category_id") ? Number(data.get("category_id")) : null;

    const errors: Record<string, string> = {};
    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!url) errors.url = "URL is required";
    else {
      try {
        new URL(url);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }
    if (price && isNaN(Number(price))) errors.price = "Price must be a number";
    if (original_price && isNaN(Number(original_price))) errors.original_price = "Original price must be a number";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, title, url, price, original_price, store, description, image_url, category_id });
    }

    const [newDeal] = await db
      .insert(deals)
      .values({
        title,
        url,
        price: price ?? null,
        original_price: original_price ?? null,
        store,
        description,
        image_url,
        status: "active",
        score: 0,
        user_id: locals.user.id,
        category_id,
      })
      .returning({ id: deals.id });

    await invalidateCache("deals:*");

    throw redirect(302, `/deals/${newDeal.id}`);
  },
};
;null as any as Actions;