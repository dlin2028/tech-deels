import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	hashedPassword: text('hashed_password'),
	avatarUrl: text('avatar_url'),
	reputation: integer('reputation').notNull().default(0),
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
	price: integer('price').notNull(), // stored in cents
	originalPrice: integer('original_price'), // stored in cents
	store: text('store').notNull(),
	shippingCost: integer('shipping_cost').notNull().default(0), // stored in cents
	description: text('description'),
	imageUrl: text('image_url'),
	categoryId: integer('category_id').references(() => categories.id),
	postedBy: text('posted_by')
		.notNull()
		.references(() => users.id),
	status: text('status').notNull().default('active'), // active, expired, out_of_stock, price_changed
	score: integer('score').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const votes = pgTable('votes', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id),
	value: integer('value').notNull() // 1 for upvote, -1 for downvote
});

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	dealId: integer('deal_id')
		.notNull()
		.references(() => deals.id),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id),
	parentId: integer('parent_id'), // self-referencing for threaded comments
	content: text('content').notNull(),
	score: integer('score').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
