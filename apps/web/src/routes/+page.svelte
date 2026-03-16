<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function discountPct(price: number, original: number | null): number | null {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  }

  async function vote(dealId: number, value: number) {
    const res = await fetch('/api/deals/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, value }),
    });
    if (res.ok) {
      // Reload to reflect new score
      window.location.reload();
    }
  }
</script>

<svelte:head>
  <title>TechDeels - Hardware Deals Forum</title>
  <meta name="description" content="The best community-driven hardware deals forum." />
</svelte:head>

<div class="flex gap-6">
  <!-- Sidebar -->
  <aside class="hidden lg:block w-56 shrink-0">
    <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sticky top-20">
      <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Categories
      </h2>
      <ul class="space-y-1">
        <li>
          <a
            href="/"
            class="block text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors {!data.categorySlug
              ? 'text-orange-500 font-medium'
              : ''}"
          >
            All Deals
          </a>
        </li>
        {#each data.categories as cat}
          <li>
            <a
              href="/?category={cat.slug}"
              class="block text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors {data.categorySlug ===
              cat.slug
                ? 'text-orange-500 font-medium'
                : ''}"
            >
              {cat.name}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </aside>

  <!-- Main content -->
  <div class="flex-1 min-w-0">
    <!-- Sort tabs -->
    <div class="flex items-center gap-1 mb-4 border-b border-gray-200 dark:border-gray-800">
      <a
        href="/"
        class="px-4 py-2 text-sm font-medium transition-colors {data.sort === 'hot'
          ? 'text-orange-500 border-b-2 border-orange-500'
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}"
      >
        🔥 Hot
      </a>
      <a
        href="/?sort=new"
        class="px-4 py-2 text-sm font-medium transition-colors {data.sort === 'new'
          ? 'text-orange-500 border-b-2 border-orange-500'
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}"
      >
        ✨ New
      </a>
      <a
        href="/deals/new"
        class="ml-auto mb-1 px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
      >
        + Submit Deal
      </a>
    </div>

    <!-- Deal cards -->
    {#if data.deals.length === 0}
      <div class="text-center py-16 text-gray-500 dark:text-gray-400">
        <p class="text-4xl mb-4">🛒</p>
        <p class="text-lg font-medium">No deals yet</p>
        <p class="text-sm mt-1">Be the first to submit a deal!</p>
        <a
          href="/deals/new"
          class="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Submit a Deal
        </a>
      </div>
    {:else}
      <div class="space-y-3">
        {#each data.deals as deal}
          {@const discount = discountPct(deal.price, deal.originalPrice)}
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
          >
            <div class="flex gap-4">
              <!-- Vote column -->
              <div class="flex flex-col items-center gap-1 shrink-0 w-12">
                <button
                  onclick={() => vote(deal.id, 1)}
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 text-gray-400 hover:text-orange-500 transition-colors text-lg"
                  aria-label="Upvote"
                >
                  ▲
                </button>
                <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {deal.voteScore}
                </span>
                <button
                  onclick={() => vote(deal.id, -1)}
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-400 hover:text-blue-500 transition-colors text-lg"
                  aria-label="Downvote"
                >
                  ▼
                </button>
              </div>

              <!-- Deal content -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start gap-2 mb-2">
                  <!-- Price -->
                  <span class="text-xl font-bold text-orange-500">
                    ${deal.price.toFixed(2)}
                  </span>
                  {#if deal.originalPrice}
                    <span class="text-sm text-gray-400 line-through self-center">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                  {/if}
                  {#if discount}
                    <span
                      class="text-xs font-bold px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
                    >
                      -{discount}%
                    </span>
                  {/if}
                  {#if deal.shippingCost === 0}
                    <span
                      class="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full"
                    >
                      Free shipping
                    </span>
                  {/if}
                </div>

                <a
                  href="/deals/{deal.id}"
                  class="text-base font-medium hover:text-orange-500 transition-colors line-clamp-2"
                >
                  {deal.title}
                </a>

                <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {#if deal.merchantName}
                    <span
                      class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full font-medium"
                    >
                      {deal.merchantName}
                    </span>
                  {/if}
                  {#if deal.categoryName}
                    <a
                      href="/?category={deal.categorySlug}"
                      class="px-2 py-0.5 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                    >
                      {deal.categoryName}
                    </a>
                  {/if}
                  <span>by {deal.username}</span>
                  <span>·</span>
                  <span>{timeAgo(deal.createdAt)}</span>
                  <span>·</span>
                  <a href="/deals/{deal.id}" class="hover:text-orange-500 transition-colors">
                    💬 {deal.commentCount} comments
                  </a>
                  <a
                    href={deal.affiliateUrl ?? deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-auto px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Get Deal →
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Pagination -->
      <div class="flex justify-center gap-2 mt-8">
        {#if data.page > 1}
          <a
            href="?sort={data.sort}&page={data.page - 1}"
            class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ← Previous
          </a>
        {/if}
        {#if data.deals.length === 20}
          <a
            href="?sort={data.sort}&page={data.page + 1}"
            class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Next →
          </a>
        {/if}
      </div>
    {/if}
  </div>
</div>
