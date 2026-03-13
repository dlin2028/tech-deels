import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { d as db, s as sessions, u as users } from './db-bOqIGVC4.js';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);
const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      email: attributes.email,
      role: attributes.role,
      reputation: attributes.reputation
    };
  }
});

export { lucia as l };
//# sourceMappingURL=auth-Cdp_F6-9.js.map
