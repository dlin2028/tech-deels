import { h as head, a as attr, b as stringify, e as escape_html } from "../../chunks/index.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>TechDeels - Hardware Deals Forum</title>`);
      });
      $$renderer3.push(`<script>
    // Prevent flash of wrong theme
    (function () {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    })();
  <\/script>`);
      $$renderer3.push(`<!---->`);
    });
    $$renderer2.push(`<div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"><header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center gap-6"><a href="/" class="text-xl font-bold text-orange-500">🔥 TechDeels</a> <nav class="hidden md:flex items-center gap-4 text-sm"><a href="/" class="hover:text-orange-500 transition-colors">Hot</a> <a href="/?sort=new" class="hover:text-orange-500 transition-colors">New</a> <a href="/deals/new" class="hover:text-orange-500 transition-colors">Submit Deal</a></nav></div> <div class="flex items-center gap-3"><button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`🌙`);
    }
    $$renderer2.push(`<!--]--></button> `);
    if (data.user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a href="/notifications" class="text-sm hover:text-orange-500 transition-colors" aria-label="Notifications">🔔</a> <a${attr("href", `/u/${stringify(data.user.username)}`)} class="text-sm font-medium hover:text-orange-500 transition-colors">${escape_html(data.user.username)}</a> <form action="/logout" method="post"><button type="submit" class="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Logout</button></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a href="/login" class="text-sm px-3 py-1.5 hover:text-orange-500 transition-colors">Login</a> <a href="/signup" class="text-sm px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Sign Up</a>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></header> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main> <footer class="mt-16 border-t border-gray-200 dark:border-gray-800 py-8"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400"><div class="flex justify-center gap-6 mb-4"><a href="/guidelines" class="hover:text-orange-500 transition-colors">Guidelines</a> <a href="/privacy" class="hover:text-orange-500 transition-colors">Privacy</a> <a href="/terms" class="hover:text-orange-500 transition-colors">Terms</a> <a href="/affiliate-disclosure" class="hover:text-orange-500 transition-colors">Affiliate Disclosure</a></div> <p>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} TechDeels. All rights reserved.</p></div></footer></div>`);
  });
}
export {
  _layout as default
};
