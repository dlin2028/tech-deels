<script lang="ts">
  import type { PageData } from './$types';
  import { formatPrice, calculateDiscount, timeAgo, formatCount } from '$lib/utils';

  let { data }: { data: PageData } = $props();

  const sortOptions = [
    { value: 'hot', label: '🔥 Hot', href: '/?sort=hot' },
    { value: 'new', label: '✨ New', href: '/?sort=new' },
    { value: 'top', label: '⭐ Top', href: '/?sort=top' },
  ];
</script>

<svelte:head>
  <title>TechDeels — Best Tech Deals, Shared by the Community</title>
</svelte:head>

<div class="flex flex-col lg:flex-row gap-6">
  <!-- Main feed -->
  <div class="flex-1 min-w-0">
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
      <span class="ml-auto text-xs text-gray-500">{data.totalDeals} active deals</span>
    </div>

    <!-- Deal cards -->
    {#if data.deals.length === 0}
      <div class="card p-12 text-center">
        <div class="text-4xl mb-3">🔍</div>
        <h2 class="text-lg font-semibold text-gray-300 mb-1">No deals found</h2>
        <p class="text-gray-500 text-sm mb-4">Be the first to share a deal!</p>
        <a href="/deals/new" class="btn-primary">Submit a Deal</a>
      </div>
    {:else}
      <div class="space-y-3">
        {#each data.deals as deal}
          {@const discount = calculateDiscount(deal.price, deal.originalPrice)}
          <article class="deal-card p-4 flex gap-4">
            <!-- Vote column -->
            <div class="flex flex-col items-center gap-1 shrink-0 w-12">
              <form method="POST" action="/deals/{deal.id}/vote?/upvote">
                <button
                  type="submit"
                  class="flex flex-col items-center text-gray-500 hover:text-orange-400 transition-colors group"
                  title="Upvote"
                >
                  <span class="text-lg leading-none group-hover:scale-110 transition-transform">▲</span>
                </button>
              </form>
              <span class="text-sm font-bold {deal.upvotes - deal.downvotes >= 50 ? 'text-orange-400' : deal.upvotes - deal.downvotes >= 10 ? 'text-yellow-400' : 'text-gray-300'}">
                {formatCount(deal.upvotes - deal.downvotes)}
              </span>
              <form method="POST" action="/deals/{deal.id}/vote?/downvote">
                <button
                  type="submit"
                  class="text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none"
                  title="Downvote"
                >
                  ▼
                </button>
              </form>
            </div>

            <!-- Deal image (optional) -->
            {#if deal.imageUrl}
              <a href="/deals/{deal.id}" class="shrink-0 hidden sm:block">
                <img
                  src={deal.imageUrl}
                  alt={deal.title}
                  class="w-20 h-20 object-cover rounded-lg bg-gray-800"
                  loading="lazy"
                />
              </a>
            {:else}
              <a href="/deals/{deal.id}" class="shrink-0 hidden sm:block">
                <div class="w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center text-3xl">
                  🛒
                </div>
              </a>
            {/if}

            <!-- Deal info -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                {#if deal.isFeatured}
                  <span class="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded uppercase tracking-wide">Featured</span>
                {/if}
                {#if discount >= 20}
                  <span class="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">-{discount}%</span>
                {/if}
                {#if deal.categoryName}
                  <a href="/category/{deal.categorySlug}" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {deal.categoryName}
                  </a>
                {/if}
              </div>

              <a href="/deals/{deal.id}" class="block">
                <h2 class="text-base font-semibold text-gray-100 hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {deal.title}
                </h2>
              </a>

              <!-- Price row -->
              <div class="flex flex-wrap items-center gap-3 mt-2">
                <span class="text-xl font-bold text-green-400">{formatPrice(deal.price)}</span>
                {#if deal.originalPrice && deal.originalPrice > deal.price}
                  <span class="text-sm text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
                {/if}
                {#if deal.shippingCost === 0}
                  <span class="text-xs text-blue-400">Free Shipping</span>
                {:else if deal.shippingCost}
                  <span class="text-xs text-gray-500">+{formatPrice(deal.shippingCost)} shipping</span>
                {/if}
              </div>

              <!-- Meta row -->
              <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span class="font-medium text-gray-400">{deal.store}</span>
                {#if deal.brand}
                  <span>· {deal.brand}</span>
                {/if}
                <span>·</span>
                <a href="/deals/{deal.id}#comments" class="flex items-center gap-1 hover:text-gray-300 transition-colors">
                  💬 {deal.commentCount}
                </a>
                <span>·</span>
                <span>{timeAgo(deal.createdAt)}</span>
                {#if deal.username}
                  <span>· by <a href="/user/{deal.username}" class="hover:text-gray-300 transition-colors">{deal.username}</a></span>
                {/if}
              </div>
            </div>

            <!-- Get Deal button -->
            <div class="shrink-0 hidden sm:flex flex-col justify-center">
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="btn-primary text-xs px-3 py-2 whitespace-nowrap"
              >
                Get Deal →
              </a>
            </div>
          </article>
        {/each}
      </div>

      <!-- Pagination -->
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
  </div>

  <!-- Sidebar -->
  <aside class="w-full lg:w-72 shrink-0">
    <!-- Submit deal CTA -->
    <div class="card p-5 mb-4 text-center">
      <div class="text-3xl mb-2">💡</div>
      <h3 class="font-semibold text-gray-200 mb-1">Found a great deal?</h3>
      <p class="text-sm text-gray-500 mb-3">Share it with the community and earn reputation!</p>
      <a href="/deals/new" class="btn-primary w-full">Submit a Deal</a>
    </div>

    <!-- Stats card -->
    <div class="card p-4 mb-4">
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Forum Stats</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Active Deals</span>
          <span class="font-semibold text-gray-200">{data.totalDeals}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Categories</span>
          <span class="font-semibold text-gray-200">8</span>
        </div>
      </div>
    </div>

    <!-- Categories quick nav -->
    <div class="card p-4">
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Categories</h3>
      <div class="space-y-1">
        {#each [
          { name: 'Components', slug: 'components', icon: '⚙️' },
          { name: 'Laptops', slug: 'laptops', icon: '💻' },
          { name: 'Systems', slug: 'systems', icon: '🖥️' },
          { name: 'Peripherals', slug: 'peripherals', icon: '🖱️' },
          { name: 'Networking', slug: 'networking', icon: '📡' },
          { name: 'Home Entertainment', slug: 'home-entertainment', icon: '📺' },
          { name: 'Monitors', slug: 'monitors', icon: '🖥️' },
          { name: 'Storage', slug: 'storage', icon: '💾' },
        ] as cat}
          <a
            href="/category/{cat.slug}"
            class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </aside>
</div>
