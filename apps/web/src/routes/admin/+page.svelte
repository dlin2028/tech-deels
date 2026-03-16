<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Admin Dashboard - TechDeels</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

  <div class="grid grid-cols-3 gap-4">
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
      <div class="text-3xl font-bold text-orange-500">{data.stats.users}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Users</div>
    </div>
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
      <div class="text-3xl font-bold text-orange-500">{data.stats.deals}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Deals</div>
    </div>
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
      <div class="text-3xl font-bold text-orange-500">{data.stats.comments}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Comments</div>
    </div>
  </div>
</div>
