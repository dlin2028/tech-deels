<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
</script>

<svelte:head>
  <title>{data.profile.username} - TechDeels</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
  <!-- Profile header -->
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
    <div class="flex items-start gap-4">
      <div
        class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shrink-0"
      >
        {data.profile.username[0].toUpperCase()}
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold">{data.profile.username}</h1>
          {#if data.profile.role !== 'user'}
            <span
              class="px-2 py-0.5 text-xs font-medium rounded-full {data.profile.role === 'admin'
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}"
            >
              {data.profile.role}
            </span>
          {/if}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ⭐ {data.profile.reputation} reputation · Joined {new Date(
            data.profile.createdAt,
          ).toLocaleDateString()}
        </p>
        {#if data.profile.bio}
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{data.profile.bio}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Deals list -->
  <div>
    <h2 class="text-lg font-semibold mb-3">
      Deals submitted ({data.deals.length})
    </h2>
    {#if data.deals.length === 0}
      <div class="text-center py-10 text-gray-400">
        <p>No deals submitted yet.</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each data.deals as deal}
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"
          >
            <div class="text-center w-12 shrink-0">
              <div class="text-sm font-bold text-orange-500">{deal.voteScore}</div>
              <div class="text-xs text-gray-400">pts</div>
            </div>
            <div class="flex-1 min-w-0">
              <a href="/deals/{deal.id}" class="font-medium hover:text-orange-500 transition-colors line-clamp-1">
                {deal.title}
              </a>
              <div class="flex gap-2 mt-1 text-xs text-gray-400">
                <span class="font-medium text-orange-500">${deal.price.toFixed(2)}</span>
                {#if deal.merchantName}
                  <span>· {deal.merchantName}</span>
                {/if}
                {#if deal.categoryName}
                  <span>· {deal.categoryName}</span>
                {/if}
                <span>· {timeAgo(deal.createdAt)}</span>
                <span>· 💬 {deal.commentCount}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
