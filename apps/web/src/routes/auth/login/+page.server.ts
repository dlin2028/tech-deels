import { lucia } from '$lib/server/auth';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required.', email });
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user || !user.hashedPassword) {
        return fail(400, { error: 'Invalid email or password.', email });
      }

      const hasher = new Argon2id();
      const validPassword = await hasher.verify(user.hashedPassword, password);

      if (!validPassword) {
        return fail(400, { error: 'Invalid email or password.', email });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });
    } catch (err) {
      console.error('Login error:', err);
      return fail(500, { error: 'An unexpected error occurred. Please try again.', email });
    }

    redirect(302, '/');
  },
};
