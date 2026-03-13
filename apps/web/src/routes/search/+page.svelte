<script lang="ts">
  import type { PageData } from "./$types";
  import { formatPrice, formatDiscount, timeAgo } from "$lib/utils";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.q ? `Search: ${data.q}` : 'Search'} — TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-6">
    <form action="/search" method="GET" class="flex gap-3">
      <input
        type="search"
        name="q"
        value={data.q}
        placeholder="Search deals..."
        class="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
      />
      <button type="submit" class="bg-amber-500 hover:bg-amber-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
        Search
      </button>
    </form>
  </div>

  {#if data.q}
    <h1 class="text-lg font-semibold text-gray-900 mb-4">
      {data.results.length} result{data.results.length !== 1 ? 's' : ''} for "<span class="text-amber-600">{data.q}</span>"
    </h1>
  {/if}

  {#if data.results.length === 0 && data.q}
    <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p class="text-gray-500">No deals found matching "{data.q}"</p>
      <a href="/" class="mt-4 inline-block text-amber-600 hover:text-amber-700 font-medium">Browse all deals</a>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.results as deal (deal.id)}
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4">
          <div class="text-center flex-shrink-0 w-10">
            <span class="font-bold text-lg {(deal.score ?? 0) > 0 ? 'text-amber-600' : (deal.score ?? 0) < 0 ? 'text-red-500' : 'text-gray-600'}">
              {deal.score ?? 0}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <a href="/deals/{deal.id}" class="text-gray-900 font-semibold hover:text-amber-600 transition-colors leading-tight">
              {deal.title}
            </a>
            <div class="flex flex-wrap items-center gap-3 mt-1">
              {#if deal.price !== null}
                <span class="text-green-600 font-bold">{formatPrice(deal.price)}</span>
              {/if}
              {#if deal.store}
                <span class="text-slate-500 text-sm">{deal.store}</span>
              {/if}
              {#if deal.category_name}
                <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{deal.category_name}</span>
              {/if}
              <span class="text-xs text-gray-400 ml-auto">
                by {deal.username ?? 'unknown'} · {deal.created_at ? timeAgo(new Date(deal.created_at)) : ''}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
