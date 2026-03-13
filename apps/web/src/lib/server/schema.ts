// NOTE: This file mirrors packages/db/src/schema.ts.
// In production with workspace dependencies installed, prefer:
//   export * from '@tech-deels/db';
// This local copy allows the SvelteKit app to run before `bun install` links workspace packages.
import { pgTable, text, integer, timestamp, boolean, serial, varchar, pgEnum, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const dealStatusEnum = pgEnum('deal_status', ['active', 'expired', 'out_of_stock', 'price_changed']);
export const dealConditionEnum = pgEnum('deal_condition', ['new', 'refurbished', 'used', 'open_box']);
export const voteTypeEnum = pgEnum('vote_type', ['up', 'down']);
export const userRoleEnum = pgEnum('user_role', ['user', 'moderator', 'admin']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('hashed_password'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('user'),
  reputation: integer('reputation').notNull().default(0),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Sessions table (Lucia auth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: integer('parent_id'),
  iconName: varchar('icon_name', { length: 50 }),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tags table
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Deals table
export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  url: text('url').notNull(),
  affiliateUrl: text('affiliate_url'),
  imageUrl: text('image_url'),
  price: real('price').notNull(),
  originalPrice: real('original_price'),
  shippingCost: real('shipping_cost').notNull().default(0),
  store: varchar('store', { length: 100 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  categoryId: integer('category_id').references(() => categories.id),
  userId: text('user_id').notNull().references(() => users.id),
  status: dealStatusEnum('status').notNull().default('active'),
  condition: dealConditionEnum('condition').notNull().default('new'),
  score: real('score').notNull().default(0),
  hotScore: real('hot_score').notNull().default(0),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  viewCount: integer('view_count').notNull().default(0),
  clickCount: integer('click_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Deal tags junction
export const dealTags = pgTable('deal_tags', {
  dealId: integer('deal_id').notNull().references(() => deals.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// Votes table
export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dealId: integer('deal_id').notNull().references(() => deals.id, { onDelete: 'cascade' }),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Comments table (nested/threaded)
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dealId: integer('deal_id').notNull().references(() => deals.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id'),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  isDeleted: boolean('is_deleted').notNull().default(false),
  isModerated: boolean('is_moderated').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Comment votes
export const commentVotes = pgTable('comment_votes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  commentId: integer('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Saved deals
export const savedDeals = pgTable('saved_deals', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dealId: integer('deal_id').notNull().references(() => deals.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Flags/Reports
export const flags = pgTable('flags', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  dealId: integer('deal_id').references(() => deals.id),
  commentId: integer('comment_id').references(() => comments.id),
  reason: varchar('reason', { length: 100 }).notNull(),
  description: text('description'),
  resolved: boolean('resolved').notNull().default(false),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  deals: many(deals),
  votes: many(votes),
  comments: many(comments),
  commentVotes: many(commentVotes),
  savedDeals: many(savedDeals),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  user: one(users, { fields: [deals.userId], references: [users.id] }),
  category: one(categories, { fields: [deals.categoryId], references: [categories.id] }),
  votes: many(votes),
  comments: many(comments),
  dealTags: many(dealTags),
  savedDeals: many(savedDeals),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  deals: many(deals),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  dealTags: many(dealTags),
}));

export const dealTagsRelations = relations(dealTags, ({ one }) => ({
  deal: one(deals, { fields: [dealTags.dealId], references: [deals.id] }),
  tag: one(tags, { fields: [dealTags.tagId], references: [tags.id] }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.userId], references: [users.id] }),
  deal: one(deals, { fields: [votes.dealId], references: [deals.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  deal: one(deals, { fields: [comments.dealId], references: [deals.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: 'replies' }),
  replies: many(comments, { relationName: 'replies' }),
  votes: many(commentVotes),
}));

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, { fields: [commentVotes.userId], references: [users.id] }),
  comment: one(comments, { fields: [commentVotes.commentId], references: [comments.id] }),
}));

export const savedDealsRelations = relations(savedDeals, ({ one }) => ({
  user: one(users, { fields: [savedDeals.userId], references: [users.id] }),
  deal: one(deals, { fields: [savedDeals.dealId], references: [deals.id] }),
}));
