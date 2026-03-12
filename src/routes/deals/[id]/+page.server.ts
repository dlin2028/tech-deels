import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { deals, categories, comments, users, votes, commentVotes, flags, savedDeals } from '$lib/server/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { cache } from '$lib/server/cache';
import { getOutboundUrl } from '$lib/server/affiliate';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
const dealId = parseInt(params.id);
if (isNaN(dealId)) error(404, 'Deal not found');

const [deal] = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
if (!deal) error(404, 'Deal not found');

const [category, poster, dealComments, userVote, savedEntry] = await Promise.all([
deal.categoryId
? db.select().from(categories).where(eq(categories.id, deal.categoryId)).limit(1)
: Promise.resolve([]),
db.select({ username: users.username, reputation: users.reputation, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, deal.postedBy)).limit(1),
db
.select({
id: comments.id,
dealId: comments.dealId,
authorId: comments.authorId,
parentId: comments.parentId,
content: comments.content,
score: comments.score,
createdAt: comments.createdAt,
authorUsername: users.username
})
.from(comments)
.leftJoin(users, eq(comments.authorId, users.id))
.where(eq(comments.dealId, dealId))
.orderBy(comments.createdAt),
locals.user
? db.select({ value: votes.value }).from(votes).where(and(eq(votes.userId, locals.user.id), eq(votes.dealId, dealId))).limit(1)
: Promise.resolve([]),
locals.user
? db.select({ savedAt: savedDeals.savedAt }).from(savedDeals).where(and(eq(savedDeals.userId, locals.user.id), eq(savedDeals.dealId, dealId))).limit(1)
: Promise.resolve([])
]);

// Get user's votes on comments
let commentVoteMap: Record<number, number> = {};
if (locals.user && dealComments.length > 0) {
	const commentIds = dealComments.map(c => c.id);
	const myCommentVotes = await db
		.select({ commentId: commentVotes.commentId, value: commentVotes.value })
		.from(commentVotes)
		.where(and(eq(commentVotes.userId, locals.user.id), inArray(commentVotes.commentId, commentIds)));
	for (const cv of myCommentVotes) {
		commentVoteMap[cv.commentId] = cv.value;
	}
}

return {
deal: {
...deal,
category: category[0] ?? null,
poster: poster[0] ?? null,
outboundUrl: getOutboundUrl(deal.url, deal.affiliateUrl)
},
comments: dealComments,
commentVoteMap,
user: locals.user,
myVote: userVote[0]?.value ?? null,
isSaved: (savedEntry[0] ?? null) !== null
};
};

export const actions: Actions = {
comment: async ({ request, locals, params }) => {
if (!locals.user) return fail(401, { error: 'You must be logged in to comment' });

const dealId = parseInt(params.id);
if (isNaN(dealId)) return fail(400, { error: 'Invalid deal' });

const formData = await request.formData();
const content = formData.get('content');
const parentIdStr = formData.get('parentId');

if (typeof content !== 'string' || !content.trim()) {
return fail(400, { error: 'Comment cannot be empty' });
}

const parentId =
parentIdStr && typeof parentIdStr === 'string' && parentIdStr.trim()
? parseInt(parentIdStr)
: null;

await db.insert(comments).values({
dealId,
authorId: locals.user.id,
parentId,
content: content.trim(),
score: 0
});

return { success: true };
},

voteComment: async ({ request, locals, params }) => {
if (!locals.user) return fail(401, { error: 'Login to vote' });

const dealId = parseInt(params.id);
const formData = await request.formData();
const commentIdStr = formData.get('commentId');
const valueStr = formData.get('value');

if (!commentIdStr || !valueStr) return fail(400, { error: 'Missing fields' });
const commentId = parseInt(String(commentIdStr));
const value = parseInt(String(valueStr));
if (value !== 1 && value !== -1) return fail(400, { error: 'Invalid vote' });

const [existing] = await db
.select()
.from(commentVotes)
.where(and(eq(commentVotes.userId, locals.user.id), eq(commentVotes.commentId, commentId)))
.limit(1);

let scoreDelta = 0;
if (existing) {
if (existing.value === value) {
await db.delete(commentVotes).where(and(eq(commentVotes.userId, locals.user.id), eq(commentVotes.commentId, commentId)));
scoreDelta = -value;
} else {
await db.update(commentVotes).set({ value }).where(and(eq(commentVotes.userId, locals.user.id), eq(commentVotes.commentId, commentId)));
scoreDelta = value - existing.value;
}
} else {
await db.insert(commentVotes).values({ userId: locals.user.id, commentId, value });
scoreDelta = value;
}

await db.update(comments).set({ score: sql`${comments.score} + ${scoreDelta}` }).where(eq(comments.id, commentId));

redirect(303, `/deals/${dealId}`);
},

updateStatus: async ({ request, locals, params }) => {
if (!locals.user) return fail(401, { error: 'Not logged in' });

const dealId = parseInt(params.id);
const [deal] = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
if (!deal) return fail(404, { error: 'Deal not found' });

const isOwner = deal.postedBy === locals.user.id;
const isAdmin = locals.user.isAdmin;
if (!isOwner && !isAdmin) return fail(403, { error: 'Not authorized' });

const formData = await request.formData();
const status = formData.get('status');
const VALID_STATUSES = ['active', 'expired', 'out_of_stock', 'price_changed'];
if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) {
return fail(400, { error: 'Invalid status' });
}

await db.update(deals).set({ status, updatedAt: new Date() }).where(eq(deals.id, dealId));
cache.invalidate('feeds:');

redirect(303, `/deals/${dealId}`);
},

saveToggle: async ({ locals, params }) => {
if (!locals.user) return fail(401, { error: 'Login to save deals' });
const dealId = parseInt(params.id);

const [existing] = await db
.select()
.from(savedDeals)
.where(and(eq(savedDeals.userId, locals.user.id), eq(savedDeals.dealId, dealId)))
.limit(1);

if (existing) {
await db.delete(savedDeals).where(and(eq(savedDeals.userId, locals.user.id), eq(savedDeals.dealId, dealId)));
} else {
await db.insert(savedDeals).values({ userId: locals.user.id, dealId });
}

redirect(303, `/deals/${dealId}`);
},

flag: async ({ request, locals, params }) => {
if (!locals.user) return fail(401, { error: 'Login to report deals' });

const dealId = parseInt(params.id);
const formData = await request.formData();
const reason = formData.get('reason');
const details = formData.get('details');

const VALID_REASONS = ['spam', 'expired', 'abusive', 'duplicate', 'affiliate_link'];
if (typeof reason !== 'string' || !VALID_REASONS.includes(reason)) {
return fail(400, { error: 'Invalid reason' });
}

await db.insert(flags).values({
reporterId: locals.user.id,
dealId,
reason,
details: typeof details === 'string' ? details.trim() || null : null,
status: 'pending'
});

return { flagged: true };
}
};
