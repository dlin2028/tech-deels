import { h as head, e as escape_html, a8 as attr_class, b as stringify, a9 as ensure_array_like, a as attr } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function timeAgo(date) {
      const now = /* @__PURE__ */ new Date();
      const d = new Date(date);
      const diff = Math.floor((now.getTime() - d.getTime()) / 1e3);
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
    head("1250ir9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.profile.username)} - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto space-y-6"><div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"><div class="flex items-start gap-4"><div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">${escape_html(data.profile.username[0].toUpperCase())}</div> <div><div class="flex items-center gap-2"><h1 class="text-xl font-bold">${escape_html(data.profile.username)}</h1> `);
    if (data.profile.role !== "user") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class(`px-2 py-0.5 text-xs font-medium rounded-full ${stringify(data.profile.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300")}`)}>${escape_html(data.profile.role)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">⭐ ${escape_html(data.profile.reputation)} reputation · Joined ${escape_html(new Date(data.profile.createdAt).toLocaleDateString())}</p> `);
    if (data.profile.bio) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${escape_html(data.profile.bio)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div><h2 class="text-lg font-semibold mb-3">Deals submitted (${escape_html(data.deals.length)})</h2> `);
    if (data.deals.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-10 text-gray-400"><p>No deals submitted yet.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(data.deals);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let deal = each_array[$$index];
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"><div class="text-center w-12 shrink-0"><div class="text-sm font-bold text-orange-500">${escape_html(deal.voteScore)}</div> <div class="text-xs text-gray-400">pts</div></div> <div class="flex-1 min-w-0"><a${attr("href", `/deals/${stringify(deal.id)}`)} class="font-medium hover:text-orange-500 transition-colors line-clamp-1">${escape_html(deal.title)}</a> <div class="flex gap-2 mt-1 text-xs text-gray-400"><span class="font-medium text-orange-500">$${escape_html(deal.price.toFixed(2))}</span> `);
        if (deal.merchantName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>· ${escape_html(deal.merchantName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (deal.categoryName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>· ${escape_html(deal.categoryName)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span>· ${escape_html(timeAgo(deal.createdAt))}</span> <span>· 💬 ${escape_html(deal.commentCount)}</span></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
