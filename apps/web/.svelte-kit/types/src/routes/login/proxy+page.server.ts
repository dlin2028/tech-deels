// @ts-nocheck
import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { users } from "@tech-deels/db";
import { lucia } from "$lib/server/auth";
import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (locals.user) throw redirect(302, "/");
  return {};
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const data = await request.formData();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      return fail(400, { error: "Email and password are required", email });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return fail(400, { error: "Invalid email or password", email });
    }

    if (user.role === "banned") {
      return fail(403, { error: "Your account has been banned", email });
    }

    const validPassword = await verify(user.hashed_password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return fail(400, { error: "Invalid email or password", email });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    throw redirect(302, "/");
  },
};
;null as any as Actions;