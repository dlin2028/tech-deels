import { h as head, e as escape_html } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin Dashboard - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div><h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1> <div class="grid grid-cols-3 gap-4"><div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center"><div class="text-3xl font-bold text-orange-500">${escape_html(data.stats.users)}</div> <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Users</div></div> <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center"><div class="text-3xl font-bold text-orange-500">${escape_html(data.stats.deals)}</div> <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Deals</div></div> <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center"><div class="text-3xl font-bold text-orange-500">${escape_html(data.stats.comments)}</div> <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Comments</div></div></div></div>`);
  });
}
export {
  _page as default
};
