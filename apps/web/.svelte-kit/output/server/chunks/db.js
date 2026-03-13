import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, timestamp, integer, text, serial, numeric, unique, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  hashed_password: text("hashed_password").notNull(),
  role: text("role").default("user"),
  reputation: integer("reputation").default(0),
  created_at: timestamp("created_at").defaultNow()
});
const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});
const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description")
});
const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  price: numeric("price"),
  original_price: numeric("original_price"),
  store: text("store"),
  description: text("description"),
  image_url: text("image_url"),
  status: text("status").default("active"),
  score: integer("score").default(0),
  user_id: text("user_id").notNull().references(() => users.id),
  category_id: integer("category_id").references(() => categories.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => users.id),
    deal_id: integer("deal_id").notNull().references(() => deals.id),
    value: integer("value").notNull(),
    created_at: timestamp("created_at").defaultNow()
  },
  (t) => ({
    unique_vote: unique().on(t.user_id, t.deal_id)
  })
);
const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  user_id: text("user_id").notNull().references(() => users.id),
  deal_id: integer("deal_id").notNull().references(() => deals.id),
  parent_id: integer("parent_id"),
  score: integer("score").default(0),
  created_at: timestamp("created_at").defaultNow()
});
const comment_votes = pgTable(
  "comment_votes",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => users.id),
    comment_id: integer("comment_id").notNull().references(() => comments.id),
    value: integer("value").notNull()
  },
  (t) => ({
    unique_comment_vote: unique().on(t.user_id, t.comment_id)
  })
);
const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull()
});
const deal_tags = pgTable(
  "deal_tags",
  {
    deal_id: integer("deal_id").notNull().references(() => deals.id),
    tag_id: integer("tag_id").notNull().references(() => tags.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.deal_id, t.tag_id] })
  })
);
const flags = pgTable("flags", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  deal_id: integer("deal_id").references(() => deals.id),
  comment_id: integer("comment_id").references(() => comments.id),
  reason: text("reason").notNull(),
  status: text("status").default("pending"),
  created_at: timestamp("created_at").defaultNow()
});
const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  deals: many(deals),
  votes: many(votes),
  comments: many(comments),
  comment_votes: many(comment_votes),
  flags: many(flags)
}));
const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}));
const categoriesRelations = relations(categories, ({ many }) => ({
  deals: many(deals)
}));
const dealsRelations = relations(deals, ({ one, many }) => ({
  user: one(users, { fields: [deals.user_id], references: [users.id] }),
  category: one(categories, { fields: [deals.category_id], references: [categories.id] }),
  votes: many(votes),
  comments: many(comments),
  deal_tags: many(deal_tags),
  flags: many(flags)
}));
const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.user_id], references: [users.id] }),
  deal: one(deals, { fields: [votes.deal_id], references: [deals.id] })
}));
const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { fields: [comments.user_id], references: [users.id] }),
  deal: one(deals, { fields: [comments.deal_id], references: [deals.id] }),
  comment_votes: many(comment_votes)
}));
const commentVotesRelations = relations(comment_votes, ({ one }) => ({
  user: one(users, { fields: [comment_votes.user_id], references: [users.id] }),
  comment: one(comments, { fields: [comment_votes.comment_id], references: [comments.id] })
}));
const tagsRelations = relations(tags, ({ many }) => ({
  deal_tags: many(deal_tags)
}));
const dealTagsRelations = relations(deal_tags, ({ one }) => ({
  deal: one(deals, { fields: [deal_tags.deal_id], references: [deals.id] }),
  tag: one(tags, { fields: [deal_tags.tag_id], references: [tags.id] })
}));
const flagsRelations = relations(flags, ({ one }) => ({
  user: one(users, { fields: [flags.user_id], references: [users.id] }),
  deal: one(deals, { fields: [flags.deal_id], references: [deals.id] }),
  comment: one(comments, { fields: [flags.comment_id], references: [comments.id] })
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories,
  categoriesRelations,
  commentVotesRelations,
  comment_votes,
  comments,
  commentsRelations,
  dealTagsRelations,
  deal_tags,
  deals,
  dealsRelations,
  flags,
  flagsRelations,
  sessions,
  sessionsRelations,
  tags,
  tagsRelations,
  users,
  usersRelations,
  votes,
  votesRelations
}, Symbol.toStringTag, { value: "Module" }));
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client, { schema });
export {
  deals as a,
  comments as b,
  categories as c,
  db as d,
  flags as f,
  sessions as s,
  users as u,
  votes as v
};
