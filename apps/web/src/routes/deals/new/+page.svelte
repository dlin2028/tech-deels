<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head>
  <title>Submit a Deal — TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Submit a Deal</h1>
    <p class="text-gray-500 text-sm mb-8">Share a great tech deal with the community</p>

    <form method="POST" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form?.title ?? ""}
          class="w-full rounded-lg border {form?.errors?.title ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          placeholder="e.g. NVIDIA RTX 4070 for $499 at Newegg"
        />
        {#if form?.errors?.title}
          <p class="text-red-500 text-xs mt-1">{form.errors.title}</p>
        {/if}
      </div>

      <div>
        <label for="url" class="block text-sm font-medium text-gray-700 mb-1">Deal URL *</label>
        <input
          type="url"
          id="url"
          name="url"
          value={form?.url ?? ""}
          class="w-full rounded-lg border {form?.errors?.url ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          placeholder="https://www.newegg.com/..."
        />
        {#if form?.errors?.url}
          <p class="text-red-500 text-xs mt-1">{form.errors.url}</p>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Deal Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={form?.price ?? ""}
            min="0"
            step="0.01"
            class="w-full rounded-lg border {form?.errors?.price ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="499.99"
          />
          {#if form?.errors?.price}
            <p class="text-red-500 text-xs mt-1">{form.errors.price}</p>
          {/if}
        </div>
        <div>
          <label for="original_price" class="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
          <input
            type="number"
            id="original_price"
            name="original_price"
            value={form?.original_price ?? ""}
            min="0"
            step="0.01"
            class="w-full rounded-lg border {form?.errors?.original_price ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="799.99"
          />
        </div>
      </div>

      <div>
        <label for="store" class="block text-sm font-medium text-gray-700 mb-1">Store</label>
        <input
          type="text"
          id="store"
          name="store"
          value={form?.store ?? ""}
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          placeholder="e.g. Amazon, Newegg, Best Buy"
        />
      </div>

      <div>
        <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          id="category_id"
          name="category_id"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        >
          <option value="">Select a category...</option>
          {#each data.categories as cat}
            <option value={cat.id} selected={form?.category_id === cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
          placeholder="Add any additional details about this deal..."
        >{form?.description ?? ""}</textarea>
      </div>

      <div>
        <label for="image_url" class="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={form?.image_url ?? ""}
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      <div class="flex gap-3 pt-2">
        <a href="/" class="flex-1 text-center py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </a>
        <button
          type="submit"
          class="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Submit Deal
        </button>
      </div>
    </form>
  </div>
</div>
