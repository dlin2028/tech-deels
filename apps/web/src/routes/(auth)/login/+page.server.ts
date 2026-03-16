import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth.js';
import { db } from '$lib/server/db.js';
import { users } from '@tech-deels/db/schema';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import { loginSchema } from '@tech-deels/shared';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(302, '/');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        email: data.email as string,
        message: null,
      });
    }

    const { email, password } = result.data;

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length || !user[0].passwordHash) {
      return fail(400, { message: 'Invalid credentials', email, errors: null });
    }

    const validPassword = await verify(user[0].passwordHash, password);
    if (!validPassword) {
      return fail(400, { message: 'Invalid credentials', email, errors: null });
    }

    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
