import { c as create_ssr_component, h as add_attribute, e as escape } from './ssr-CNc3xdch.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  return `${$$result.head += `<!-- HEAD_svelte-fi9gpv_START -->${$$result.title = `<title>Register — TechDeels</title>`, ""}<!-- HEAD_svelte-fi9gpv_END -->`, ""} <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4"><div class="w-full max-w-md"><div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-gray-900" data-svelte-h="svelte-1kva0lr">Create your account</h1> <p class="text-gray-500 mt-1 text-sm" data-svelte-h="svelte-1b9rwk1">Join TechDeels and start sharing great deals</p></div> <form method="POST" class="space-y-5"><div><label for="username" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-1nk052n">Username</label> <input type="text" id="username" name="username"${add_attribute("value", form?.username ?? "", 0)} autocomplete="username" class="${"w-full rounded-lg border " + escape(
    form?.errors?.username ? "border-red-400 bg-red-50" : "border-gray-300",
    true
  ) + " px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"}" placeholder="cooluser123"> ${form?.errors?.username ? `<p class="text-red-500 text-xs mt-1">${escape(form.errors.username)}</p>` : ``}</div> <div><label for="email" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-iilyph">Email</label> <input type="email" id="email" name="email"${add_attribute("value", form?.email ?? "", 0)} autocomplete="email" class="${"w-full rounded-lg border " + escape(
    form?.errors?.email ? "border-red-400 bg-red-50" : "border-gray-300",
    true
  ) + " px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"}" placeholder="you@example.com"> ${form?.errors?.email ? `<p class="text-red-500 text-xs mt-1">${escape(form.errors.email)}</p>` : ``}</div> <div><label for="password" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-b550d9">Password</label> <input type="password" id="password" name="password" autocomplete="new-password" class="${"w-full rounded-lg border " + escape(
    form?.errors?.password ? "border-red-400 bg-red-50" : "border-gray-300",
    true
  ) + " px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"}" placeholder="At least 8 characters"> ${form?.errors?.password ? `<p class="text-red-500 text-xs mt-1">${escape(form.errors.password)}</p>` : ``}</div> <button type="submit" class="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm" data-svelte-h="svelte-bj4hs8">Create Account</button></form> <p class="text-center text-sm text-gray-500 mt-6">Already have an account?
        <a href="/login" class="text-amber-600 hover:text-amber-700 font-medium" data-svelte-h="svelte-1cermy5">Sign in</a></p></div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BqANytvR.js.map
