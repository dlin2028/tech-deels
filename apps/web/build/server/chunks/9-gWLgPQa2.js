import { f as fail, r as redirect } from './index-B2LGyy1l.js';
import { d as db, u as users } from './db-bOqIGVC4.js';
import { l as lucia } from './auth-Cdp_F6-9.js';
import { hash } from '@node-rs/argon2';
import { or, eq } from 'drizzle-orm';
import 'postgres';
import 'drizzle-orm/postgres-js';
import 'drizzle-orm/pg-core';
import 'lucia';
import '@lucia-auth/adapter-drizzle';

const load = async ({ locals }) => {
  if (locals.user) throw redirect(302, "/");
  return {};
};
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = String(data.get("username") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    const errors = {};
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
      return fail(400, { errors, username, email });
    }
    const existing = await db.select({ id: users.id, username: users.username, email: users.email }).from(users).where(or(eq(users.username, username), eq(users.email, email))).limit(1);
    if (existing.length > 0) {
      if (existing[0].username === username) {
        return fail(400, { errors: { username: "Username already taken" }, username, email });
      }
      return fail(400, { errors: { email: "Email already registered" }, username, email });
    }
    const hashed_password = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      username,
      email,
      hashed_password,
      role: "user",
      reputation: 0
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    throw redirect(302, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BqANytvR.js')).default;
const server_id = "src/routes/register/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BlDXII3N.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-gWLgPQa2.js.map
