import { pgTable, text, integer, timestamp, serial, boolean, primaryKey, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	hashedPassword: text('hashed_password'),
	avatarUrl: text('avatar_url'),
	bio: text('bio'),
	reputation: integer('reputation').notNull().default(0),
	isAdmin: boolean('is_admin').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	description: text('description')
});

export const deals = pgTable('deals', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	url: text('url').notNull(),
	affiliateUrl: text('affiliate_url'),
	price: integer('price').notNull(), // stored in cents
	originalPrice: integer('original_price'), // stored in cents
	store: text('store').notNull(),
	shippingCost: integer('shipping_cost').notNull().default(0), // stored in cents
	description: text('description'),
	imageUrl: text('image_url'),
	condition: text('condition').notNull().default('new'), // new, refurbished, used, open_box
	categoryId: integer('category_id').references(() => categories.id),
	postedBy: text('posted_by')
		.notNull()
		.references(() => users.id),
	status: text('status').notNull().default('active'), // active, expired, out_of_stock, price_changed
	score: integer('score').notNull().default(0),
	clickCount: integer('click_count').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
	index('deals_status_idx').on(t.status),
	index('deals_score_idx').on(t.score),
	index('deals_created_idx').on(t.createdAt),
]);

export const votes = pgTable('votes', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id, { onDelete: 'cascade' }),
	value: integer('value').notNull() // 1 for upvote, -1 for downvote
});

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id, { onDelete: 'cascade' }),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id),
	parentId: integer('parent_id'), // self-referencing for threaded comments
	content: text('content').notNull(),
	score: integer('score').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentVotes = pgTable('comment_votes', {
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	commentId: integer('comment_id')
		.notNull()
		.references(() => comments.id, { onDelete: 'cascade' }),
	value: integer('value').notNull() // 1 or -1
}, (t) => [
	primaryKey({ columns: [t.userId, t.commentId] })
]);

export const tags = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique()
});

export const dealTags = pgTable('deal_tags', {
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => tags.id, { onDelete: 'cascade' })
}, (t) => [
	primaryKey({ columns: [t.dealId, t.tagId] })
]);

export const savedDeals = pgTable('saved_deals', {
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id, { onDelete: 'cascade' }),
	savedAt: timestamp('saved_at').notNull().defaultNow()
}, (t) => [
	primaryKey({ columns: [t.userId, t.dealId] })
]);

export const flags = pgTable('flags', {
	id: serial('id').primaryKey(),
	reporterId: text('reporter_id')
		.notNull()
		.references(() => users.id),
	dealId: integer('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
	commentId: integer('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
	reason: text('reason').notNull(), // spam, expired, abusive, duplicate, affiliate_link
	details: text('details'),
	status: text('status').notNull().default('pending'), // pending, resolved, dismissed
	resolvedBy: text('resolved_by').references(() => users.id),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
