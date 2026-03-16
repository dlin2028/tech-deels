import { n as noop, g as getContext, h as head, c as store_get, e as escape_html, u as unsubscribe_stores } from "../../chunks/index.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
const is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
const placeholder_url = "a:";
if (is_legacy) {
  ({
    data: {},
    form: null,
    error: null,
    params: {},
    route: { id: null },
    state: {},
    status: -1,
    url: new URL(placeholder_url)
  });
}
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    head("1j96wlh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Error - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-md mx-auto mt-16 text-center"><div class="text-6xl mb-4">`);
    if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`🔍`);
    } else if (store_get($$store_subs ??= {}, "$page", page).status === 403) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`🔒`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`⚠️`);
    }
    $$renderer2.push(`<!--]--></div> <h1 class="text-3xl font-bold mb-2">${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p class="text-gray-500 dark:text-gray-400 mb-6">${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message ?? "Something went wrong")}</p> <a href="/" class="inline-block px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors">Go Home</a></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _error as default
};
