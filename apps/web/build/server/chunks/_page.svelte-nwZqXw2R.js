import { c as create_ssr_component, e as escape, f as each, h as add_attribute } from './ssr-CNc3xdch.js';
import { f as formatPrice, a as formatDiscount, t as timeAgo } from './utils2-DJuqDhyW.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let deals;
  let categories;
  let tab;
  let categorySlug;
  let userVotes;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  deals = data.deals;
  categories = data.categories;
  tab = data.tab;
  categorySlug = data.categorySlug;
  userVotes = data.userVotes;
  return `${$$result.head += `<!-- HEAD_svelte-1700tzl_START -->${$$result.title = `<title>TechDeels — Best Tech Hardware Deals</title>`, ""}<!-- HEAD_svelte-1700tzl_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="flex gap-8"> <aside class="hidden lg:block w-56 flex-shrink-0"><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24"><h3 class="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide" data-svelte-h="svelte-1yq4sx">Categories</h3> <ul class="space-y-1"><li><a href="${"/?tab=" + escape(tab, true)}" class="${"block px-3 py-2 rounded-lg text-sm transition-colors " + escape(
    !categorySlug ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-600 hover:bg-gray-50",
    true
  )}">All Deals</a></li> ${each(categories, (cat) => {
    return `<li><a href="${"/?tab=" + escape(tab, true) + "&amp;category=" + escape(cat.slug, true)}" class="${"block px-3 py-2 rounded-lg text-sm transition-colors " + escape(
      categorySlug === cat.slug ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-600 hover:bg-gray-50",
      true
    )}">${escape(cat.name)}</a> </li>`;
  })}</ul></div></aside>  <div class="flex-1 min-w-0"> <div class="flex items-center gap-4 mb-6"><div class="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm"><a href="${"/?tab=hot" + escape(categorySlug ? `&category=${categorySlug}` : "", true)}" class="${"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + escape(
    tab === "hot" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-900",
    true
  )}">🔥 Hot</a> <a href="${"/?tab=new" + escape(categorySlug ? `&category=${categorySlug}` : "", true)}" class="${"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + escape(
    tab === "new" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-900",
    true
  )}">✨ New</a></div> <a href="/deals/new" class="ml-auto bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm" data-svelte-h="svelte-1nihdjo">+ Submit Deal</a></div>  ${deals.length === 0 ? `<div class="bg-white rounded-xl border border-gray-200 p-12 text-center"><p class="text-gray-500 text-lg" data-svelte-h="svelte-2p4s5j">No deals found.</p> <a href="/deals/new" class="mt-4 inline-block text-amber-600 hover:text-amber-700 font-medium" data-svelte-h="svelte-1v5bbw9">Be the first to submit one!</a></div>` : `<div class="space-y-3">${each(deals, (deal) => {
    return `<div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4"> <div class="flex flex-col items-center gap-1 flex-shrink-0 w-12"><button class="${"w-8 h-8 rounded-lg flex items-center justify-center transition-colors " + escape(
      userVotes[deal.id] === 1 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-600",
      true
    )}" title="Upvote"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd"></path></svg></button> <span class="${"font-bold text-lg " + escape(
      (deal.score ?? 0) > 0 ? "text-amber-600" : (deal.score ?? 0) < 0 ? "text-red-500" : "text-gray-600",
      true
    )}">${escape(deal.score ?? 0)}</span> <button class="${"w-8 h-8 rounded-lg flex items-center justify-center transition-colors " + escape(
      userVotes[deal.id] === -1 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600",
      true
    )}" title="Downvote"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"></path></svg> </button></div>  ${deal.image_url ? `<div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"><img${add_attribute("src", deal.image_url, 0)}${add_attribute("alt", deal.title, 0)} class="w-full h-full object-cover"> </div>` : ``}  <div class="flex-1 min-w-0"><div class="flex items-start justify-between gap-2"><a href="${"/deals/" + escape(deal.id, true)}" class="text-gray-900 font-semibold hover:text-amber-600 transition-colors leading-tight line-clamp-2">${escape(deal.title)}</a> ${deal.category_name ? `<span class="flex-shrink-0 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">${escape(deal.category_name)} </span>` : ``}</div> <div class="flex flex-wrap items-center gap-3 mt-2">${deal.price !== null ? `<span class="text-green-600 font-bold text-lg">${escape(formatPrice(deal.price))}</span>` : ``} ${deal.original_price !== null && deal.price !== null ? (() => {
      let discount = formatDiscount(deal.price, deal.original_price);
      return ` ${discount ? `<span class="text-gray-400 line-through text-sm">${escape(formatPrice(deal.original_price))}</span> <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">${escape(discount)}</span>` : ``}`;
    })() : ``} ${deal.store ? `<span class="text-slate-500 text-sm">${escape(deal.store)}</span>` : ``}</div> <div class="flex items-center gap-4 mt-2 text-xs text-gray-500"><a href="${"/deals/" + escape(deal.id, true)}" class="flex items-center gap-1 hover:text-gray-700"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg> ${escape(deal.comment_count)} comments</a> <span>by <a href="${"/profile/" + escape(deal.username, true)}" class="hover:text-amber-600">${escape(deal.username ?? "unknown")}</a></span> ${deal.created_at ? `<span>${escape(timeAgo(new Date(deal.created_at)))}</span>` : ``} <a${add_attribute("href", deal.url, 0)} target="_blank" rel="noopener noreferrer" class="ml-auto text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">View Deal
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a> </div></div> </div>`;
  })}</div>`}</div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-nwZqXw2R.js.map
