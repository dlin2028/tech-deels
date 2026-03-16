import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth.js';
import { db } from '$lib/server/db.js';
import { users } from '@tech-deels/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { registerSchema } from '@tech-deels/shared';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(302, '/');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        username: data.username as string,
        email: data.email as string,
        message: null,
      });
    }

    const { username, email, password } = result.data;

    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingEmail.length) {
      return fail(400, { message: 'Email already in use', username, email, errors: null });
    }

    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (existingUsername.length) {
      return fail(400, { message: 'Username already taken', username, email, errors: null });
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.insert(users).values({
      id: userId,
      username,
      email,
      passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '/',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
