import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { users } from "@tech-deels/db";
import { lucia } from "$lib/server/auth";
import { hash } from "@node-rs/argon2";
import { eq, or } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(302, "/");
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = String(data.get("username") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");

    const errors: Record<string, string> = {};

    if (!username || username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.username = "Username can only contain letters, numbers, underscores, and hyphens";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors: errors as Record<string, string>, username, email });
    }

    // Check uniqueness
    const existing = await db
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].username === username) {
        return fail(400, { errors: { username: "Username already taken" } as Record<string, string>, username, email });
      }
      return fail(400, { errors: { email: "Email already registered" } as Record<string, string>, username, email });
    }

    const hashed_password = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      username,
      email,
      hashed_password,
      role: "user",
      reputation: 0,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    throw redirect(302, "/");
  },
};
