import { h as head, a9 as ensure_array_like, a as attr, b as stringify, e as escape_html } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function discountPct(price, original) {
      if (!original || original <= price) return null;
      return Math.round((original - price) / original * 100);
    }
    head("9wavdg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Saved Deals - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto"><h1 class="text-2xl font-bold mb-6">Saved Deals</h1> `);
    if (data.saved.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16 text-gray-400"><p class="text-4xl mb-3">🔖</p> <p class="text-lg font-medium">No saved deals yet</p> <p class="text-sm mt-1">Save deals to find them here later.</p> <a href="/" class="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Browse Deals</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(data.saved);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        const discount = discountPct(item.price, item.originalPrice);
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"><div class="flex-1 min-w-0"><a${attr("href", `/deals/${stringify(item.dealId)}`)} class="font-medium hover:text-orange-500 transition-colors line-clamp-1">${escape_html(item.title)}</a> <div class="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400"><span class="font-bold text-orange-500">$${escape_html(item.price.toFixed(2))}</span> `);
        if (discount) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">-${escape_html(discount)}%</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (item.merchantName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>· ${escape_html(item.merchantName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (item.categoryName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>· ${escape_html(item.categoryName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
