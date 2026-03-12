import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import { hashPassword } from '$lib/server/password';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string'
		) {
			return fail(400, { error: 'Invalid input' });
		}

		if (username.length < 3 || username.length > 20) {
			return fail(400, { error: 'Username must be 3–20 characters', username, email });
		}
		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return fail(400, {
				error: 'Username may only contain letters, numbers, and underscores',
				username,
				email
			});
		}
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', username, email });
		}

		const [existingUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (existingUser) {
			return fail(400, { error: 'Username already taken', username, email });
		}

		const hashedPassword = await hashPassword(password);
		const userId = generateId(15);

		await db.insert(users).values({
			id: userId,
			username,
			email,
			hashedPassword
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
