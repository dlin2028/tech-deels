import {
	pgTable,
	text,
	integer,
	timestamp,
	pgEnum,
	real,
	primaryKey
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'moderator', 'admin']);
export const dealStatusEnum = pgEnum('deal_status', ['active', 'expired', 'pending', 'rejected']);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	avatarUrl: text('avatar_url'),
	bio: text('bio'),
	reputation: integer('reputation').notNull().default(0),
	role: roleEnum('role').notNull().default('user'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const category = pgTable('category', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	description: text('description')
});

export const deal = pgTable('deal', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	url: text('url').notNull(),
	affiliateUrl: text('affiliate_url'),
	price: real('price'),
	originalPrice: real('original_price'),
	store: text('store'),
	imageUrl: text('image_url'),
	status: dealStatusEnum('status').notNull().default('active'),
	score: integer('score').notNull().default(0),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	categoryId: text('category_id').references(() => category.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const vote = pgTable(
	'vote',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		dealId: text('deal_id')
			.notNull()
			.references(() => deal.id),
		value: integer('value').notNull() // 1 or -1
	}
);

export const comment = pgTable('comment', {
	id: text('id').primaryKey(),
	content: text('content').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	dealId: text('deal_id')
		.notNull()
		.references(() => deal.id),
	parentId: text('parent_id'),
	score: integer('score').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentVote = pgTable('comment_vote', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	commentId: text('comment_id')
		.notNull()
		.references(() => comment.id),
	value: integer('value').notNull()
});

export const tag = pgTable('tag', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique()
});

export const dealTag = pgTable(
	'deal_tag',
	{
		dealId: text('deal_id')
			.notNull()
			.references(() => deal.id),
		tagId: text('tag_id')
			.notNull()
			.references(() => tag.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.dealId, t.tagId] })
	})
);

export const dealFlag = pgTable('deal_flag', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	dealId: text('deal_id')
		.notNull()
		.references(() => deal.id),
	reason: text('reason').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Deal = typeof deal.$inferSelect;
export type NewDeal = typeof deal.$inferInsert;
export type Vote = typeof vote.$inferSelect;
export type Comment = typeof comment.$inferSelect;
export type Tag = typeof tag.$inferSelect;
export type DealTag = typeof dealTag.$inferSelect;
export type DealFlag = typeof dealFlag.$inferSelect;
