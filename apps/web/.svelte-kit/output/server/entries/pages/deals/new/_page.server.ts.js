import { fail, redirect } from "@sveltejs/kit";
import { d as db, b as deals, e as categories, m as merchants } from "../../../../chunks/db.js";
import { d as dealSubmitSchema } from "../../../../chunks/index2.js";
const load = async ({ locals }) => {
  if (!locals.user) redirect(302, "/login");
  const categoriesList = await db.select().from(categories);
  const merchantsList = await db.select().from(merchants);
  return { categories: categoriesList, merchants: merchantsList };
};
const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: "Unauthorized" });
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const result = dealSubmitSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: data,
        message: null
      });
    }
    const {
      title,
      url,
      price,
      originalPrice,
      shippingCost,
      currency,
      description,
      categoryId,
      merchantId
    } = result.data;
    const [newDeal] = await db.insert(deals).values({
      title,
      url,
      price,
      originalPrice,
      shippingCost,
      currency,
      description,
      categoryId,
      merchantId,
      userId: locals.user.id
    }).returning({ id: deals.id });
    redirect(302, `/deals/${newDeal.id}`);
  }
};
export {
  actions,
  load
};
