import { lucia } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ locals, cookies }) => {
    if (!locals.session) {
      return fail(401, { error: 'Not authenticated' });
    }

    await lucia.invalidateSession(locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '/',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
