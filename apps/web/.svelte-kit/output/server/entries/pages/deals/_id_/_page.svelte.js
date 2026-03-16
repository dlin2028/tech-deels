import { h as head, a8 as attr_class, e as escape_html, a as attr, b as stringify, a9 as ensure_array_like, a7 as derived } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let commentBody = "";
    let voteScore = Number(data.deal.voteScore);
    let userVote = data.userVote ?? null;
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
    function buildTree(items) {
      const map = /* @__PURE__ */ new Map();
      const roots = [];
      for (const c of items) {
        map.set(c.id, { ...c, children: [] });
      }
      for (const c of items) {
        const node = map.get(c.id);
        if (c.parentId && map.has(c.parentId)) {
          map.get(c.parentId).children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    }
    const commentTree = derived(() => buildTree(data.comments));
    const specs = derived(() => data.specs);
    const deal = derived(() => data.deal);
    const discount = derived(() => discountPct(deal().price, deal().originalPrice));
    head("7b3pmw", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(deal().title)} - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-6"><div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"><div class="flex gap-6"><div class="flex flex-col items-center gap-2 shrink-0 w-14"><button${attr_class(`w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-xl ${stringify(userVote === 1 ? "bg-orange-100 dark:bg-orange-900 text-orange-500" : "hover:bg-orange-50 dark:hover:bg-orange-950 text-gray-400 hover:text-orange-500")}`)} aria-label="Upvote">▲</button> <span${attr_class(`text-lg font-bold ${stringify(voteScore > 0 ? "text-orange-500" : voteScore < 0 ? "text-blue-500" : "text-gray-500")}`)}>${escape_html(voteScore)}</span> <button${attr_class(`w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-xl ${stringify(userVote === -1 ? "bg-blue-100 dark:bg-blue-900 text-blue-500" : "hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-400 hover:text-blue-500")}`)} aria-label="Downvote">▼</button></div> <div class="flex-1 min-w-0"><div class="flex flex-wrap items-center gap-2 mb-3"><span class="text-3xl font-bold text-orange-500">$${escape_html(deal().price.toFixed(2))}</span> `);
    if (deal().originalPrice) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-lg text-gray-400 line-through">$${escape_html(deal().originalPrice.toFixed(2))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (discount()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">-${escape_html(discount())}%</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (deal().shippingCost === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full text-sm">Free shipping</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="text-sm text-gray-400">+$${escape_html(deal().shippingCost.toFixed(2))} shipping</span>`);
    }
    $$renderer2.push(`<!--]--></div> <h1 class="text-xl font-semibold mb-3">${escape_html(deal().title)}</h1> <div class="flex flex-wrap gap-2 mb-4 text-sm">`);
    if (deal().merchantName) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">🏪 ${escape_html(deal().merchantName)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (deal().categoryName) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", `/?category=${stringify(deal().categorySlug)}`)} class="px-2.5 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">${escape_html(deal().categoryName)}</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="text-gray-400">Posted by ${escape_html(deal().username)} · ${escape_html(timeAgo(deal().createdAt))}</span></div> `);
    if (deal().description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">${escape_html(deal().description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <a${attr("href", deal().affiliateUrl ?? deal().url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors">Get This Deal →</a></div></div></div> `);
    if (specs()) {
      $$renderer2.push("<!--[0-->");
      const specEntries = [
        specs().brand && ["Brand", specs().brand],
        specs().cpuModel && ["CPU", specs().cpuModel],
        specs().cpuArch && ["Architecture", specs().cpuArch],
        specs().gpuModel && ["GPU", specs().gpuModel],
        specs().ramGb && ["RAM", `${specs().ramGb}GB`],
        specs().storageGb && [
          "Storage",
          `${specs().storageGb}GB ${specs().storageType ?? ""}`
        ],
        specs().condition && ["Condition", specs().condition],
        specs().screenSize && ["Screen", `${specs().screenSize}"`],
        specs().screenResolution && ["Resolution", specs().screenResolution],
        specs().refreshRate && ["Refresh Rate", `${specs().refreshRate}Hz`],
        specs().panelType && ["Panel", specs().panelType],
        specs().responseTime && ["Response Time", `${specs().responseTime}ms`]
      ].filter(Boolean);
      if (specEntries.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"><h2 class="text-lg font-semibold mb-4">Specifications</h2> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array = ensure_array_like(specEntries);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let [label, value] = each_array[$$index];
          $$renderer2.push(`<div class="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"><span class="text-gray-500 dark:text-gray-400">${escape_html(label)}:</span> <span class="ml-1 font-medium">${escape_html(value)}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"><h2 class="text-lg font-semibold mb-5">Comments (${escape_html(data.comments.length)})</h2> `);
    if (data.user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mb-6"><textarea rows="3" placeholder="Add a comment…" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-sm">`);
      const $$body = escape_html(commentBody);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea> <div class="flex justify-end mt-2"><button${attr("disabled", !commentBody.trim(), true)} class="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">${escape_html("Post Comment")}</button></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-center text-gray-500 dark:text-gray-400"><a href="/login" class="text-orange-500 hover:text-orange-600 font-medium">Log in</a> to join the discussion.</div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (commentTree().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>`);
    } else {
      let renderComment = function($$renderer3, node, depth) {
        $$renderer3.push(`<div${attr_class(`flex gap-3 ${stringify(depth > 0 ? "mt-3" : "")}`)}><div${attr_class(`w-px bg-gray-200 dark:bg-gray-700 shrink-0 ${stringify(depth > 0 ? "ml-4" : "hidden")}`)}></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1 text-xs text-gray-400"><span class="font-medium text-gray-700 dark:text-gray-300">${escape_html(node.username)}</span> <span>·</span> <span>${escape_html(timeAgo(node.createdAt))}</span> <span>·</span> <span>Score: ${escape_html(node.score)}</span></div> <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">${escape_html(node.body)}</p> <!--[-->`);
        const each_array_1 = ensure_array_like(node.children);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let child = each_array_1[$$index_1];
          renderComment($$renderer3, child, depth + 1);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      };
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array_2 = ensure_array_like(commentTree());
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let root = each_array_2[$$index_2];
        renderComment($$renderer2, root, 0);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
