import { error } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    error(403, "Forbidden");
  }
  return { user: locals.user };
};
export {
  load
};
