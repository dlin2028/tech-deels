import { error, fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { deals, users, categories, votes, comments, flags } from "@tech-deels/db";
import { eq, and, isNull } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";

interface CommentWithUser {
  id: number;
  content: string;
  score: number;
  created_at: Date | null;
  username: string | null;
  user_id: string;
  parent_id: number | null;
  children?: CommentWithUser[];
}

function buildCommentTree(flatComments: CommentWithUser[]): CommentWithUser[] {
  const map = new Map<number, CommentWithUser>();
  const roots: CommentWithUser[] = [];

  for (const c of flatComments) {
    map.set(c.id, { ...c, children: [] });
  }

  for (const c of map.values()) {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children!.push(c);
    } else {
      roots.push(c);
    }
  }

  return roots;
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const id = Number(params.id);
  if (isNaN(id)) throw error(404, "Deal not found");

  const [deal] = await db
    .select({
      id: deals.id,
      title: deals.title,
      url: deals.url,
      price: deals.price,
      original_price: deals.original_price,
      store: deals.store,
      description: deals.description,
      image_url: deals.image_url,
      status: deals.status,
      score: deals.score,
      created_at: deals.created_at,
      user_id: deals.user_id,
      username: users.username,
      category_name: categories.name,
      category_slug: categories.slug,
    })
    .from(deals)
    .leftJoin(users, eq(deals.user_id, users.id))
    .leftJoin(categories, eq(deals.category_id, categories.id))
    .where(eq(deals.id, id))
    .limit(1);

  if (!deal) throw error(404, "Deal not found");

  const flatComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      score: comments.score,
      created_at: comments.created_at,
      username: users.username,
      user_id: comments.user_id,
      parent_id: comments.parent_id,
    })
    .from(comments)
    .leftJoin(users, eq(comments.user_id, users.id))
    .where(eq(comments.deal_id, id))
    .orderBy(comments.created_at);

  const commentTree = buildCommentTree(
    flatComments.map((c) => ({
      ...c,
      score: c.score ?? 0,
    }))
  );

  let userVote: number | null = null;
  if (locals.user) {
    const [vote] = await db
      .select({ value: votes.value })
      .from(votes)
      .where(and(eq(votes.user_id, locals.user.id), eq(votes.deal_id, id)))
      .limit(1);
    userVote = vote?.value ?? null;
  }

  return {
    deal,
    comments: commentTree,
    userVote,
    affiliateTag: process.env.AFFILIATE_TAG ?? "techdeels-20",
  };
};

export const actions: Actions = {
  addComment: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(302, "/login");

    const dealId = Number(params.id);
    if (isNaN(dealId)) return fail(400, { error: "Invalid deal" });

    const data = await request.formData();
    const content = String(data.get("content") ?? "").trim();
    const parent_id = data.get("parent_id") ? Number(data.get("parent_id")) : null;

    if (!content || content.length < 2) {
      return fail(400, { commentError: "Comment must be at least 2 characters" });
    }

    await db.insert(comments).values({
      content,
      user_id: locals.user.id,
      deal_id: dealId,
      parent_id,
      score: 0,
    });

    return { success: true };
  },

  flag: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(302, "/login");

    const dealId = Number(params.id);
    const data = await request.formData();
    const reason = String(data.get("reason") ?? "").trim();

    if (!reason) return fail(400, { flagError: "Please provide a reason" });

    await db.insert(flags).values({
      user_id: locals.user.id,
      deal_id: dealId,
      reason,
      status: "pending",
    });

    return { flagged: true };
  },
};
