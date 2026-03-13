<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let loading = $state(false);

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'open_box', label: 'Open Box' },
    { value: 'refurbished', label: 'Refurbished' },
    { value: 'used', label: 'Used' },
  ];
</script>

<svelte:head>
  <title>Submit a Deal — TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
  <div class="mb-6">
    <a href="/" class="text-sm text-gray-500 hover:text-gray-300 transition-colors">← Back to deals</a>
    <h1 class="text-2xl font-bold text-gray-100 mt-2">Submit a Deal</h1>
    <p class="text-gray-500 text-sm mt-1">Share an awesome tech deal with the community.</p>
  </div>

  <div class="card p-6">
    {#if form?.error}
      <div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {form.error}
      </div>
    {/if}

    <form
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
      class="space-y-5"
    >
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-300 mb-1">
          Deal Title <span class="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={form?.title ?? ''}
          required
          minlength="10"
          maxlength="255"
          class="input-field"
          placeholder="Samsung 990 Pro 2TB NVMe SSD - PCIe 4.0 (New Low)"
        />
        <p class="mt-1 text-xs text-gray-600">Be descriptive: include product name, specs, and why it's a deal.</p>
      </div>

      <!-- Deal URL -->
      <div>
        <label for="url" class="block text-sm font-medium text-gray-300 mb-1">
          Deal URL <span class="text-red-400">*</span>
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={form?.url ?? ''}
          required
          class="input-field"
          placeholder="https://amazon.com/dp/..."
        />
      </div>

      <!-- Price row -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-300 mb-1">
            Sale Price ($) <span class="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            required
            class="input-field"
            placeholder="99.99"
          />
        </div>
        <div>
          <label for="originalPrice" class="block text-sm font-medium text-gray-300 mb-1">
            Original Price ($)
          </label>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            min="0"
            step="0.01"
            class="input-field"
            placeholder="149.99"
          />
        </div>
      </div>

      <!-- Store / Brand row -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="store" class="block text-sm font-medium text-gray-300 mb-1">
            Store <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="store"
            name="store"
            value={form?.store ?? ''}
            required
            maxlength="100"
            class="input-field"
            placeholder="Amazon, Best Buy, Newegg…"
          />
        </div>
        <div>
          <label for="brand" class="block text-sm font-medium text-gray-300 mb-1">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            maxlength="100"
            class="input-field"
            placeholder="Samsung, LG, Logitech…"
          />
        </div>
      </div>

      <!-- Shipping / Condition row -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="shippingCost" class="block text-sm font-medium text-gray-300 mb-1">
            Shipping Cost ($)
          </label>
          <input
            type="number"
            id="shippingCost"
            name="shippingCost"
            min="0"
            step="0.01"
            value="0"
            class="input-field"
            placeholder="0 for free shipping"
          />
        </div>
        <div>
          <label for="condition" class="block text-sm font-medium text-gray-300 mb-1">Condition</label>
          <select id="condition" name="condition" class="input-field">
            {#each conditions as c}
              <option value={c.value}>{c.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Category -->
      <div>
        <label for="categoryId" class="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select id="categoryId" name="categoryId" class="input-field">
          <option value="">Select a category…</option>
          {#each data.categories as cat}
            <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>

      <!-- Image URL -->
      <div>
        <label for="imageUrl" class="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          class="input-field"
          placeholder="https://…/product-image.jpg"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          class="input-field resize-y"
          placeholder="Add any relevant details: specs, coupon codes, how to activate the deal, expiry date, etc."
        ></textarea>
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" disabled={loading} class="btn-primary px-6 py-2.5">
          {#if loading}
            <span class="animate-pulse">Submitting…</span>
          {:else}
            Submit Deal
          {/if}
        </button>
        <a href="/" class="btn-secondary px-6 py-2.5">Cancel</a>
      </div>
    </form>
  </div>
</div>
