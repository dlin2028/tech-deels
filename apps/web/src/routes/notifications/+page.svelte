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

  function notifLabel(type: string): string {
    const labels: Record<string, string> = {
      comment_reply: '💬 replied to your comment',
      deal_comment: '💬 commented on your deal',
      vote_deal: '⬆️ upvoted your deal',
      mention: '📣 mentioned you',
    };
    return labels[type] ?? `📌 ${type}`;
  }
</script>

<svelte:head>
  <title>Notifications - TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Notifications</h1>

  {#if data.notifications.length === 0}
    <div class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🔔</p>
      <p class="text-lg font-medium">No notifications</p>
      <p class="text-sm mt-1">You're all caught up!</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each data.notifications as notif}
        <div
          class="flex items-start gap-3 p-4 rounded-xl border transition-colors {notif.read
            ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
            : 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'}"
        >
          <div class="flex-1 min-w-0 text-sm">
            {#if notif.actorUsername}
              <span class="font-medium">{notif.actorUsername}</span>
            {/if}
            <span class="text-gray-600 dark:text-gray-400"> {notifLabel(notif.type)}</span>
            {#if notif.dealId}
              <a href="/deals/{notif.dealId}" class="ml-1 text-orange-500 hover:text-orange-600">
                View deal →
              </a>
            {/if}
          </div>
          <span class="text-xs text-gray-400 shrink-0">{timeAgo(notif.createdAt)}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
