import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgEnum, pgTable, timestamp, text, integer, primaryKey, serial, real, unique, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
const userRoleEnum = pgEnum("user_role", ["user", "moderator", "admin"]);
const dealStatusEnum = pgEnum("deal_status", ["active", "expired", "sold_out", "price_changed"]);
const targetTypeEnum = pgEnum("target_type", ["deal", "comment", "user"]);
const reportStatusEnum = pgEnum("report_status", ["pending", "resolved", "dismissed"]);
const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("user"),
  reputation: integer("reputation").notNull().default(0),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});
const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.providerId, t.providerUserId] })
  })
);
const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id")
});
const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  domain: text("domain").notNull(),
  trustScore: real("trust_score").notNull().default(5),
  affiliateTemplate: text("affiliate_template")
});
const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  affiliateUrl: text("affiliate_url"),
  merchantId: integer("merchant_id").references(() => merchants.id),
  categoryId: integer("category_id").references(() => categories.id),
  userId: text("user_id").notNull().references(() => users.id),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  shippingCost: real("shipping_cost").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  description: text("description"),
  status: dealStatusEnum("status").notNull().default("active"),
  hotScore: real("hot_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const dealSpecs = pgTable("deal_specs", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
  brand: text("brand"),
  cpuModel: text("cpu_model"),
  cpuArch: text("cpu_arch"),
  gpuModel: text("gpu_model"),
  ramGb: integer("ram_gb"),
  storageType: text("storage_type"),
  storageGb: integer("storage_gb"),
  condition: text("condition"),
  screenSize: real("screen_size"),
  screenResolution: text("screen_resolution"),
  refreshRate: integer("refresh_rate"),
  panelType: text("panel_type"),
  batteryLife: real("battery_life"),
  weight: real("weight"),
  responseTime: real("response_time"),
  aspectRatio: text("aspect_ratio"),
  adaptiveSync: text("adaptive_sync"),
  cpuSocket: text("cpu_socket"),
  gpuVram: integer("gpu_vram"),
  memoryType: text("memory_type"),
  memorySpeed: integer("memory_speed"),
  psuWatts: integer("psu_watts")
});
const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    unq: unique().on(t.userId, t.dealId)
  })
);
const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id),
  parentId: integer("parent_id"),
  body: text("body").notNull(),
  score: integer("score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at")
});
const commentVotes = pgTable(
  "comment_votes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    commentId: integer("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
    value: integer("value").notNull()
  },
  (t) => ({
    unq: unique().on(t.userId, t.commentId)
  })
);
const savedDeals = pgTable(
  "saved_deals",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    unq: unique().on(t.userId, t.dealId)
  })
);
const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  actorId: text("actor_id").references(() => users.id),
  dealId: integer("deal_id").references(() => deals.id),
  commentId: integer("comment_id").references(() => comments.id),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const moderationReports = pgTable("moderation_reports", {
  id: serial("id").primaryKey(),
  reporterId: text("reporter_id").notNull().references(() => users.id),
  targetType: targetTypeEnum("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: reportStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const moderationActions = pgTable("moderation_actions", {
  id: serial("id").primaryKey(),
  moderatorId: text("moderator_id").notNull().references(() => users.id),
  reportId: integer("report_id").references(() => moderationReports.id),
  action: text("action").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique()
});
const dealTags = pgTable(
  "deal_tags",
  {
    dealId: integer("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.dealId, t.tagId] })
  })
);
const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  deals: many(deals),
  votes: many(votes),
  comments: many(comments),
  savedDeals: many(savedDeals),
  notifications: many(notifications)
}));
const dealsRelations = relations(deals, ({ one, many }) => ({
  user: one(users, { fields: [deals.userId], references: [users.id] }),
  merchant: one(merchants, { fields: [deals.merchantId], references: [merchants.id] }),
  category: one(categories, { fields: [deals.categoryId], references: [categories.id] }),
  specs: one(dealSpecs, { fields: [deals.id], references: [dealSpecs.dealId] }),
  votes: many(votes),
  comments: many(comments),
  savedBy: many(savedDeals),
  tags: many(dealTags)
}));
const commentsRelations = relations(comments, ({ one, many }) => ({
  deal: one(deals, { fields: [comments.dealId], references: [deals.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies"
  }),
  replies: many(comments, { relationName: "replies" }),
  votes: many(commentVotes)
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  affiliateClicks,
  categories,
  commentVotes,
  comments,
  commentsRelations,
  dealSpecs,
  dealStatusEnum,
  dealTags,
  deals,
  dealsRelations,
  merchants,
  moderationActions,
  moderationReports,
  notifications,
  oauthAccounts,
  reportStatusEnum,
  savedDeals,
  sessions,
  tags,
  targetTypeEnum,
  userRoleEnum,
  users,
  usersRelations,
  votes
}, Symbol.toStringTag, { value: "Module" }));
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });
export {
  commentVotes as a,
  deals as b,
  comments as c,
  db as d,
  categories as e,
  dealSpecs as f,
  moderationReports as g,
  sessions as h,
  merchants as m,
  notifications as n,
  savedDeals as s,
  users as u,
  votes as v
};
