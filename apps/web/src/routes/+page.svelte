<script lang="ts">
  import type { PageData } from "./$types";
  import { formatPrice, formatDiscount, timeAgo } from "$lib/utils";

  export let data: PageData;

  $: deals = data.deals;
  $: categories = data.categories;
  $: tab = data.tab;
  $: categorySlug = data.categorySlug;
  $: userVotes = data.userVotes;

  async function vote(dealId: number, value: number) {
    const res = await fetch(`/deals/${dealId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      const { score, userVote } = await res.json();
      deals = deals.map((d) => (d.id === dealId ? { ...d, score } : d));
      userVotes = { ...userVotes, [dealId]: userVote };
    }
  }
</script>

<svelte:head>
  <title>TechDeels — Best Tech Hardware Deals</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="flex gap-8">
    <!-- Sidebar -->
    <aside class="hidden lg:block w-56 flex-shrink-0">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
        <h3 class="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <ul class="space-y-1">
          <li>
            <a
              href="/?tab={tab}"
              class="block px-3 py-2 rounded-lg text-sm transition-colors {!categorySlug ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
            >
              All Deals
            </a>
          </li>
          {#each categories as cat}
            <li>
              <a
                href="/?tab={tab}&category={cat.slug}"
                class="block px-3 py-2 rounded-lg text-sm transition-colors {categorySlug === cat.slug ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
              >
                {cat.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <!-- Tabs -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
          <a
            href="/?tab=hot{categorySlug ? `&category=${categorySlug}` : ''}"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {tab === 'hot' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          >
            🔥 Hot
          </a>
          <a
            href="/?tab=new{categorySlug ? `&category=${categorySlug}` : ''}"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {tab === 'new' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          >
            ✨ New
          </a>
        </div>
        <a
          href="/deals/new"
          class="ml-auto bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Submit Deal
        </a>
      </div>

      <!-- Deal List -->
      {#if deals.length === 0}
        <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p class="text-gray-500 text-lg">No deals found.</p>
          <a href="/deals/new" class="mt-4 inline-block text-amber-600 hover:text-amber-700 font-medium">
            Be the first to submit one!
          </a>
        </div>
      {:else}
        <div class="space-y-3">
          {#each deals as deal (deal.id)}
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4">
              <!-- Vote Column -->
              <div class="flex flex-col items-center gap-1 flex-shrink-0 w-12">
                <button
                  on:click={() => vote(deal.id, 1)}
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors {userVotes[deal.id] === 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-600'}"
                  title="Upvote"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <span class="font-bold text-lg {(deal.score ?? 0) > 0 ? 'text-amber-600' : (deal.score ?? 0) < 0 ? 'text-red-500' : 'text-gray-600'}">
                  {deal.score ?? 0}
                </span>
                <button
                  on:click={() => vote(deal.id, -1)}
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors {userVotes[deal.id] === -1 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'}"
                  title="Downvote"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>

              <!-- Image -->
              {#if deal.image_url}
                <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img src={deal.image_url} alt={deal.title} class="w-full h-full object-cover" />
                </div>
              {/if}

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <a href="/deals/{deal.id}" class="text-gray-900 font-semibold hover:text-amber-600 transition-colors leading-tight line-clamp-2">
                    {deal.title}
                  </a>
                  {#if deal.category_name}
                    <span class="flex-shrink-0 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {deal.category_name}
                    </span>
                  {/if}
                </div>

                <div class="flex flex-wrap items-center gap-3 mt-2">
                  {#if deal.price !== null}
                    <span class="text-green-600 font-bold text-lg">{formatPrice(deal.price)}</span>
                  {/if}
                  {#if deal.original_price !== null && deal.price !== null}
                    {@const discount = formatDiscount(deal.price, deal.original_price)}
                    {#if discount}
                      <span class="text-gray-400 line-through text-sm">{formatPrice(deal.original_price)}</span>
                      <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{discount}</span>
                    {/if}
                  {/if}
                  {#if deal.store}
                    <span class="text-slate-500 text-sm">{deal.store}</span>
                  {/if}
                </div>

                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <a href="/deals/{deal.id}" class="flex items-center gap-1 hover:text-gray-700">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {deal.comment_count} comments
                  </a>
                  <span>by <a href="/profile/{deal.username}" class="hover:text-amber-600">{deal.username ?? 'unknown'}</a></span>
                  {#if deal.created_at}
                    <span>{timeAgo(new Date(deal.created_at))}</span>
                  {/if}
                  <a href={deal.url} target="_blank" rel="noopener noreferrer" class="ml-auto text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                    View Deal
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
