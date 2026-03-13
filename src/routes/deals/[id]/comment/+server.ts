import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { comment } from '$lib/server/db/schema';
import { generateId } from '$lib/utils';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const body = await request.json();
	const content = body.content?.toString().trim();
	const parentId = body.parentId || null;

	if (!content) error(400, 'Content is required');
	if (content.length > 2000) error(400, 'Comment too long');

	const id = generateId();
	const [newComment] = await db
		.insert(comment)
		.values({
			id,
			content,
			userId: locals.user.id,
			dealId: params.id,
			parentId,
			score: 0
		})
		.returning();

	return json({ comment: newComment });
};
