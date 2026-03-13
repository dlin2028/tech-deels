import { r as redirect } from './index-B2LGyy1l.js';
import { l as lucia } from './auth-Cdp_F6-9.js';
import 'lucia';
import '@lucia-auth/adapter-drizzle';
import './db-bOqIGVC4.js';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const POST = async ({ locals, cookies }) => {
  if (locals.session) {
    await lucia.invalidateSession(locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  throw redirect(302, "/");
};

export { POST };
//# sourceMappingURL=_server.ts-Bdjt3qI5.js.map
