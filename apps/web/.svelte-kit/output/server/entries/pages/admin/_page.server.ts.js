import { d as db, u as users, b as deals, c as comments } from "../../../chunks/db.js";
import { count } from "drizzle-orm";
const load = async () => {
  const [userCount] = await db.select({ count: count() }).from(users);
  const [dealCount] = await db.select({ count: count() }).from(deals);
  const [commentCount] = await db.select({ count: count() }).from(comments);
  return {
    stats: {
      users: userCount.count,
      deals: dealCount.count,
      comments: commentCount.count
    }
  };
};
export {
  load
};
