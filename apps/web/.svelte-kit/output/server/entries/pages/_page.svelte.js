import { h as head, a8 as attr_class, b as stringify, a9 as ensure_array_like, a as attr, e as escape_html } from "../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function timeAgo(date) {
      const now = /* @__PURE__ */ new Date();
      const d = new Date(date);
      const diff = Math.floor((now.getTime() - d.getTime()) / 1e3);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
    function discountPct(price, original) {
      if (!original || original <= price) return null;
      return Math.round((original - price) / original * 100);
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>TechDeels - Hardware Deals Forum</title>`);
      });
      $$renderer3.push(`<meta name="description" content="The best community-driven hardware deals forum."/>`);
    });
    $$renderer2.push(`<div class="flex gap-6"><aside class="hidden lg:block w-56 shrink-0"><div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sticky top-20"><h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Categories</h2> <ul class="space-y-1"><li><a href="/"${attr_class(`block text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${stringify(!data.categorySlug ? "text-orange-500 font-medium" : "")}`)}>All Deals</a></li> <!--[-->`);
    const each_array = ensure_array_like(data.categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<li><a${attr("href", `/?category=${stringify(cat.slug)}`)}${attr_class(`block text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${stringify(data.categorySlug === cat.slug ? "text-orange-500 font-medium" : "")}`)}>${escape_html(cat.name)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div></aside> <div class="flex-1 min-w-0"><div class="flex items-center gap-1 mb-4 border-b border-gray-200 dark:border-gray-800"><a href="/"${attr_class(`px-4 py-2 text-sm font-medium transition-colors ${stringify(data.sort === "hot" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100")}`)}>🔥 Hot</a> <a href="/?sort=new"${attr_class(`px-4 py-2 text-sm font-medium transition-colors ${stringify(data.sort === "new" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100")}`)}>✨ New</a> <a href="/deals/new" class="ml-auto mb-1 px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">+ Submit Deal</a></div> `);
    if (data.deals.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16 text-gray-500 dark:text-gray-400"><p class="text-4xl mb-4">🛒</p> <p class="text-lg font-medium">No deals yet</p> <p class="text-sm mt-1">Be the first to submit a deal!</p> <a href="/deals/new" class="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Submit a Deal</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_1 = ensure_array_like(data.deals);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let deal = each_array_1[$$index_1];
        const discount = discountPct(deal.price, deal.originalPrice);
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-orange-300 dark:hover:border-orange-800 transition-colors"><div class="flex gap-4"><div class="flex flex-col items-center gap-1 shrink-0 w-12"><button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 text-gray-400 hover:text-orange-500 transition-colors text-lg" aria-label="Upvote">▲</button> <span class="text-sm font-bold text-gray-700 dark:text-gray-300">${escape_html(deal.voteScore)}</span> <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-400 hover:text-blue-500 transition-colors text-lg" aria-label="Downvote">▼</button></div> <div class="flex-1 min-w-0"><div class="flex flex-wrap items-start gap-2 mb-2"><span class="text-xl font-bold text-orange-500">$${escape_html(deal.price.toFixed(2))}</span> `);
        if (deal.originalPrice) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-sm text-gray-400 line-through self-center">$${escape_html(deal.originalPrice.toFixed(2))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (discount) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs font-bold px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">-${escape_html(discount)}%</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deal.shippingCost === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full">Free shipping</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <a${attr("href", `/deals/${stringify(deal.id)}`)} class="text-base font-medium hover:text-orange-500 transition-colors line-clamp-2">${escape_html(deal.title)}</a> <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">`);
        if (deal.merchantName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">${escape_html(deal.merchantName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deal.categoryName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/?category=${stringify(deal.categorySlug)}`)} class="px-2 py-0.5 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">${escape_html(deal.categoryName)}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span>by ${escape_html(deal.username)}</span> <span>·</span> <span>${escape_html(timeAgo(deal.createdAt))}</span> <span>·</span> <a${attr("href", `/deals/${stringify(deal.id)}`)} class="hover:text-orange-500 transition-colors">💬 ${escape_html(deal.commentCount)} comments</a> <a${attr("href", deal.affiliateUrl ?? deal.url)} target="_blank" rel="noopener noreferrer" class="ml-auto px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">Get Deal →</a></div></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex justify-center gap-2 mt-8">`);
      if (data.page > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `?sort=${stringify(data.sort)}&page=${stringify(data.page - 1)}`)} class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">← Previous</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.deals.length === 20) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `?sort=${stringify(data.sort)}&page=${stringify(data.page + 1)}`)} class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Next →</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
