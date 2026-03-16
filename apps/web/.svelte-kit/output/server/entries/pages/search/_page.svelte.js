import { h as head, a as attr, e as escape_html, a9 as ensure_array_like, b as stringify } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let query = data.q;
    function discountPct(price, original) {
      if (!original || original <= price) return null;
      return Math.round((original - price) / original * 100);
    }
    head("e12qt1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.q ? `"${data.q}" - Search` : "Search")} - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto"><form method="get" class="mb-6"><div class="flex gap-2"><input type="search" name="q"${attr("value", query)} placeholder="Search deals…" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"/> <button type="submit" class="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors">Search</button></div></form> `);
    if (data.q) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${escape_html(data.deals.length)} result${escape_html(data.deals.length !== 1 ? "s" : "")} for "<strong>${escape_html(data.q)}</strong>"</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.deals.length === 0 && data.q) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16 text-gray-400"><p class="text-4xl mb-3">🔍</p> <p class="text-lg font-medium">No deals found</p> <p class="text-sm mt-1">Try different keywords</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(data.deals);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let deal = each_array[$$index];
        const discount = discountPct(deal.price, deal.originalPrice);
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"><div class="flex items-start gap-3"><div class="text-center w-10 shrink-0"><div class="text-sm font-bold text-orange-500">${escape_html(deal.voteScore)}</div></div> <div class="flex-1 min-w-0"><a${attr("href", `/deals/${stringify(deal.id)}`)} class="font-medium hover:text-orange-500 transition-colors">${escape_html(deal.title)}</a> <div class="flex flex-wrap gap-2 mt-1.5 text-xs"><span class="font-bold text-orange-500">$${escape_html(deal.price.toFixed(2))}</span> `);
        if (discount) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">-${escape_html(discount)}%</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deal.merchantName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-gray-400">· ${escape_html(deal.merchantName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deal.categoryName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-gray-400">· ${escape_html(deal.categoryName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
