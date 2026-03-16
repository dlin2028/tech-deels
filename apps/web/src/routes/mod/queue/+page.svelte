<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
</script>

<svelte:head>
  <title>Moderation Queue - TechDeels</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Moderation Queue</h1>

  {#if data.reports.length === 0}
    <div class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">✅</p>
      <p class="text-lg font-medium">Queue is empty</p>
      <p class="text-sm mt-1">No pending reports.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.reports as report}
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                >
                  {report.targetType}
                </span>
                <span class="text-xs text-gray-400">#{report.targetId}</span>
              </div>
              <p class="text-sm font-medium">{report.reason}</p>
              {#if report.details}
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.details}</p>
              {/if}
              <p class="text-xs text-gray-400 mt-2">
                Reported by {report.reporterUsername} · {timeAgo(report.createdAt)}
              </p>
            </div>
            <span
              class="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 shrink-0"
            >
              {report.status}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
