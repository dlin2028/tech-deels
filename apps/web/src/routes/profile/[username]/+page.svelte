<script lang="ts">
  import type { PageData } from "./$types";
  import { formatPrice, timeAgo } from "$lib/utils";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.profile.username}'s Profile — TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <!-- Profile Header -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex items-center gap-5">
      <div class="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-2xl">
        {data.profile.username[0].toUpperCase()}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{data.profile.username}</h1>
        <div class="flex items-center gap-3 mt-1">
          {#if data.profile.role === 'admin'}
            <span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
          {/if}
          {#if data.profile.created_at}
            <span class="text-sm text-gray-500">Joined {timeAgo(new Date(data.profile.created_at))}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">{data.stats.dealCount}</div>
        <div class="text-sm text-gray-500 mt-1">Deals Submitted</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-amber-600">{data.stats.totalScore}</div>
        <div class="text-sm text-gray-500 mt-1">Total Score</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{data.profile.reputation ?? 0}</div>
        <div class="text-sm text-gray-500 mt-1">Reputation</div>
      </div>
    </div>
  </div>

  <!-- Submitted Deals -->
  <h2 class="font-bold text-lg text-gray-900 mb-4">Submitted Deals</h2>

  {#if data.deals.length === 0}
    <div class="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No deals submitted yet.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.deals as deal}
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <span class="font-bold text-lg w-10 text-center {(deal.score ?? 0) > 0 ? 'text-amber-600' : (deal.score ?? 0) < 0 ? 'text-red-500' : 'text-gray-600'}">
            {deal.score ?? 0}
          </span>
          <div class="flex-1 min-w-0">
            <a href="/deals/{deal.id}" class="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
              {deal.title}
            </a>
            <div class="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
              {#if deal.price !== null}
                <span class="text-green-600 font-medium">{formatPrice(deal.price)}</span>
              {/if}
              {#if deal.store}
                <span>{deal.store}</span>
              {/if}
              {#if deal.created_at}
                <span class="ml-auto text-xs">{timeAgo(new Date(deal.created_at))}</span>
              {/if}
            </div>
          </div>
          {#if deal.status === 'expired'}
            <span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Expired</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
