import { lucia } from '$lib/server/auth';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { isValidEmail } from '$lib/utils';
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
    const username = String(formData.get('username') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    // Validation
    if (!username || !email || !password) {
      return fail(400, { error: 'All fields are required.', username, email });
    }

    if (username.length < 3 || username.length > 50) {
      return fail(400, { error: 'Username must be between 3 and 50 characters.', username, email });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return fail(400, { error: 'Username can only contain letters, numbers, underscores, and hyphens.', username, email });
    }

    if (!isValidEmail(email)) {
      return fail(400, { error: 'Please enter a valid email address.', username, email });
    }

    if (password.length < 8) {
      return fail(400, { error: 'Password must be at least 8 characters.', username, email });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match.', username, email });
    }

    try {
      // Check uniqueness
      const [existingEmail] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail) {
        return fail(400, { error: 'An account with this email already exists.', username, email });
      }

      const [existingUsername] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
      if (existingUsername) {
        return fail(400, { error: 'This username is already taken.', username, email });
      }

      const hasher = new Argon2id();
      const hashedPassword = await hasher.hash(password);
      const userId = generateId(15);

      await db.insert(users).values({
        id: userId,
        username,
        email,
        hashedPassword,
        role: 'user',
        reputation: 0,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });
    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, { error: 'An unexpected error occurred. Please try again.', username, email });
    }

    redirect(302, '/');
  },
};
