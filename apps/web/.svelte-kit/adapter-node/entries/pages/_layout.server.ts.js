const load = async ({ locals }) => {
  return {
    user: locals.user ? {
      id: locals.user.id,
      username: locals.user.username,
      email: locals.user.email,
      role: locals.user.role,
      reputation: locals.user.reputation
    } : null
  };
};
export {
  load
};
