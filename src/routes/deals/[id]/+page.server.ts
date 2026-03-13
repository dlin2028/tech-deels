import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deal, user, category, vote, comment } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

type CommentWithUser = {
	id: string;
	content: string;
	userId: string;
	dealId: string;
	parentId: string | null;
	score: number;
	createdAt: Date;
	user: { id: string; username: string; avatarUrl: string | null };
	replies?: CommentWithUser[];
};

function buildCommentTree(comments: CommentWithUser[]): CommentWithUser[] {
	const map = new Map<string, CommentWithUser>();
	const roots: CommentWithUser[] = [];

	for (const c of comments) {
		map.set(c.id, { ...c, replies: [] });
	}

	for (const c of map.values()) {
		if (c.parentId) {
			const parent = map.get(c.parentId);
			if (parent) {
				parent.replies = parent.replies || [];
				parent.replies.push(c);
			} else {
				roots.push(c);
			}
		} else {
			roots.push(c);
		}
	}

	return roots;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const [result] = await db
		.select({
			deal: deal,
			user: {
				id: user.id,
				username: user.username,
				avatarUrl: user.avatarUrl,
				reputation: user.reputation,
				bio: user.bio
			},
			category: category
		})
		.from(deal)
		.leftJoin(user, eq(deal.userId, user.id))
		.leftJoin(category, eq(deal.categoryId, category.id))
		.where(eq(deal.id, params.id));

	if (!result) error(404, 'Deal not found');

	let userVote: number | null = null;
	if (locals.user) {
		const [v] = await db
			.select()
			.from(vote)
			.where(and(eq(vote.userId, locals.user.id), eq(vote.dealId, params.id)));
		userVote = v?.value ?? null;
	}

	const rawComments = await db
		.select({
			comment: comment,
			user: {
				id: user.id,
				username: user.username,
				avatarUrl: user.avatarUrl
			}
		})
		.from(comment)
		.leftJoin(user, eq(comment.userId, user.id))
		.where(eq(comment.dealId, params.id))
		.orderBy(comment.createdAt);

	const flatComments: CommentWithUser[] = rawComments.map((r) => ({
		...r.comment,
		user: r.user as { id: string; username: string; avatarUrl: string | null }
	}));

	const commentTree = buildCommentTree(flatComments);

	return {
		deal: { ...result.deal, user: result.user, category: result.category, userVote },
		comments: commentTree
	};
};
