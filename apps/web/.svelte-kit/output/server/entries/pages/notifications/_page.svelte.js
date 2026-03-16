import { h as head, a9 as ensure_array_like, a8 as attr_class, b as stringify, e as escape_html, a as attr } from "../../../chunks/index.js";
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
    function notifLabel(type) {
      const labels = {
        comment_reply: "💬 replied to your comment",
        deal_comment: "💬 commented on your deal",
        vote_deal: "⬆️ upvoted your deal",
        mention: "📣 mentioned you"
      };
      return labels[type] ?? `📌 ${type}`;
    }
    head("1ce0uvz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Notifications - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-2xl mx-auto"><h1 class="text-2xl font-bold mb-6">Notifications</h1> `);
    if (data.notifications.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-16 text-gray-400"><p class="text-4xl mb-3">🔔</p> <p class="text-lg font-medium">No notifications</p> <p class="text-sm mt-1">You're all caught up!</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-2"><!--[-->`);
      const each_array = ensure_array_like(data.notifications);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let notif = each_array[$$index];
        $$renderer2.push(`<div${attr_class(`flex items-start gap-3 p-4 rounded-xl border transition-colors ${stringify(notif.read ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800")}`)}><div class="flex-1 min-w-0 text-sm">`);
        if (notif.actorUsername) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="font-medium">${escape_html(notif.actorUsername)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span class="text-gray-600 dark:text-gray-400">${escape_html(notifLabel(notif.type))}</span> `);
        if (notif.dealId) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/deals/${stringify(notif.dealId)}`)} class="ml-1 text-orange-500 hover:text-orange-600">View deal →</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <span class="text-xs text-gray-400 shrink-0">${escape_html(timeAgo(notif.createdAt))}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
