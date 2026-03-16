import { h as head, e as escape_html, a as attr, a9 as ensure_array_like } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    head("rye0z1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Submit a Deal - TechDeels</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-2xl mx-auto"><h1 class="text-2xl font-bold mb-6">Submit a Deal</h1> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="post" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5"><div><label for="title" class="block text-sm font-medium mb-1.5">Deal Title *</label> <input type="text" id="title" name="title"${attr("value", form?.values?.title ?? "")} required="" minlength="10" maxlength="200" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="e.g. ASUS ROG 15.6&quot; Gaming Laptop - RTX 4070, 16GB RAM"/> `);
    if (form?.errors?.title) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${escape_html(form.errors.title[0])}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="url" class="block text-sm font-medium mb-1.5">Deal URL *</label> <input type="url" id="url" name="url"${attr("value", form?.values?.url ?? "")} required="" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://amazon.com/dp/..."/> `);
    if (form?.errors?.url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${escape_html(form.errors.url[0])}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div><label for="price" class="block text-sm font-medium mb-1.5">Sale Price *</label> <div class="relative"><span class="absolute left-3 top-2 text-gray-400">$</span> <input type="number" id="price" name="price"${attr("value", form?.values?.price ?? "")} required="" step="0.01" min="0" class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="99.99"/></div> `);
    if (form?.errors?.price) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${escape_html(form.errors.price[0])}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="originalPrice" class="block text-sm font-medium mb-1.5">Original Price</label> <div class="relative"><span class="absolute left-3 top-2 text-gray-400">$</span> <input type="number" id="originalPrice" name="originalPrice"${attr("value", form?.values?.originalPrice ?? "")} step="0.01" min="0" class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="149.99"/></div></div></div> <div class="grid grid-cols-2 gap-4"><div><label for="shippingCost" class="block text-sm font-medium mb-1.5">Shipping Cost</label> <div class="relative"><span class="absolute left-3 top-2 text-gray-400">$</span> <input type="number" id="shippingCost" name="shippingCost"${attr("value", form?.values?.shippingCost ?? "0")} step="0.01" min="0" class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="0.00"/></div></div> <div><label for="currency" class="block text-sm font-medium mb-1.5">Currency</label> <select id="currency" name="currency" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">`);
    $$renderer2.option({ value: "USD" }, ($$renderer3) => {
      $$renderer3.push(`USD`);
    });
    $$renderer2.option({ value: "EUR" }, ($$renderer3) => {
      $$renderer3.push(`EUR`);
    });
    $$renderer2.option({ value: "GBP" }, ($$renderer3) => {
      $$renderer3.push(`GBP`);
    });
    $$renderer2.option({ value: "CAD" }, ($$renderer3) => {
      $$renderer3.push(`CAD`);
    });
    $$renderer2.option({ value: "AUD" }, ($$renderer3) => {
      $$renderer3.push(`AUD`);
    });
    $$renderer2.push(`</select></div></div> <div><label for="categoryId" class="block text-sm font-medium mb-1.5">Category *</label> <select id="categoryId" name="categoryId" required="" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Select a category…`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(data.categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.option({ value: cat.id }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(cat.name)}`);
      });
    }
    $$renderer2.push(`<!--]--></select> `);
    if (form?.errors?.categoryId) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${escape_html(form.errors.categoryId[0])}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="merchantId" class="block text-sm font-medium mb-1.5">Merchant</label> <select id="merchantId" name="merchantId" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Unknown / Other`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array_1 = ensure_array_like(data.merchants);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let merchant = each_array_1[$$index_1];
      $$renderer2.option({ value: merchant.id }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(merchant.name)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></div> <div><label for="description" class="block text-sm font-medium mb-1.5">Description</label> <textarea id="description" name="description" rows="4" maxlength="2000" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y" placeholder="Add any helpful details about this deal…">`);
    const $$body = escape_html(form?.values?.description ?? "");
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    if (form?.errors?.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${escape_html(form.errors.description[0])}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-3"><button type="submit" class="flex-1 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">Submit Deal</button> <a href="/" class="px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</a></div></form></div>`);
  });
}
export {
  _page as default
};
