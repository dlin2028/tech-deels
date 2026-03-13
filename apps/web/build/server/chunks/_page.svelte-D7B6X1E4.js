import { c as create_ssr_component, e as escape, h as add_attribute, f as each } from './ssr-CNc3xdch.js';
import { f as formatPrice, t as timeAgo } from './utils2-DJuqDhyW.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-h13luz_START -->${$$result.title = `<title>${escape(data.q ? `Search: ${data.q}` : "Search")} — TechDeels</title>`, ""}<!-- HEAD_svelte-h13luz_END -->`, ""} <div class="max-w-4xl mx-auto px-4 py-8"><div class="mb-6"><form action="/search" method="GET" class="flex gap-3"><input type="search" name="q"${add_attribute("value", data.q, 0)} placeholder="Search deals..." class="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"> <button type="submit" class="bg-amber-500 hover:bg-amber-400 text-white font-medium px-6 py-3 rounded-xl transition-colors" data-svelte-h="svelte-1kgpeq9">Search</button></form></div> ${data.q ? `<h1 class="text-lg font-semibold text-gray-900 mb-4">${escape(data.results.length)} result${escape(data.results.length !== 1 ? "s" : "")} for &quot;<span class="text-amber-600">${escape(data.q)}</span>&quot;</h1>` : ``} ${data.results.length === 0 && data.q ? `<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"><p class="text-gray-500">No deals found matching &quot;${escape(data.q)}&quot;</p> <a href="/" class="mt-4 inline-block text-amber-600 hover:text-amber-700 font-medium" data-svelte-h="svelte-dhmh93">Browse all deals</a></div>` : `<div class="space-y-3">${each(data.results, (deal) => {
    return `<div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4"><div class="text-center flex-shrink-0 w-10"><span class="${"font-bold text-lg " + escape(
      (deal.score ?? 0) > 0 ? "text-amber-600" : (deal.score ?? 0) < 0 ? "text-red-500" : "text-gray-600",
      true
    )}">${escape(deal.score ?? 0)} </span></div> <div class="flex-1 min-w-0"><a href="${"/deals/" + escape(deal.id, true)}" class="text-gray-900 font-semibold hover:text-amber-600 transition-colors leading-tight">${escape(deal.title)}</a> <div class="flex flex-wrap items-center gap-3 mt-1">${deal.price !== null ? `<span class="text-green-600 font-bold">${escape(formatPrice(deal.price))}</span>` : ``} ${deal.store ? `<span class="text-slate-500 text-sm">${escape(deal.store)}</span>` : ``} ${deal.category_name ? `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${escape(deal.category_name)}</span>` : ``} <span class="text-xs text-gray-400 ml-auto">by ${escape(deal.username ?? "unknown")} · ${escape(deal.created_at ? timeAgo(new Date(deal.created_at)) : "")}</span> </div></div> </div>`;
  })}</div>`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-D7B6X1E4.js.map
