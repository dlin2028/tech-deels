<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function discountPct(price: number, original: number | null | undefined): number | null {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  }
</script>

<svelte:head>
  <title>Saved Deals - TechDeels</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Saved Deals</h1>

  {#if data.saved.length === 0}
    <div class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🔖</p>
      <p class="text-lg font-medium">No saved deals yet</p>
      <p class="text-sm mt-1">Save deals to find them here later.</p>
      <a
        href="/"
        class="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Browse Deals
      </a>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.saved as item}
        {@const discount = discountPct(item.price, item.originalPrice)}
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"
        >
          <div class="flex-1 min-w-0">
            <a href="/deals/{item.dealId}" class="font-medium hover:text-orange-500 transition-colors line-clamp-1">
              {item.title}
            </a>
            <div class="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span class="font-bold text-orange-500">${item.price.toFixed(2)}</span>
              {#if discount}
                <span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                  -{discount}%
                </span>
              {/if}
              {#if item.merchantName}<span>· {item.merchantName}</span>{/if}
              {#if item.categoryName}<span>· {item.categoryName}</span>{/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
