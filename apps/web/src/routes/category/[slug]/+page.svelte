<script lang="ts">
  import type { PageData } from './$types';
  import { formatPrice, calculateDiscount, timeAgo, formatCount } from '$lib/utils';

  let { data }: { data: PageData } = $props();

  const sortOptions = [
    { value: 'hot', label: '🔥 Hot', href: `?sort=hot` },
    { value: 'new', label: '✨ New', href: `?sort=new` },
    { value: 'top', label: '⭐ Top', href: `?sort=top` },
  ];
</script>

<svelte:head>
  <title>{data.category.name} Deals — TechDeels</title>
</svelte:head>

<div class="mb-6">
  <nav class="flex items-center gap-2 text-sm text-gray-500 mb-2">
    <a href="/" class="hover:text-gray-300 transition-colors">All Deals</a>
    <span>›</span>
    <span class="text-gray-300">{data.category.name}</span>
  </nav>
  <h1 class="text-2xl font-bold text-gray-100">{data.category.name} Deals</h1>
  {#if data.category.description}
    <p class="text-gray-500 mt-1 text-sm">{data.category.description}</p>
  {/if}
</div>

<!-- Sort tabs -->
<div class="flex items-center gap-2 mb-4">
  {#each sortOptions as opt}
    <a
      href={opt.href}
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {data.sort === opt.value
        ? 'bg-orange-500 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700'}"
    >
      {opt.label}
    </a>
  {/each}
  <span class="ml-auto text-xs text-gray-500">{data.totalDeals} deals</span>
</div>

{#if data.deals.length === 0}
  <div class="card p-12 text-center">
    <div class="text-4xl mb-3">📭</div>
    <h2 class="text-lg font-semibold text-gray-300 mb-1">No deals in this category yet</h2>
    <p class="text-gray-500 text-sm mb-4">Be the first to share a {data.category.name} deal!</p>
    <a href="/deals/new" class="btn-primary">Submit a Deal</a>
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
          </div>
          <a href="/deals/{deal.id}" class="block">
            <h2 class="text-base font-semibold text-gray-100 hover:text-orange-400 transition-colors line-clamp-2">
              {deal.title}
            </h2>
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
        <a href="?sort={data.sort}&page={data.page - 1}" class="btn-secondary text-sm">← Prev</a>
      {/if}
      <span class="text-sm text-gray-500">Page {data.page} of {Math.ceil(data.totalDeals / data.pageSize)}</span>
      {#if data.page * data.pageSize < data.totalDeals}
        <a href="?sort={data.sort}&page={data.page + 1}" class="btn-secondary text-sm">Next →</a>
      {/if}
    </div>
  {/if}
{/if}
