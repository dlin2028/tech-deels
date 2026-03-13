import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!username || !email || !password) {
			return fail(400, { message: 'All fields are required' });
		}
		if (username.length < 3 || username.length > 20) {
			return fail(400, { message: 'Username must be 3-20 characters' });
		}
		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return fail(400, { message: 'Username can only contain letters, numbers, and underscores' });
		}
		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters' });
		}

		const [existing] = await db
			.select()
			.from(user)
			.where(or(eq(user.email, email), eq(user.username, username)));

		if (existing) {
			if (existing.email === email) {
				return fail(400, { message: 'Email already in use' });
			}
			return fail(400, { message: 'Username already taken' });
		}

		const passwordHash = await Bun.password.hash(password);
		const userId = generateId();

		await db.insert(user).values({
			id: userId,
			username,
			email,
			passwordHash,
			role: 'user'
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
