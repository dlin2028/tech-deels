import "clsx";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="flex gap-6"><aside class="w-48 shrink-0"><div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-20"><h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Admin</h2> <nav class="space-y-1"><a href="/admin" class="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Dashboard</a> <a href="/mod/queue" class="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Mod Queue</a></nav></div></aside> <div class="flex-1 min-w-0">`);
  children($$renderer);
  $$renderer.push(`<!----></div></div>`);
}
export {
  _layout as default
};
