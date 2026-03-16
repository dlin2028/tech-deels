import { redirect } from "@sveltejs/kit";
import { l as lucia } from "../../../../chunks/auth.js";
const POST = async ({ locals, cookies }) => {
  if (!locals.session) {
    redirect(302, "/");
  }
  await lucia.invalidateSession(locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes
  });
  redirect(302, "/login");
};
export {
  POST
};
