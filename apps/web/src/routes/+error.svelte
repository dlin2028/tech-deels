<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Error - TechDeels</title>
</svelte:head>

<div class="max-w-md mx-auto mt-16 text-center">
  <div class="text-6xl mb-4">
    {#if $page.status === 404}
      🔍
    {:else if $page.status === 403}
      🔒
    {:else}
      ⚠️
    {/if}
  </div>
  <h1 class="text-3xl font-bold mb-2">{$page.status}</h1>
  <p class="text-gray-500 dark:text-gray-400 mb-6">
    {$page.error?.message ?? 'Something went wrong'}
  </p>
  <a
    href="/"
    class="inline-block px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
  >
    Go Home
  </a>
</div>
