import { f as fail, r as redirect } from './index-B2LGyy1l.js';
import { d as db, u as users } from './db-bOqIGVC4.js';
import { l as lucia } from './auth-Cdp_F6-9.js';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
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
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    if (!email || !password) {
      return fail(400, { error: "Email and password are required", email });
    }
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
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
      parallelism: 1
    });
    if (!validPassword) {
      return fail(400, { error: "Invalid email or password", email });
    }
    const session = await lucia.createSession(user.id, {});
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

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CHK2cG8c.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/7.CiPKhY9y.js","_app/immutable/chunks/DomzbUsG.js","_app/immutable/chunks/C-puyiLx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CZiJNgkb.js.map
