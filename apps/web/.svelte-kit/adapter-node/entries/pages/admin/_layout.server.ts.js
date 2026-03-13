import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    throw redirect(302, "/");
  }
  return {};
};
export {
  load
};
