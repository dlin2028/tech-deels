<script lang="ts">
  import type { PageData } from './$types';
  import { formatPrice, calculateDiscount, timeAgo, formatCount } from '$lib/utils';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.query ? `Search: ${data.query}` : 'Search'} — TechDeels</title>
</svelte:head>

<div class="mb-6">
  <h1 class="text-2xl font-bold text-gray-100">
    {#if data.query}
      Search results for <span class="text-orange-400">"{data.query}"</span>
    {:else}
      Search Deals
    {/if}
  </h1>
  {#if data.query}
    <p class="text-gray-500 mt-1 text-sm">{data.totalDeals} result{data.totalDeals !== 1 ? 's' : ''} found</p>
  {/if}
</div>

{#if !data.query}
  <div class="card p-12 text-center">
    <div class="text-4xl mb-3">🔍</div>
    <p class="text-gray-500">Enter a search term to find deals.</p>
  </div>
{:else if data.deals.length === 0}
  <div class="card p-12 text-center">
    <div class="text-4xl mb-3">😢</div>
    <h2 class="text-lg font-semibold text-gray-300 mb-1">No deals found</h2>
    <p class="text-gray-500 text-sm mb-4">Try different keywords or browse our categories.</p>
    <a href="/" class="btn-secondary">Browse All Deals</a>
  </div>
{:else}
  <div class="space-y-3">
    {#each data.deals as deal}
      {@const discount = calculateDiscount(deal.price, deal.originalPrice)}
      <article class="deal-card p-4 flex gap-4">
        <div class="flex flex-col items-center gap-1 shrink-0 w-12">
          <span class="text-sm font-bold {deal.upvotes - deal.downvotes >= 50 ? 'text-orange-400' : 'text-gray-300'}">
            {formatCount(deal.upvotes - deal.downvotes)}
          </span>
          <span class="text-xs text-gray-600">votes</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            {#if discount >= 20}
              <span class="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">-{discount}%</span>
            {/if}
            {#if deal.categoryName}
              <a href="/category/{deal.categorySlug}" class="text-xs text-gray-500 hover:text-gray-300">{deal.categoryName}</a>
            {/if}
          </div>
          <a href="/deals/{deal.id}" class="block">
            <h2 class="text-base font-semibold text-gray-100 hover:text-orange-400 transition-colors line-clamp-2">{deal.title}</h2>
          </a>
          <div class="flex flex-wrap items-center gap-3 mt-2">
            <span class="text-lg font-bold text-green-400">{formatPrice(deal.price)}</span>
            {#if deal.originalPrice && deal.originalPrice > deal.price}
              <span class="text-sm text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
            {/if}
          </div>
          <div class="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
            <span class="font-medium text-gray-400">{deal.store}</span>
            <span>· 💬 {deal.commentCount}</span>
            <span>· {timeAgo(deal.createdAt)}</span>
          </div>
        </div>
        <div class="shrink-0 hidden sm:flex items-center">
          <a href={deal.url} target="_blank" rel="noopener noreferrer nofollow" class="btn-primary text-xs px-3 py-2">
            Get Deal →
          </a>
        </div>
      </article>
    {/each}
  </div>

  {#if data.totalDeals > data.pageSize}
    <div class="flex items-center justify-center gap-2 mt-6">
      {#if data.page > 1}
        <a href="?q={encodeURIComponent(data.query)}&page={data.page - 1}" class="btn-secondary text-sm">← Prev</a>
      {/if}
      <span class="text-sm text-gray-500">Page {data.page} of {Math.ceil(data.totalDeals / data.pageSize)}</span>
      {#if data.page * data.pageSize < data.totalDeals}
        <a href="?q={encodeURIComponent(data.query)}&page={data.page + 1}" class="btn-secondary text-sm">Next →</a>
      {/if}
    </div>
  {/if}
{/if}
