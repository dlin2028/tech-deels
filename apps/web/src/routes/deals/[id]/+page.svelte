<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let commentBody = $state('');
  let replyTo = $state<number | null>(null);
  let submitting = $state(false);
  let voteScore = $state(Number(data.deal.voteScore));
  let userVote = $state<number | null>(data.userVote ?? null);

  function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function discountPct(price: number, original: number | null | undefined): number | null {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  }

  async function vote(value: number) {
    const res = await fetch('/api/deals/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId: data.deal.id, value }),
    });
    if (res.ok) {
      if (userVote === value) {
        voteScore -= value;
        userVote = null;
      } else {
        voteScore += userVote ? value * 2 : value;
        userVote = value;
      }
    }
  }

  async function submitComment() {
    if (!commentBody.trim()) return;
    submitting = true;
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: commentBody,
        dealId: data.deal.id,
        parentId: replyTo,
      }),
    });
    if (res.ok) {
      window.location.reload();
    }
    submitting = false;
  }

  // Build comment tree
  type Comment = (typeof data.comments)[0];
  type CommentNode = Comment & { children: CommentNode[] };

  function buildTree(items: Comment[]): CommentNode[] {
    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];
    for (const c of items) {
      map.set(c.id, { ...c, children: [] });
    }
    for (const c of items) {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  const commentTree = $derived(buildTree(data.comments));

  const specs = $derived(data.specs);
  const deal = $derived(data.deal);
  const discount = $derived(discountPct(deal.price, deal.originalPrice));
</script>

<svelte:head>
  <title>{deal.title} - TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Deal card -->
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
    <div class="flex gap-6">
      <!-- Vote column -->
      <div class="flex flex-col items-center gap-2 shrink-0 w-14">
        <button
          onclick={() => vote(1)}
          class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-xl {userVote ===
          1
            ? 'bg-orange-100 dark:bg-orange-900 text-orange-500'
            : 'hover:bg-orange-50 dark:hover:bg-orange-950 text-gray-400 hover:text-orange-500'}"
          aria-label="Upvote"
        >
          ▲
        </button>
        <span class="text-lg font-bold {voteScore > 0 ? 'text-orange-500' : voteScore < 0 ? 'text-blue-500' : 'text-gray-500'}">
          {voteScore}
        </span>
        <button
          onclick={() => vote(-1)}
          class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-xl {userVote ===
          -1
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-500'
            : 'hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-400 hover:text-blue-500'}"
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="text-3xl font-bold text-orange-500">${deal.price.toFixed(2)}</span>
          {#if deal.originalPrice}
            <span class="text-lg text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
          {/if}
          {#if discount}
            <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">
              -{discount}%
            </span>
          {/if}
          {#if deal.shippingCost === 0}
            <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full text-sm">
              Free shipping
            </span>
          {:else}
            <span class="text-sm text-gray-400">+${deal.shippingCost.toFixed(2)} shipping</span>
          {/if}
        </div>

        <h1 class="text-xl font-semibold mb-3">{deal.title}</h1>

        <div class="flex flex-wrap gap-2 mb-4 text-sm">
          {#if deal.merchantName}
            <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">
              🏪 {deal.merchantName}
            </span>
          {/if}
          {#if deal.categoryName}
            <a
              href="/?category={deal.categorySlug}"
              class="px-2.5 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
            >
              {deal.categoryName}
            </a>
          {/if}
          <span class="text-gray-400">Posted by {deal.username} · {timeAgo(deal.createdAt)}</span>
        </div>

        {#if deal.description}
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            {deal.description}
          </p>
        {/if}

        <a
          href={deal.affiliateUrl ?? deal.url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
        >
          Get This Deal →
        </a>
      </div>
    </div>
  </div>

  <!-- Specs -->
  {#if specs}
    {@const specEntries = [
      specs.brand && ['Brand', specs.brand],
      specs.cpuModel && ['CPU', specs.cpuModel],
      specs.cpuArch && ['Architecture', specs.cpuArch],
      specs.gpuModel && ['GPU', specs.gpuModel],
      specs.ramGb && ['RAM', `${specs.ramGb}GB`],
      specs.storageGb && ['Storage', `${specs.storageGb}GB ${specs.storageType ?? ''}`],
      specs.condition && ['Condition', specs.condition],
      specs.screenSize && ['Screen', `${specs.screenSize}"`],
      specs.screenResolution && ['Resolution', specs.screenResolution],
      specs.refreshRate && ['Refresh Rate', `${specs.refreshRate}Hz`],
      specs.panelType && ['Panel', specs.panelType],
      specs.responseTime && ['Response Time', `${specs.responseTime}ms`],
    ].filter(Boolean) as [string, string][]}
    {#if specEntries.length > 0}
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold mb-4">Specifications</h2>
        <div class="flex flex-wrap gap-2">
          {#each specEntries as [label, value]}
            <div class="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
              <span class="text-gray-500 dark:text-gray-400">{label}:</span>
              <span class="ml-1 font-medium">{value}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

  <!-- Comments -->
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
    <h2 class="text-lg font-semibold mb-5">
      Comments ({data.comments.length})
    </h2>

    <!-- Comment form -->
    {#if data.user}
      <div class="mb-6">
        <textarea
          bind:value={commentBody}
          rows="3"
          placeholder="Add a comment…"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-sm"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button
            onclick={submitComment}
            disabled={submitting || !commentBody.trim()}
            class="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>
    {:else}
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-center text-gray-500 dark:text-gray-400">
        <a href="/login" class="text-orange-500 hover:text-orange-600 font-medium">Log in</a> to join the discussion.
      </div>
    {/if}

    <!-- Comment tree -->
    {#if commentTree.length === 0}
      <p class="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>
    {:else}
      {#snippet renderComment(node: any, depth: number)}
        <div class="flex gap-3 {depth > 0 ? 'mt-3' : ''}">
          <div class="w-px bg-gray-200 dark:bg-gray-700 shrink-0 {depth > 0 ? 'ml-4' : 'hidden'}"></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 text-xs text-gray-400">
              <span class="font-medium text-gray-700 dark:text-gray-300">{node.username}</span>
              <span>·</span>
              <span>{timeAgo(node.createdAt)}</span>
              <span>·</span>
              <span>Score: {node.score}</span>
            </div>
            <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{node.body}</p>
            {#each node.children as child}
              {@render renderComment(child, depth + 1)}
            {/each}
          </div>
        </div>
      {/snippet}

      <div class="space-y-4">
        {#each commentTree as root}
          {@render renderComment(root, 0)}
        {/each}
      </div>
    {/if}
  </div>
</div>
