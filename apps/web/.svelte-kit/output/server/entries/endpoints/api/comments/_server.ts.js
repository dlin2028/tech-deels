import { json } from "@sveltejs/kit";
import { d as db, c as comments } from "../../../../chunks/db.js";
import { c as commentSchema } from "../../../../chunks/index2.js";
const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const result = commentSchema.safeParse(body);
  if (!result.success) {
    return json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }
  const { body: commentBody, dealId, parentId } = result.data;
  const [comment] = await db.insert(comments).values({
    body: commentBody,
    dealId,
    parentId: parentId ?? null,
    userId: locals.user.id
  }).returning();
  return json({ comment }, { status: 201 });
};
export {
  POST
};
