import { h as head, a9 as ensure_array_like, e as escape_html } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function timeAgo(date) {
      const now = /* @__PURE__ */ new Date();
      const d = new Date(date);
      const diff = Math.floor((now.getTime() - d.getTime()) / 1e3);
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
    head("1qo3iej", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Moderation Queue - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto"><h1 class="text-2xl font-bold mb-6">Moderation Queue</h1> `);
    if (data.reports.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16 text-gray-400"><p class="text-4xl mb-3">✅</p> <p class="text-lg font-medium">Queue is empty</p> <p class="text-sm mt-1">No pending reports.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(data.reports);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let report = each_array[$$index];
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"><div class="flex items-start justify-between gap-4"><div><div class="flex items-center gap-2 mb-1"><span class="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">${escape_html(report.targetType)}</span> <span class="text-xs text-gray-400">#${escape_html(report.targetId)}</span></div> <p class="text-sm font-medium">${escape_html(report.reason)}</p> `);
        if (report.details) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${escape_html(report.details)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <p class="text-xs text-gray-400 mt-2">Reported by ${escape_html(report.reporterUsername)} · ${escape_html(timeAgo(report.createdAt))}</p></div> <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 shrink-0">${escape_html(report.status)}</span></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
