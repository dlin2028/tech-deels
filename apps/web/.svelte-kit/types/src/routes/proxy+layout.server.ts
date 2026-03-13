// @ts-nocheck
import type { LayoutServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  return {
    user: locals.user
      ? {
          id: locals.user.id,
          username: locals.user.username,
          email: locals.user.email,
          role: locals.user.role,
          reputation: locals.user.reputation,
        }
      : null,
  };
};
