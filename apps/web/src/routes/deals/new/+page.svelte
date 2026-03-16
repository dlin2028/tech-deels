<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Submit a Deal - TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Submit a Deal</h1>

  {#if form?.message}
    <div
      class="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm"
    >
      {form.message}
    </div>
  {/if}

  <form
    method="post"
    class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5"
  >
    <div>
      <label for="title" class="block text-sm font-medium mb-1.5">Deal Title *</label>
      <input
        type="text"
        id="title"
        name="title"
        value={form?.values?.title ?? ''}
        required
        minlength="10"
        maxlength="200"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="e.g. ASUS ROG 15.6&quot; Gaming Laptop - RTX 4070, 16GB RAM"
      />
      {#if form?.errors?.title}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.title[0]}</p>
      {/if}
    </div>

    <div>
      <label for="url" class="block text-sm font-medium mb-1.5">Deal URL *</label>
      <input
        type="url"
        id="url"
        name="url"
        value={form?.values?.url ?? ''}
        required
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="https://amazon.com/dp/..."
      />
      {#if form?.errors?.url}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.url[0]}</p>
      {/if}
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="price" class="block text-sm font-medium mb-1.5">Sale Price *</label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-400">$</span>
          <input
            type="number"
            id="price"
            name="price"
            value={form?.values?.price ?? ''}
            required
            step="0.01"
            min="0"
            class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="99.99"
          />
        </div>
        {#if form?.errors?.price}
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.price[0]}</p>
        {/if}
      </div>

      <div>
        <label for="originalPrice" class="block text-sm font-medium mb-1.5">Original Price</label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-400">$</span>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={form?.values?.originalPrice ?? ''}
            step="0.01"
            min="0"
            class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="149.99"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="shippingCost" class="block text-sm font-medium mb-1.5">Shipping Cost</label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-400">$</span>
          <input
            type="number"
            id="shippingCost"
            name="shippingCost"
            value={form?.values?.shippingCost ?? '0'}
            step="0.01"
            min="0"
            class="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label for="currency" class="block text-sm font-medium mb-1.5">Currency</label>
        <select
          id="currency"
          name="currency"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
        </select>
      </div>
    </div>

    <div>
      <label for="categoryId" class="block text-sm font-medium mb-1.5">Category *</label>
      <select
        id="categoryId"
        name="categoryId"
        required
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">Select a category…</option>
        {#each data.categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
      {#if form?.errors?.categoryId}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.categoryId[0]}</p>
      {/if}
    </div>

    <div>
      <label for="merchantId" class="block text-sm font-medium mb-1.5">Merchant</label>
      <select
        id="merchantId"
        name="merchantId"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">Unknown / Other</option>
        {#each data.merchants as merchant}
          <option value={merchant.id}>{merchant.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium mb-1.5">Description</label>
      <textarea
        id="description"
        name="description"
        rows="4"
        maxlength="2000"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
        placeholder="Add any helpful details about this deal…"
      >{form?.values?.description ?? ''}</textarea>
      {#if form?.errors?.description}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.description[0]}</p>
      {/if}
    </div>

    <div class="flex gap-3">
      <button
        type="submit"
        class="flex-1 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
      >
        Submit Deal
      </button>
      <a
        href="/"
        class="px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        Cancel
      </a>
    </div>
  </form>
</div>
