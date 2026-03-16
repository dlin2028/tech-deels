<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let query = $state(data.q);

  function discountPct(price: number, original: number | null | undefined): number | null {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  }
</script>

<svelte:head>
  <title>{data.q ? `"${data.q}" - Search` : 'Search'} - TechDeels</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
  <form method="get" class="mb-6">
    <div class="flex gap-2">
      <input
        type="search"
        name="q"
        bind:value={query}
        placeholder="Search deals…"
        class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      <button
        type="submit"
        class="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
      >
        Search
      </button>
    </div>
  </form>

  {#if data.q}
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      {data.deals.length} result{data.deals.length !== 1 ? 's' : ''} for "<strong>{data.q}</strong>"
    </p>
  {/if}

  {#if data.deals.length === 0 && data.q}
    <div class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🔍</p>
      <p class="text-lg font-medium">No deals found</p>
      <p class="text-sm mt-1">Try different keywords</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.deals as deal}
        {@const discount = discountPct(deal.price, deal.originalPrice)}
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div class="flex items-start gap-3">
            <div class="text-center w-10 shrink-0">
              <div class="text-sm font-bold text-orange-500">{deal.voteScore}</div>
            </div>
            <div class="flex-1 min-w-0">
              <a href="/deals/{deal.id}" class="font-medium hover:text-orange-500 transition-colors">
                {deal.title}
              </a>
              <div class="flex flex-wrap gap-2 mt-1.5 text-xs">
                <span class="font-bold text-orange-500">${deal.price.toFixed(2)}</span>
                {#if discount}
                  <span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    -{discount}%
                  </span>
                {/if}
                {#if deal.merchantName}
                  <span class="text-gray-400">· {deal.merchantName}</span>
                {/if}
                {#if deal.categoryName}
                  <span class="text-gray-400">· {deal.categoryName}</span>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
